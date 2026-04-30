// Types for web scraping functionality

export interface ScrapedEventData {
  title: string;
  description: string;
  date_time: string;
  location: string;
  prices?: PriceInfo[];
  contact_info?: ContactInfo;
  event_topic?: string[];
  companies_attending?: string[];
  presenters?: Presenter[];
  source_url: string;
  raw_html?: string;
}

export interface PriceInfo {
  type: string; // e.g., "Early Bird", "Regular", "Student", "Free"
  amount: number;
  currency: string;
  description?: string;
}

export interface ContactInfo {
  email?: string;
  phone?: string;
  website?: string;
  social_media?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
}

export interface Presenter {
  name: string;
  title?: string;
  company?: string;
  bio?: string;
  linkedin?: string;
}

export interface ScraperConfig {
  url: string;
  selectors: {
    title?: string;
    description?: string;
    date?: string;
    time?: string;
    location?: string;
    price?: string;
    contact?: string;
    presenters?: string;
    companies?: string;
    topics?: string;
  };
  type: 'static' | 'dynamic'; // static for cheerio, dynamic for puppeteer
}

export interface ScraperResult {
  success: boolean;
  events: ScrapedEventData[];
  errors?: string[];
  scraped_at: string;
  source: string;
}

// Supported event sources
export type EventSource = 
  | 'meetup'
  | 'eventbrite'
  | 'linkedin'
  | 'custom';

export interface EventSourceConfig {
  name: EventSource;
  base_url: string;
  scraper_config: ScraperConfig;
  enabled: boolean;
}

// Made with Bob