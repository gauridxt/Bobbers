/**
 * Test script to scrape demo event and save to Supabase
 * Run with: node scripts/test-scraper.js
 */

const fs = require('fs');
const path = require('path');

async function testScraper() {
  console.log('🕷️  Testing Event Scraper...\n');

  try {
    // Read demo HTML file
    const demoPath = path.join(__dirname, '../public/demo-event.html');
    const html = fs.readFileSync(demoPath, 'utf-8');
    
    console.log('✓ Demo HTML loaded');
    console.log(`  File size: ${html.length} bytes\n`);

    // Call the scrape-and-save API
    const response = await fetch('http://localhost:3000/api/scrape-and-save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sources: [
          {
            name: 'custom',
            base_url: 'http://localhost:3000/demo-event.html',
            scraper_config: {
              url: 'http://localhost:3000/demo-event.html',
              selectors: {
                title: '.event-title',
                description: '.event-description',
                date: '.event-date',
                time: '.event-time',
                location: '.event-location',
                price: '.event-pricing'
              },
              type: 'static'
            },
            enabled: true
          }
        ],
        skipDuplicates: true
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    console.log('📊 Scraping Results:');
    console.log(`  Total scraped: ${result.total_scraped}`);
    console.log(`  Saved to DB: ${result.saved}`);
    console.log(`  Skipped (duplicates): ${result.skipped}`);
    console.log(`  Errors: ${result.errors}\n`);

    if (result.saved_events && result.saved_events.length > 0) {
      console.log('✅ Saved Events:');
      result.saved_events.forEach((event, index) => {
        console.log(`\n  ${index + 1}. ${event.title}`);
        console.log(`     Category: ${event.category}`);
        console.log(`     Language: ${event.language}`);
        console.log(`     Date: ${new Date(event.date_time).toLocaleDateString()}`);
        console.log(`     Location: ${event.location}`);
      });
    }

    if (result.skipped_events && result.skipped_events.length > 0) {
      console.log('\n⚠️  Skipped Events:');
      result.skipped_events.forEach((event, index) => {
        console.log(`  ${index + 1}. ${event.title} - ${event.reason}`);
      });
    }

    if (result.error_details && result.error_details.length > 0) {
      console.log('\n❌ Errors:');
      result.error_details.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error.title} - ${error.error}`);
      });
    }

    console.log('\n✨ Test completed successfully!');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 Make sure the development server is running:');
      console.log('   npm run dev');
    }
    
    process.exit(1);
  }
}

// Run the test
testScraper();

// Made with Bob
