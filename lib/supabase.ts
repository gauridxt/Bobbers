import { createClient } from '@supabase/supabase-js';
import { Event, EventCategory, EventLanguage } from './types';
import { ScrapedEventData } from './scraper-types';
import { categorizeEvent, detectLanguage } from './scraper-utils';

// Supabase client configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database helper functions
export const eventService = {
  // Fetch all events
  async getAllEvents(): Promise<Event[]> {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date_time', { ascending: true });

    if (error) {
      console.error('Error fetching events:', error);
      return [];
    }

    return data || [];
  },

  // Fetch events with filters
  async getFilteredEvents(
    categories?: string[],
    languages?: string[],
    searchQuery?: string
  ): Promise<Event[]> {
    let query = supabase
      .from('events')
      .select('*')
      .order('date_time', { ascending: true });

    // Filter by categories
    if (categories && categories.length > 0) {
      query = query.in('category', categories);
    }

    // Filter by languages
    if (languages && languages.length > 0) {
      query = query.in('language', languages);
    }

    // Search in title and description
    if (searchQuery && searchQuery.trim() !== '') {
      query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching filtered events:', error);
      return [];
    }

    return data || [];
  },

  // Create a new event (for admin use)
  async createEvent(event: Omit<Event, 'event_id' | 'created_at' | 'updated_at'>): Promise<Event | null> {
    const { data, error } = await supabase
      .from('events')
      .insert([event])
      .select()
      .single();

    if (error) {
      console.error('Error creating event:', error);
      return null;
    }

    return data;
  },

  // Update an event
  async updateEvent(eventId: string, updates: Partial<Event>): Promise<Event | null> {
    const { data, error } = await supabase
      .from('events')
      .update(updates)
      .eq('event_id', eventId)
      .select()
      .single();

    if (error) {
      console.error('Error updating event:', error);
      return null;
    }

    return data;
  },

  // Delete an event
  async deleteEvent(eventId: string): Promise<boolean> {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('event_id', eventId);

    if (error) {
      console.error('Error deleting event:', error);
      return false;
    }

    return true;
  },

  // Store scraped events in the database
  async storeScrapedEvents(scrapedEvents: ScrapedEventData[]): Promise<{ success: number; failed: number; errors: string[] }> {
    let successCount = 0;
    let failedCount = 0;
    const errors: string[] = [];

    for (const scrapedEvent of scrapedEvents) {
      try {
        // Convert scraped event to database event format
        const category = categorizeEvent(scrapedEvent);
        const language = detectLanguage(`${scrapedEvent.title} ${scrapedEvent.description}`);
        
        const eventData: Omit<Event, 'event_id' | 'created_at' | 'updated_at'> = {
          title: scrapedEvent.title,
          description: scrapedEvent.description,
          date_time: scrapedEvent.date_time,
          location: scrapedEvent.location,
          category: category as EventCategory,
          language: language as EventLanguage,
          price: scrapedEvent.prices && scrapedEvent.prices.length > 0
            ? scrapedEvent.prices[0].amount
            : 0,
          currency: scrapedEvent.prices && scrapedEvent.prices.length > 0
            ? scrapedEvent.prices[0].currency
            : 'CHF',
          registration_url: scrapedEvent.source_url,
          image_url: null,
          organizer: scrapedEvent.companies_attending && scrapedEvent.companies_attending.length > 0
            ? scrapedEvent.companies_attending[0]
            : null,
          tags: scrapedEvent.event_topic || [],
          is_featured: false,
          capacity: null,
          attendees_count: 0
        };

        // Check if event already exists (by title and date)
        const { data: existingEvents } = await supabase
          .from('events')
          .select('event_id')
          .eq('title', eventData.title)
          .eq('date_time', eventData.date_time)
          .limit(1);

        if (existingEvents && existingEvents.length > 0) {
          // Update existing event
          const { error } = await supabase
            .from('events')
            .update(eventData)
            .eq('event_id', existingEvents[0].event_id);

          if (error) {
            errors.push(`Failed to update event "${eventData.title}": ${error.message}`);
            failedCount++;
          } else {
            successCount++;
          }
        } else {
          // Insert new event
          const { error } = await supabase
            .from('events')
            .insert([eventData]);

          if (error) {
            errors.push(`Failed to insert event "${eventData.title}": ${error.message}`);
            failedCount++;
          } else {
            successCount++;
          }
        }
      } catch (error) {
        errors.push(`Error processing event "${scrapedEvent.title}": ${error instanceof Error ? error.message : 'Unknown error'}`);
        failedCount++;
      }
    }

    return { success: successCount, failed: failedCount, errors };
  },

  // Search events with advanced filters
  async searchEvents(params: {
    query?: string;
    categories?: string[];
    languages?: string[];
    startDate?: string;
    endDate?: string;
    minPrice?: number;
    maxPrice?: number;
    location?: string;
  }): Promise<Event[]> {
    let query = supabase
      .from('events')
      .select('*')
      .order('date_time', { ascending: true });

    // Text search
    if (params.query && params.query.trim() !== '') {
      query = query.or(`title.ilike.%${params.query}%,description.ilike.%${params.query}%,organizer.ilike.%${params.query}%`);
    }

    // Category filter
    if (params.categories && params.categories.length > 0) {
      query = query.in('category', params.categories);
    }

    // Language filter
    if (params.languages && params.languages.length > 0) {
      query = query.in('language', params.languages);
    }

    // Date range filter
    if (params.startDate) {
      query = query.gte('date_time', params.startDate);
    }
    if (params.endDate) {
      query = query.lte('date_time', params.endDate);
    }

    // Price range filter
    if (params.minPrice !== undefined) {
      query = query.gte('price', params.minPrice);
    }
    if (params.maxPrice !== undefined) {
      query = query.lte('price', params.maxPrice);
    }

    // Location filter
    if (params.location && params.location.trim() !== '') {
      query = query.ilike('location', `%${params.location}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error searching events:', error);
      return [];
    }

    return data || [];
  },
};

// Made with Bob
