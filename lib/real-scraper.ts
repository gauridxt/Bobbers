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
    
    console.log('Fetching Eventbrite events from:', searchUrl);
    
    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      },
      timeout: SCRAPER_TIMEOUT_MS
    });

    const html = response.data;
    console.log(`Received HTML response, length: ${html.length} characters`);
    
    // Extract event data using regex patterns
    // Eventbrite uses structured data in their HTML
    const eventPattern = /<script type="application\/ld\+json">(.*?)<\/script>/gs;
    const matches = Array.from(html.matchAll(eventPattern));
    console.log(`Found ${matches.length} JSON-LD script tags`);
    
    for (const match of matches) {
      try {
        const jsonData = JSON.parse((match as RegExpMatchArray)[1]);
        
        // Handle both single Event and array of events
        const eventArray = Array.isArray(jsonData) ? jsonData : [jsonData];
        
        for (const item of eventArray) {
          if (item['@type'] === 'Event') {
            const event: ScrapedEventData = {
              title: item.name || 'Untitled Event',
              description: item.description || '',
              date_time: item.startDate || new Date().toISOString(),
              location: item.location?.name || item.location?.address?.addressLocality || 'Zurich, Switzerland',
              prices: item.offers ? (Array.isArray(item.offers) ? item.offers : [item.offers]).map((offer: any) => ({
                type: offer.name || 'Regular',
                amount: parseFloat(offer.price) || 0,
                currency: offer.priceCurrency || 'CHF',
                description: offer.description || 'Ticket'
              })) : [],
              contact_info: {
                website: item.url || searchUrl
              },
              event_topic: extractTopics((item.name || '') + ' ' + (item.description || '')),
              companies_attending: item.organizer?.name ? [item.organizer.name] : [],
              presenters: [],
              source_url: item.url || searchUrl
            };
            
            events.push(event);
            console.log(`Extracted event: ${event.title}`);
          }
        }
      } catch (parseError) {
        console.error('Error parsing JSON-LD:', parseError);
        continue;
      }
    }

    // Fallback: Try to extract from HTML structure
    if (events.length === 0) {
      console.log('No JSON-LD events found, trying HTML extraction...');
      
      // Try multiple patterns for event cards
      const patterns = [
        /<article[^>]*class="[^"]*event[^"]*"[^>]*>(.*?)<\/article>/gs,
        /<div[^>]*class="[^"]*event-card[^"]*"[^>]*>(.*?)<\/div>/gs,
        /<div[^>]*data-testid="[^"]*event[^"]*"[^>]*>(.*?)<\/div>/gs
      ];
      
      for (const pattern of patterns) {
        const cardMatches = Array.from(html.matchAll(pattern));
        console.log(`Pattern found ${cardMatches.length} potential event cards`);
        
        for (const cardMatch of cardMatches) {
          const cardHtml = (cardMatch as RegExpMatchArray)[1];
          
          // Extract title
          const titleMatch = cardHtml.match(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/i);
          if (titleMatch) {
            const title = titleMatch[1].replace(/<[^>]*>/g, '').trim();
            
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
              
              console.log(`Extracted from HTML: ${title}`);
            }
          }
        }
        
        if (events.length > 0) break;
      }
    }
    
    console.log(`Total events extracted: ${events.length}`);

  } catch (error) {
    const errorMsg = `Eventbrite scraping failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
    errors.push(errorMsg);
    console.error('Eventbrite scraping error:', error);
    
    if (axios.isAxiosError(error)) {
      console.error('Response status:', error.response?.status);
      console.error('Response headers:', error.response?.headers);
    }
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
    
    console.log('Fetching Meetup events from:', searchUrl);
    
    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      },
      timeout: SCRAPER_TIMEOUT_MS
    });

    const html = response.data;
    console.log(`Received HTML response, length: ${html.length} characters`);
    
    // Meetup uses structured data
    const scriptPattern = /<script type="application\/ld\+json">(.*?)<\/script>/gs;
    const matches = Array.from(html.matchAll(scriptPattern));
    console.log(`Found ${matches.length} JSON-LD script tags`);
    
    for (const match of matches) {
      try {
        const jsonData = JSON.parse((match as RegExpMatchArray)[1]);
        
        // Handle both single Event and array of events
        const eventArray = Array.isArray(jsonData) ? jsonData : [jsonData];
        
        for (const item of eventArray) {
          if (item['@type'] === 'Event') {
            const event: ScrapedEventData = {
              title: item.name || 'Untitled Event',
              description: item.description || '',
              date_time: item.startDate || new Date().toISOString(),
              location: item.location?.name || item.location?.address?.addressLocality || 'Zurich, Switzerland',
              prices: item.offers ? (Array.isArray(item.offers) ? item.offers : [item.offers]).map((offer: any) => ({
                type: offer.price === '0' || offer.price === 0 ? 'Free' : 'Regular',
                amount: parseFloat(offer.price) || 0,
                currency: offer.priceCurrency || 'CHF',
                description: offer.name || 'Ticket'
              })) : [{ type: 'Free', amount: 0, currency: 'CHF', description: 'Free admission' }],
              contact_info: {
                website: item.url || searchUrl
              },
              event_topic: extractTopics((item.name || '') + ' ' + (item.description || '')),
              companies_attending: item.organizer?.name ? [item.organizer.name] : [],
              presenters: [],
              source_url: item.url || searchUrl
            };
            
            events.push(event);
            console.log(`Extracted event: ${event.title}`);
          }
        }
      } catch (parseError) {
        console.error('Error parsing JSON-LD:', parseError);
        continue;
      }
    }
    
    console.log(`Total events extracted: ${events.length}`);

  } catch (error) {
    const errorMsg = `Meetup scraping failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
    errors.push(errorMsg);
    console.error('Meetup scraping error:', error);
    
    if (axios.isAxiosError(error)) {
      console.error('Response status:', error.response?.status);
      console.error('Response headers:', error.response?.headers);
    }
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