import { createClient } from '@supabase/supabase-js';
import { Event } from './types';

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
};

// Made with Bob
