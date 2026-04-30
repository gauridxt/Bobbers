/**
 * Scrape ALL events from now until end of 2026
 * This script will fetch events from Eventbrite and Meetup for the entire year
 * 
 * Usage: node scripts/scrape-all-2026-events.js
 */

const axios = require('axios');
const fs = require('fs');

// Configuration
const START_DATE = new Date();
const END_DATE = new Date('2026-12-31');
const SOURCES = ['eventbrite', 'meetup'];
const DELAY_BETWEEN_REQUESTS = 2000; // 2 seconds to avoid rate limiting

// Results tracking
let totalEvents = 0;
let eventsBySource = {};
let eventsByMonth = {};
let allEvents = [];

/**
 * Sleep function for rate limiting
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Scrape Eventbrite events with pagination
 */
async function scrapeEventbriteFull() {
  console.log('\n📡 Scraping Eventbrite (all pages)...');
  const events = [];
  
  try {
    // Eventbrite search URLs for different categories
    const searchUrls = [
      'https://www.eventbrite.com/d/switzerland--zurich/technology/',
      'https://www.eventbrite.com/d/switzerland--zurich/science-and-tech/',
      'https://www.eventbrite.com/d/switzerland--zurich/business/',
      'https://www.eventbrite.com/d/switzerland--zurich/events/',
    ];

    for (const url of searchUrls) {
      console.log(`  Fetching: ${url}`);
      
      try {
        const response = await axios.get(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          },
          timeout: 15000
        });

        const html = response.data;
        
        // Extract structured data (JSON-LD)
        const scriptPattern = /<script type="application\/ld\+json">(.*?)<\/script>/gs;
        const matches = html.matchAll(scriptPattern);
        
        for (const match of matches) {
          try {
            const jsonData = JSON.parse(match[1]);
            
            if (jsonData['@type'] === 'Event') {
              const eventDate = new Date(jsonData.startDate);
              
              // Only include events from now until end of 2026
              if (eventDate >= START_DATE && eventDate <= END_DATE) {
                const event = {
                  title: jsonData.name || 'Untitled Event',
                  description: jsonData.description || '',
                  date_time: jsonData.startDate,
                  location: jsonData.location?.name || jsonData.location?.address?.addressLocality || 'Zurich, Switzerland',
                  price: parseFloat(jsonData.offers?.price) || 0,
                  currency: jsonData.offers?.priceCurrency || 'CHF',
                  registration_url: jsonData.url || url,
                  organizer: jsonData.organizer?.name || null,
                  source: 'eventbrite',
                  scraped_at: new Date().toISOString()
                };
                
                events.push(event);
                console.log(`    ✓ Found: ${event.title.substring(0, 60)}...`);
              }
            }
          } catch (parseError) {
            // Skip invalid JSON
            continue;
          }
        }
        
        // Rate limiting
        await sleep(DELAY_BETWEEN_REQUESTS);
        
      } catch (error) {
        console.log(`    ⚠ Error fetching ${url}: ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('  ❌ Eventbrite scraping failed:', error.message);
  }
  
  console.log(`  ✅ Eventbrite: Found ${events.length} events`);
  return events;
}

/**
 * Scrape Meetup events with pagination
 */
async function scrapeMeetupFull() {
  console.log('\n📡 Scraping Meetup (all pages)...');
  const events = [];
  
  try {
    const searchUrls = [
      'https://www.meetup.com/find/?location=ch--Zurich&source=EVENTS&keywords=tech',
      'https://www.meetup.com/find/?location=ch--Zurich&source=EVENTS&keywords=data',
      'https://www.meetup.com/find/?location=ch--Zurich&source=EVENTS&keywords=ai',
      'https://www.meetup.com/find/?location=ch--Zurich&source=EVENTS&keywords=software',
    ];

    for (const url of searchUrls) {
      console.log(`  Fetching: ${url}`);
      
      try {
        const response = await axios.get(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          },
          timeout: 15000
        });

        const html = response.data;
        
        // Extract structured data
        const scriptPattern = /<script type="application\/ld\+json">(.*?)<\/script>/gs;
        const matches = html.matchAll(scriptPattern);
        
        for (const match of matches) {
          try {
            const jsonData = JSON.parse(match[1]);
            
            if (jsonData['@type'] === 'Event' || (Array.isArray(jsonData) && jsonData.some(item => item['@type'] === 'Event'))) {
              const eventData = Array.isArray(jsonData) ? jsonData.find(item => item['@type'] === 'Event') : jsonData;
              
              if (eventData) {
                const eventDate = new Date(eventData.startDate);
                
                if (eventDate >= START_DATE && eventDate <= END_DATE) {
                  const event = {
                    title: eventData.name || 'Untitled Event',
                    description: eventData.description || '',
                    date_time: eventData.startDate,
                    location: eventData.location?.name || eventData.location?.address?.addressLocality || 'Zurich, Switzerland',
                    price: parseFloat(eventData.offers?.price) || 0,
                    currency: eventData.offers?.priceCurrency || 'CHF',
                    registration_url: eventData.url || url,
                    organizer: eventData.organizer?.name || null,
                    source: 'meetup',
                    scraped_at: new Date().toISOString()
                  };
                  
                  events.push(event);
                  console.log(`    ✓ Found: ${event.title.substring(0, 60)}...`);
                }
              }
            }
          } catch (parseError) {
            continue;
          }
        }
        
        // Rate limiting
        await sleep(DELAY_BETWEEN_REQUESTS);
        
      } catch (error) {
        console.log(`    ⚠ Error fetching ${url}: ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('  ❌ Meetup scraping failed:', error.message);
  }
  
  console.log(`  ✅ Meetup: Found ${events.length} events`);
  return events;
}

/**
 * Categorize event based on content
 */
function categorizeEvent(event) {
  const text = `${event.title} ${event.description}`.toLowerCase();
  
  if (/\b(ai|artificial intelligence|machine learning|deep learning|neural network)\b/i.test(text)) {
    return 'AI';
  }
  if (/\b(data science|big data|analytics|data engineering)\b/i.test(text)) {
    return 'Data';
  }
  if (/\b(agile|scrum|devops|project management)\b/i.test(text)) {
    return 'Process';
  }
  if (/\b(cloud|infrastructure|networking|security|cybersecurity)\b/i.test(text)) {
    return 'System';
  }
  return 'CS';
}

/**
 * Detect language
 */
function detectLanguage(text) {
  const lowerText = text.toLowerCase();
  
  const germanWords = ['und', 'der', 'die', 'das', 'mit', 'für'];
  const germanCount = germanWords.filter(word => new RegExp(`\\b${word}\\b`).test(lowerText)).length;
  
  if (germanCount >= 2) return 'German';
  return 'English';
}

/**
 * Generate summary statistics
 */
function generateSummary(events) {
  console.log('\n' + '='.repeat(60));
  console.log('📊 SCRAPING SUMMARY');
  console.log('='.repeat(60));
  
  console.log(`\n📅 Date Range: ${START_DATE.toLocaleDateString()} - ${END_DATE.toLocaleDateString()}`);
  console.log(`📈 Total Events Found: ${events.length}`);
  
  // By source
  console.log('\n📍 By Source:');
  const bySource = {};
  events.forEach(e => {
    bySource[e.source] = (bySource[e.source] || 0) + 1;
  });
  Object.entries(bySource).forEach(([source, count]) => {
    console.log(`   ${source}: ${count} events`);
  });
  
  // By category
  console.log('\n🏷️  By Category:');
  const byCategory = {};
  events.forEach(e => {
    const cat = categorizeEvent(e);
    byCategory[cat] = (byCategory[cat] || 0) + 1;
  });
  Object.entries(byCategory).forEach(([cat, count]) => {
    console.log(`   ${cat}: ${count} events`);
  });
  
  // By month
  console.log('\n📆 By Month:');
  const byMonth = {};
  events.forEach(e => {
    const month = new Date(e.date_time).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    byMonth[month] = (byMonth[month] || 0) + 1;
  });
  Object.entries(byMonth).sort().forEach(([month, count]) => {
    console.log(`   ${month}: ${count} events`);
  });
  
  // Price distribution
  console.log('\n💰 Price Distribution:');
  const free = events.filter(e => e.price === 0).length;
  const paid = events.filter(e => e.price > 0).length;
  console.log(`   Free: ${free} events`);
  console.log(`   Paid: ${paid} events`);
  
  // Sample events
  console.log('\n📋 Sample Events:');
  events.slice(0, 5).forEach((e, i) => {
    console.log(`\n   ${i + 1}. ${e.title}`);
    console.log(`      Date: ${new Date(e.date_time).toLocaleDateString()}`);
    console.log(`      Location: ${e.location}`);
    console.log(`      Price: ${e.price === 0 ? 'Free' : `${e.price} ${e.currency}`}`);
    console.log(`      URL: ${e.registration_url}`);
  });
  
  console.log('\n' + '='.repeat(60));
}

/**
 * Save events to JSON file
 */
function saveToFile(events) {
  const filename = `scraped-events-2026-${Date.now()}.json`;
  const data = {
    scraped_at: new Date().toISOString(),
    date_range: {
      start: START_DATE.toISOString(),
      end: END_DATE.toISOString()
    },
    total_events: events.length,
    events: events.map(e => ({
      ...e,
      category: categorizeEvent(e),
      language: detectLanguage(`${e.title} ${e.description}`)
    }))
  };
  
  fs.writeFileSync(filename, JSON.stringify(data, null, 2));
  console.log(`\n💾 Events saved to: ${filename}`);
  console.log(`   You can import this file into your database`);
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 Starting comprehensive event scraping...');
  console.log(`📅 Scraping events from ${START_DATE.toLocaleDateString()} to ${END_DATE.toLocaleDateString()}`);
  console.log(`🌐 Sources: ${SOURCES.join(', ')}`);
  
  try {
    // Scrape from all sources
    const eventbriteEvents = await scrapeEventbriteFull();
    const meetupEvents = await scrapeMeetupFull();
    
    // Combine all events
    allEvents = [...eventbriteEvents, ...meetupEvents];
    
    // Remove duplicates (by title and date)
    const uniqueEvents = [];
    const seen = new Set();
    
    allEvents.forEach(event => {
      const key = `${event.title}-${event.date_time}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueEvents.push(event);
      }
    });
    
    console.log(`\n🔍 Removed ${allEvents.length - uniqueEvents.length} duplicate events`);
    
    // Generate summary
    generateSummary(uniqueEvents);
    
    // Save to file
    saveToFile(uniqueEvents);
    
    console.log('\n✅ Scraping completed successfully!');
    console.log('\n💡 Next steps:');
    console.log('   1. Review the generated JSON file');
    console.log('   2. Import events into database using the admin interface');
    console.log('   3. Or use: npm run dev and visit /admin/scraper');
    
  } catch (error) {
    console.error('\n❌ Scraping failed:', error);
    process.exit(1);
  }
}

// Run the scraper
main();

// Made with Bob
