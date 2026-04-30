import { NextRequest, NextResponse } from 'next/server';
import { 
  EventScraperOrchestrator,
  CustomScraper
} from '@/lib/event-scraper';
import { EventSourceConfig } from '@/lib/scraper-types';
import { categorizeEvent, detectLanguage } from '@/lib/scraper-utils';
import { supabase, eventService } from '@/lib/supabase';

/**
 * POST /api/scrape-and-save
 * Scrape events and save them directly to Supabase
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sources, skipDuplicates = true } = body;

    // Validate request
    if (!sources || !Array.isArray(sources)) {
      return NextResponse.json(
        { error: 'Invalid request: sources array required' },
        { status: 400 }
      );
    }

    const orchestrator = new EventScraperOrchestrator();

    // Add sources to orchestrator
    for (const source of sources) {
      orchestrator.addSource(source as EventSourceConfig);
    }

    // Scrape all sources
    const results = await orchestrator.scrapeAll();

    // Process and categorize events
    const processedEvents = orchestrator.processEvents(results);

    // Save to database
    const savedEvents = [];
    const skippedEvents = [];
    const errors = [];

    for (const event of processedEvents) {
      try {
        // Check for duplicates if enabled
        if (skipDuplicates) {
          const { data: existing } = await supabase
            .from('events')
            .select('event_id')
            .eq('title', event.title)
            .eq('date_time', event.date_time)
            .single();

          if (existing) {
            skippedEvents.push({
              title: event.title,
              reason: 'Duplicate event already exists'
            });
            continue;
          }
        }

        // Prepare event data for database
        const eventData = {
          title: event.title,
          description: event.description,
          date_time: event.date_time,
          location: event.location,
          category: categorizeEvent(event),
          language: detectLanguage(`${event.title} ${event.description}`),
          rsvp_url: event.source_url
        };

        // Save to database
        const savedEvent = await eventService.createEvent(eventData);
        
        if (savedEvent) {
          savedEvents.push(savedEvent);
        } else {
          errors.push({
            title: event.title,
            error: 'Failed to save to database'
          });
        }
      } catch (error) {
        errors.push({
          title: event.title,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return NextResponse.json({
      success: true,
      total_scraped: processedEvents.length,
      saved: savedEvents.length,
      skipped: skippedEvents.length,
      errors: errors.length,
      saved_events: savedEvents,
      skipped_events: skippedEvents,
      error_details: errors,
      scraped_at: new Date().toISOString()
    });

  } catch (error) {
    console.error('Scraping and saving error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to scrape and save events',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Made with Bob