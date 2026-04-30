// Real web scraper implementation for Eventbrite and LinkedIn
import axios from 'axios';
import { ScrapedEventData, ScraperResult } from './scraper-types';
import { extractPrices, extractTopics, cleanText, parseEventDate } from './scraper-utils';

// Configuration constants
const SCRAPER_TIMEOUT_MS = 10000;
const DEFAULT_EVENT_OFFSET_DAYS = 7;

/**
 * Scrape events from Eventbrite
 */
export async function scrapeEventbrite(): Promise<ScraperResult> {
  const events: ScrapedEventData[] = [];
  const errors: string[] = [];

  try {
    // Eventbrite search URL for Zurich tech events
    const searchUrl = 'https://www.eventbrite.com/d/switzerland--zurich/events/';
    
    console.log('Fetching Eventbrite events...');
    
    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: SCRAPER_TIMEOUT_MS
    });

    const html = response.data;
    
    // Extract event data using regex patterns
    // Eventbrite uses structured data in their HTML
    const eventPattern = /<script type="application\/ld\+json">(.*?)<\/script>/gs;
    const matches = html.matchAll(eventPattern);
    
    for (const match of matches) {
      try {
        const jsonData = JSON.parse(match[1]);
        
        if (jsonData['@type'] === 'Event') {
          const event: ScrapedEventData = {
            title: jsonData.name || 'Untitled Event',
            description: jsonData.description || '',
            date_time: jsonData.startDate || new Date().toISOString(),
            location: jsonData.location?.name || jsonData.location?.address?.addressLocality || 'Zurich, Switzerland',
            prices: jsonData.offers ? [{
              type: 'Regular',
              amount: parseFloat(jsonData.offers.price) || 0,
              currency: jsonData.offers.priceCurrency || 'CHF',
              description: jsonData.offers.name || 'Ticket'
            }] : [],
            contact_info: {
              website: jsonData.url || searchUrl
            },
            event_topic: extractTopics(jsonData.name + ' ' + jsonData.description),
            companies_attending: jsonData.organizer?.name ? [jsonData.organizer.name] : [],
            presenters: [],
            source_url: jsonData.url || searchUrl
          };
          
          events.push(event);
        }
      } catch (parseError) {
        // Skip invalid JSON
        continue;
      }
    }

    // Fallback: Extract from HTML if structured data not found
    if (events.length === 0) {
      const titlePattern = /<h3[^>]*class="[^"]*event-card__title[^"]*"[^>]*>(.*?)<\/h3>/gs;
      const titleMatches = html.matchAll(titlePattern);
      
      for (const match of titleMatches) {
        const title = match[1].replace(/<[^>]*>/g, '').trim();
        if (title && title.length > 5) {
          const defaultDate = new Date();
          defaultDate.setDate(defaultDate.getDate() + DEFAULT_EVENT_OFFSET_DAYS);
          
          events.push({
            title: cleanText(title),
            description: 'Event details available on Eventbrite',
            date_time: defaultDate.toISOString(),
            location: 'Zurich, Switzerland',
            prices: [],
            source_url: searchUrl,
            event_topic: extractTopics(title)
          });
        }
      }
    }

  } catch (error) {
    errors.push(`Eventbrite scraping failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    console.error('Eventbrite scraping error:', error);
  }

  return {
    success: events.length > 0,
    events,
    errors,
    scraped_at: new Date().toISOString(),
    source: 'eventbrite'
  };
}

/**
 * Scrape events from LinkedIn (requires authentication in production)
 */
export async function scrapeLinkedIn(): Promise<ScraperResult> {
  const events: ScrapedEventData[] = [];
  const errors: string[] = [];

  try {
    // Note: LinkedIn requires authentication for full access
    // This is a simplified version that would need proper auth in production
    
    errors.push('LinkedIn scraping requires authentication. Please use LinkedIn API or manual import.');
    
    // Placeholder: Return sample LinkedIn-style events
    // In production, you would use LinkedIn API with proper OAuth
    
  } catch (error) {
    errors.push(`LinkedIn scraping failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    console.error('LinkedIn scraping error:', error);
  }

  return {
    success: false,
    events,
    errors,
    scraped_at: new Date().toISOString(),
    source: 'linkedin'
  };
}

/**
 * Scrape events from Meetup.com
 */
export async function scrapeMeetup(): Promise<ScraperResult> {
  const events: ScrapedEventData[] = [];
  const errors: string[] = [];

  try {
    const searchUrl = 'https://www.meetup.com/find/?location=ch--Zurich&source=EVENTS';
    
    console.log('Fetching Meetup events...');
    
    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: SCRAPER_TIMEOUT_MS
    });

    const html = response.data;
    
    // Meetup uses structured data
    const scriptPattern = /<script type="application\/ld\+json">(.*?)<\/script>/gs;
    const matches = html.matchAll(scriptPattern);
    
    for (const match of matches) {
      try {
        const jsonData = JSON.parse(match[1]);
        
        if (jsonData['@type'] === 'Event' || (Array.isArray(jsonData) && jsonData.some((item: any) => item['@type'] === 'Event'))) {
          const eventData = Array.isArray(jsonData) ? jsonData.find((item: any) => item['@type'] === 'Event') : jsonData;
          
          if (eventData) {
            const event: ScrapedEventData = {
              title: eventData.name || 'Untitled Event',
              description: eventData.description || '',
              date_time: eventData.startDate || new Date().toISOString(),
              location: eventData.location?.name || eventData.location?.address?.addressLocality || 'Zurich, Switzerland',
              prices: eventData.offers ? [{
                type: eventData.offers.price === '0' ? 'Free' : 'Regular',
                amount: parseFloat(eventData.offers.price) || 0,
                currency: eventData.offers.priceCurrency || 'CHF',
                description: eventData.offers.name || 'Ticket'
              }] : [{ type: 'Free', amount: 0, currency: 'CHF', description: 'Free admission' }],
              contact_info: {
                website: eventData.url || searchUrl
              },
              event_topic: extractTopics(eventData.name + ' ' + eventData.description),
              companies_attending: eventData.organizer?.name ? [eventData.organizer.name] : [],
              presenters: [],
              source_url: eventData.url || searchUrl
            };
            
            events.push(event);
          }
        }
      } catch (parseError) {
        continue;
      }
    }

  } catch (error) {
    errors.push(`Meetup scraping failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    console.error('Meetup scraping error:', error);
  }

  return {
    success: events.length > 0,
    events,
    errors,
    scraped_at: new Date().toISOString(),
    source: 'meetup'
  };
}

/**
 * Main scraper function that combines all sources
 */
export async function scrapeAllSources(): Promise<ScraperResult[]> {
  console.log('Starting web scraping from all sources...');
  
  const results = await Promise.all([
    scrapeEventbrite(),
    scrapeMeetup(),
    // scrapeLinkedIn() // Disabled by default - requires auth
  ]);
  
  return results;
}

// Made with Bob