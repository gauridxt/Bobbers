// Main event scraper with support for multiple sources

import { 
  ScrapedEventData, 
  ScraperConfig, 
  ScraperResult,
  EventSourceConfig 
} from './scraper-types';
import {
  extractPrices,
  extractContactInfo,
  extractPresenters,
  extractCompanies,
  extractTopics,
  categorizeEvent,
  detectLanguage,
  cleanText,
  parseEventDate
} from './scraper-utils';

/**
 * Base scraper class
 */
export class EventScraper {
  protected config: ScraperConfig;

  constructor(config: ScraperConfig) {
    this.config = config;
  }

  /**
   * Scrape events from a URL using Cheerio (static content)
   */
  async scrapeStatic(html: string): Promise<ScrapedEventData[]> {
    const events: ScrapedEventData[] = [];
    
    try {
      // Note: In production, you would use cheerio here
      // const $ = cheerio.load(html);
      // This is a placeholder implementation
      
      const event = this.extractEventData(html);
      if (event) {
        events.push(event);
      }
    } catch (error) {
      console.error('Error scraping static content:', error);
    }

    return events;
  }

  /**
   * Scrape events from a URL using Puppeteer (dynamic content)
   */
  async scrapeDynamic(url: string): Promise<ScrapedEventData[]> {
    const events: ScrapedEventData[] = [];
    
    try {
      // Note: In production, you would use puppeteer here
      // const browser = await puppeteer.launch();
      // const page = await browser.newPage();
      // await page.goto(url);
      // const html = await page.content();
      // await browser.close();
      
      // This is a placeholder implementation
      console.log(`Would scrape dynamic content from: ${url}`);
    } catch (error) {
      console.error('Error scraping dynamic content:', error);
    }

    return events;
  }

  /**
   * Extract event data from HTML content
   */
  private extractEventData(html: string): ScrapedEventData | null {
    try {
      // Extract text content (simplified - in production use cheerio selectors)
      const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
      
      const title = this.extractTitle(text);
      const description = this.extractDescription(text);
      const dateTime = this.extractDateTime(text);
      const location = this.extractLocation(text);

      if (!title || !dateTime) {
        return null;
      }

      const event: ScrapedEventData = {
        title: cleanText(title),
        description: cleanText(description),
        date_time: dateTime,
        location: cleanText(location),
        prices: extractPrices(text),
        contact_info: extractContactInfo(text),
        event_topic: extractTopics(text),
        companies_attending: extractCompanies(text),
        presenters: extractPresenters(text),
        source_url: this.config.url,
        raw_html: html
      };

      return event;
    } catch (error) {
      console.error('Error extracting event data:', error);
      return null;
    }
  }

  private extractTitle(text: string): string {
    // Look for title patterns
    const titleMatch = text.match(/^(.{10,100}?)(?:\n|$)/);
    return titleMatch ? titleMatch[1].trim() : '';
  }

  private extractDescription(text: string): string {
    // Extract description (first few sentences)
    const sentences = text.match(/[^.!?]+[.!?]+/g);
    return sentences ? sentences.slice(0, 3).join(' ') : text.substring(0, 500);
  }

  private extractDateTime(text: string): string {
    // Look for date patterns
    const datePatterns = [
      /(\d{1,2}[./]\d{1,2}[./]\d{4})/,
      /(\d{4}-\d{2}-\d{2})/,
      /(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),?\s+(\d{1,2})\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})/i
    ];

    for (const pattern of datePatterns) {
      const match = text.match(pattern);
      if (match) {
        const parsed = parseEventDate(match[0]);
        if (parsed) return parsed;
      }
    }

    return new Date().toISOString();
  }

  private extractLocation(text: string): string {
    // Look for location patterns
    const locationPatterns = [
      /(?:at|location:|venue:)\s*([^,\n]{5,100})/i,
      /\b(Zurich|Zürich|Geneva|Basel|Bern|Lausanne)[^,\n]{0,50}/i
    ];

    for (const pattern of locationPatterns) {
      const match = text.match(pattern);
      if (match) {
        return match[1] || match[0];
      }
    }

    return 'Zurich, Switzerland';
  }
}

/**
 * Meetup.com scraper adapter
 */
export class MeetupScraper extends EventScraper {
  constructor(url: string) {
    super({
      url,
      selectors: {
        title: '.event-title',
        description: '.event-description',
        date: '.event-date',
        time: '.event-time',
        location: '.event-location',
        price: '.event-price'
      },
      type: 'dynamic'
    });
  }

  async scrape(): Promise<ScraperResult> {
    const events = await this.scrapeDynamic(this.config.url);
    
    return {
      success: events.length > 0,
      events,
      scraped_at: new Date().toISOString(),
      source: 'meetup'
    };
  }
}

/**
 * Eventbrite scraper adapter
 */
export class EventbriteScraper extends EventScraper {
  constructor(url: string) {
    super({
      url,
      selectors: {
        title: '.event-title',
        description: '.event-description',
        date: '.event-date',
        location: '.event-location',
        price: '.ticket-price'
      },
      type: 'static'
    });
  }

  async scrape(html: string): Promise<ScraperResult> {
    const events = await this.scrapeStatic(html);
    
    return {
      success: events.length > 0,
      events,
      scraped_at: new Date().toISOString(),
      source: 'eventbrite'
    };
  }
}

/**
 * LinkedIn Events scraper adapter
 */
export class LinkedInScraper extends EventScraper {
  constructor(url: string) {
    super({
      url,
      selectors: {
        title: '.event-card__title',
        description: '.event-card__description',
        date: '.event-card__date',
        location: '.event-card__location'
      },
      type: 'dynamic'
    });
  }

  async scrape(): Promise<ScraperResult> {
    const events = await this.scrapeDynamic(this.config.url);
    
    return {
      success: events.length > 0,
      events,
      scraped_at: new Date().toISOString(),
      source: 'linkedin'
    };
  }
}

/**
 * Generic custom website scraper
 */
export class CustomScraper extends EventScraper {
  constructor(config: ScraperConfig) {
    super(config);
  }

  async scrape(html?: string): Promise<ScraperResult> {
    let events: ScrapedEventData[] = [];
    
    if (this.config.type === 'static' && html) {
      events = await this.scrapeStatic(html);
    } else if (this.config.type === 'dynamic') {
      events = await this.scrapeDynamic(this.config.url);
    }
    
    return {
      success: events.length > 0,
      events,
      scraped_at: new Date().toISOString(),
      source: 'custom'
    };
  }
}

/**
 * Main scraper orchestrator
 */
export class EventScraperOrchestrator {
  private sources: EventSourceConfig[] = [];

  addSource(source: EventSourceConfig) {
    this.sources.push(source);
  }

  async scrapeAll(): Promise<ScraperResult[]> {
    const results: ScraperResult[] = [];

    for (const source of this.sources) {
      if (!source.enabled) continue;

      try {
        let scraper: EventScraper;
        
        switch (source.name) {
          case 'meetup':
            scraper = new MeetupScraper(source.base_url);
            results.push(await (scraper as MeetupScraper).scrape());
            break;
          case 'linkedin':
            scraper = new LinkedInScraper(source.base_url);
            results.push(await (scraper as LinkedInScraper).scrape());
            break;
          case 'custom':
            scraper = new CustomScraper(source.scraper_config);
            results.push(await (scraper as CustomScraper).scrape());
            break;
        }
      } catch (error) {
        results.push({
          success: false,
          events: [],
          errors: [error instanceof Error ? error.message : 'Unknown error'],
          scraped_at: new Date().toISOString(),
          source: source.name
        });
      }
    }

    return results;
  }

  /**
   * Process and categorize scraped events
   */
  processEvents(results: ScraperResult[]): ScrapedEventData[] {
    const allEvents: ScrapedEventData[] = [];

    for (const result of results) {
      if (result.success) {
        for (const event of result.events) {
          // Add categorization
          const category = categorizeEvent(event);
          const language = detectLanguage(`${event.title} ${event.description}`);
          
          allEvents.push({
            ...event,
            // These would be added to the Event type when saving to DB
          });
        }
      }
    }

    return allEvents;
  }
}

// Made with Bob