// Main event scraper with support for multiple sources

import {
  ScrapedEventData,
  ScraperConfig,
  ScraperResult,
  EventSourceConfig,
  PriceInfo,
  Presenter
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
  protected extractEventData(html: string): ScrapedEventData | null {
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

  protected extractLocation(text: string): string {
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
        title: '[data-testid="event-title"], .event-card__title, h1.event-title',
        description: '[data-testid="event-description"], .event-description, .summary',
        date: '[data-testid="event-date"], .event-date, time',
        location: '[data-testid="event-location"], .event-location, .location-info',
        price: '[data-testid="ticket-price"], .ticket-price, .price'
      },
      type: 'static'
    });
  }

  async scrape(html?: string): Promise<ScraperResult> {
    try {
      // If HTML is provided, use it; otherwise fetch from URL
      let content = html;
      if (!content) {
        const response = await fetch(this.config.url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
        content = await response.text();
      }

      const events = await this.scrapeEventbriteContent(content);
      
      return {
        success: events.length > 0,
        events,
        scraped_at: new Date().toISOString(),
        source: 'eventbrite'
      };
    } catch (error) {
      return {
        success: false,
        events: [],
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        scraped_at: new Date().toISOString(),
        source: 'eventbrite'
      };
    }
  }

  private async scrapeEventbriteContent(html: string): Promise<ScrapedEventData[]> {
    const events: ScrapedEventData[] = [];
    
    // Extract JSON-LD structured data (Eventbrite often uses this)
    const jsonLdMatches = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/gs);
    
    if (jsonLdMatches) {
      for (const match of jsonLdMatches) {
        try {
          const jsonContent = match.replace(/<script[^>]*>/, '').replace(/<\/script>/, '');
          const data = JSON.parse(jsonContent);
          
          if (data['@type'] === 'Event' || (Array.isArray(data) && data.some((item: any) => item['@type'] === 'Event'))) {
            const eventData = Array.isArray(data) ? data.find((item: any) => item['@type'] === 'Event') : data;
            
            if (eventData) {
              events.push({
                title: cleanText(eventData.name || ''),
                description: cleanText(eventData.description || ''),
                date_time: eventData.startDate || new Date().toISOString(),
                location: this.extractLocationFromJsonLd(eventData.location),
                prices: this.extractPricesFromJsonLd(eventData.offers),
                source_url: eventData.url || this.config.url,
                event_topic: eventData.keywords ? eventData.keywords.split(',').map((k: string) => k.trim()) : [],
                presenters: eventData.performer ? this.extractPerformersFromJsonLd(eventData.performer) : []
              });
            }
          }
        } catch (e) {
          console.error('Error parsing JSON-LD:', e);
        }
      }
    }

    // Fallback: Parse HTML structure
    if (events.length === 0) {
      const eventBlocks = this.extractEventBlocks(html);
      for (const block of eventBlocks) {
        const event = this.extractEventData(block);
        if (event) {
          events.push(event);
        }
      }
    }

    return events;
  }

  private extractLocationFromJsonLd(location: any): string {
    if (!location) return 'Zurich, Switzerland';
    if (typeof location === 'string') return location;
    if (location.name) return location.name;
    if (location.address) {
      const addr = location.address;
      return `${addr.streetAddress || ''}, ${addr.addressLocality || ''}, ${addr.addressCountry || ''}`.trim();
    }
    return 'Zurich, Switzerland';
  }

  private extractPricesFromJsonLd(offers: any): PriceInfo[] {
    if (!offers) return [];
    const offerArray = Array.isArray(offers) ? offers : [offers];
    
    return offerArray.map((offer: any) => ({
      type: offer.name || 'General',
      amount: parseFloat(offer.price) || 0,
      currency: offer.priceCurrency || 'CHF',
      description: offer.description || ''
    }));
  }

  private extractPerformersFromJsonLd(performers: any): Presenter[] {
    if (!performers) return [];
    const performerArray = Array.isArray(performers) ? performers : [performers];
    
    return performerArray.map((performer: any) => ({
      name: performer.name || '',
      title: performer.jobTitle || '',
      company: performer.affiliation?.name || '',
      bio: performer.description || ''
    }));
  }

  private extractEventBlocks(html: string): string[] {
    // Split HTML into potential event blocks
    const blocks: string[] = [];
    const eventCardPattern = /<article[^>]*>.*?<\/article>/gs;
    const matches = html.match(eventCardPattern);
    
    if (matches) {
      blocks.push(...matches);
    }
    
    return blocks;
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
        title: '.event-card__title, [data-test-event-card-title]',
        description: '.event-card__description, [data-test-event-card-description]',
        date: '.event-card__date, [data-test-event-card-date]',
        location: '.event-card__location, [data-test-event-card-location]'
      },
      type: 'dynamic'
    });
  }

  async scrape(html?: string): Promise<ScraperResult> {
    try {
      // LinkedIn requires authentication, so we'll work with provided HTML
      if (!html) {
        return {
          success: false,
          events: [],
          errors: ['LinkedIn scraping requires authentication. Please provide HTML content.'],
          scraped_at: new Date().toISOString(),
          source: 'linkedin'
        };
      }

      const events = await this.scrapeLinkedInContent(html);
      
      return {
        success: events.length > 0,
        events,
        scraped_at: new Date().toISOString(),
        source: 'linkedin'
      };
    } catch (error) {
      return {
        success: false,
        events: [],
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        scraped_at: new Date().toISOString(),
        source: 'linkedin'
      };
    }
  }

  private async scrapeLinkedInContent(html: string): Promise<ScrapedEventData[]> {
    const events: ScrapedEventData[] = [];
    
    // LinkedIn uses React and dynamic content, so we parse the HTML structure
    // Look for event cards in the HTML
    const eventCardPattern = /<div[^>]*class="[^"]*event-card[^"]*"[^>]*>.*?<\/div>/gs;
    const matches = html.match(eventCardPattern);
    
    if (matches) {
      for (const match of matches) {
        try {
          const event = this.parseLinkedInEventCard(match);
          if (event) {
            events.push(event);
          }
        } catch (e) {
          console.error('Error parsing LinkedIn event card:', e);
        }
      }
    }

    // Also look for JSON data in script tags
    const scriptDataPattern = /<script[^>]*type="application\/json"[^>]*>(.*?)<\/script>/gs;
    const scriptMatches = html.match(scriptDataPattern);
    
    if (scriptMatches) {
      for (const match of scriptMatches) {
        try {
          const jsonContent = match.replace(/<script[^>]*>/, '').replace(/<\/script>/, '');
          const data = JSON.parse(jsonContent);
          
          // LinkedIn often nests event data in their JSON structure
          if (data.included && Array.isArray(data.included)) {
            for (const item of data.included) {
              if (item.entityUrn && item.entityUrn.includes('event')) {
                const event = this.parseLinkedInJsonEvent(item);
                if (event) {
                  events.push(event);
                }
              }
            }
          }
        } catch (e) {
          console.error('Error parsing LinkedIn JSON data:', e);
        }
      }
    }

    return events;
  }

  private parseLinkedInEventCard(html: string): ScrapedEventData | null {
    // Extract text content
    const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
    
    // Try to extract title (usually the first significant text)
    const titleMatch = text.match(/([A-Z][^.!?]{10,100})/);
    const title = titleMatch ? titleMatch[1].trim() : '';
    
    if (!title) return null;

    return {
      title: cleanText(title),
      description: cleanText(text.substring(0, 500)),
      date_time: new Date().toISOString(), // Would need better parsing
      location: this.extractLocation(text),
      source_url: this.config.url,
      event_topic: extractTopics(text),
      companies_attending: extractCompanies(text)
    };
  }

  private parseLinkedInJsonEvent(data: any): ScrapedEventData | null {
    try {
      return {
        title: cleanText(data.title || data.name || ''),
        description: cleanText(data.description || ''),
        date_time: data.startAt || data.startDate || new Date().toISOString(),
        location: data.venue?.name || data.location || 'Online',
        source_url: data.url || this.config.url,
        event_topic: data.topics || [],
        companies_attending: data.organizers ? [data.organizers.name] : []
      };
    } catch (e) {
      return null;
    }
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