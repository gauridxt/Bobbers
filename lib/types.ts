// Event categories as defined in the README
export type EventCategory = 'AI' | 'Data' | 'Process' | 'System' | 'CS';

// Event language options
export type EventLanguage = 'English' | 'German' | 'French' | 'Italian';

// Main Event interface based on the database schema
export interface Event {
  event_id: string;
  title: string;
  description: string;
  date_time: string; // ISO 8601 timestamp
  location: string;
  category: EventCategory;
  language: EventLanguage;
  price: number;
  currency: string;
  registration_url: string;
  image_url: string | null;
  organizer: string | null;
  tags: string[];
  is_featured: boolean;
  capacity: number | null;
  attendees_count: number;
  created_at?: string;
  updated_at?: string;
}

// Filter state for search and filtering
export interface EventFilters {
  searchQuery: string;
  categories: EventCategory[];
  languages: EventLanguage[];
  dateFrom?: string;
  dateTo?: string;
}

// Made with Bob
