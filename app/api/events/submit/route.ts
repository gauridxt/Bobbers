import { NextRequest, NextResponse } from 'next/server';
import { eventService } from '@/lib/supabase';
import { categorizeEvent, detectLanguage } from '@/lib/scraper-utils';
import { Event } from '@/lib/types';

/**
 * POST /api/events/submit
 * Submit a new event from user input
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Extract and validate required fields
    const { title, description, date_time, location, rsvp_url, free_food } = body;
    
    // Validation errors
    const errors: Record<string, string> = {};
    
    if (!title || typeof title !== 'string' || title.trim().length < 3) {
      errors.title = 'Title must be at least 3 characters';
    } else if (title.length > 200) {
      errors.title = 'Title must be less than 200 characters';
    }
    
    if (!description || typeof description !== 'string' || description.trim().length < 10) {
      errors.description = 'Description must be at least 10 characters';
    } else if (description.length > 2000) {
      errors.description = 'Description must be less than 2000 characters';
    }
    
    if (!date_time || typeof date_time !== 'string') {
      errors.date_time = 'Date and time are required';
    } else {
      // Validate date format and ensure it's in the future
      const eventDate = new Date(date_time);
      if (isNaN(eventDate.getTime())) {
        errors.date_time = 'Invalid date format';
      } else if (eventDate < new Date()) {
        errors.date_time = 'Event date must be in the future';
      }
    }
    
    if (!location || typeof location !== 'string' || location.trim().length < 3) {
      errors.location = 'Location must be at least 3 characters';
    } else if (location.length > 200) {
      errors.location = 'Location must be less than 200 characters';
    }
    
    // Validate required RSVP URL
    if (!rsvp_url || typeof rsvp_url !== 'string' || !rsvp_url.trim()) {
      errors.rsvp_url = 'Event URL is required';
    } else {
      try {
        new URL(rsvp_url);
      } catch {
        errors.rsvp_url = 'Invalid URL format';
      }
    }
    
    const rsvpUrl = rsvp_url || '';
    
    // Return validation errors if any
    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          errors
        },
        { status: 400 }
      );
    }
    
    // Auto-detect category and language
    const scrapedEventData = {
      title: title.trim(),
      description: description.trim(),
      date_time,
      location: location.trim(),
      source_url: rsvpUrl,
      event_topic: [],
      companies_attending: [],
      prices: []
    };
    
    const category = categorizeEvent(scrapedEventData);
    const language = detectLanguage(`${title} ${description}`);
    
    // Prepare event data for database
    const eventData: Omit<Event, 'event_id' | 'created_at' | 'updated_at'> = {
      title: title.trim(),
      description: description.trim(),
      date_time,
      location: location.trim(),
      category,
      language,
      rsvp_url: rsvpUrl,
      free_food: free_food === true // Default to false if not provided or invalid
    };
    
    // Store event in database
    const createdEvent = await eventService.createEvent(eventData);
    
    if (!createdEvent) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Failed to create event. Please try again later.' 
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      event: createdEvent,
      message: 'Event submitted successfully!'
    });
    
  } catch (error) {
    console.error('Event submission error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'An unexpected error occurred. Please try again later.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Made with Bob