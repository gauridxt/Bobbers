import { NextRequest, NextResponse } from 'next/server';
import {
  EventScraperOrchestrator,
  MeetupScraper,
  EventbriteScraper,
  LinkedInScraper,
  CustomScraper
} from '@/lib/event-scraper';
import { EventSourceConfig, ScraperResult } from '@/lib/scraper-types';
import { categorizeEvent, detectLanguage } from '@/lib/scraper-utils';
import { eventService } from '@/lib/supabase';

/**
 * POST /api/scrape
 * Trigger web scraping for events
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sources, mode } = body;

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

    // Add category and language to each event
    const enrichedEvents = processedEvents.map(event => ({
      ...event,
      category: categorizeEvent(event),
      language: detectLanguage(`${event.title} ${event.description}`)
    }));

    // Store events in database if mode is 'store' or 'both'
    let storageResult = null;
    if (mode === 'store' || mode === 'both' || !mode) {
      storageResult = await eventService.storeScrapedEvents(enrichedEvents);
    }

    return NextResponse.json({
      success: true,
      total_events: enrichedEvents.length,
      events: mode === 'preview' ? enrichedEvents : undefined,
      storage: storageResult,
      results: results.map(r => ({
        source: r.source,
        success: r.success,
        event_count: r.events.length,
        errors: r.errors
      })),
      scraped_at: new Date().toISOString()
    });

  } catch (error) {
    console.error('Scraping error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to scrape events',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/scrape/sources
 * Get available scraping sources
 */
export async function GET(request: NextRequest) {
  const availableSources: EventSourceConfig[] = [
    {
      name: 'meetup',
      base_url: 'https://www.meetup.com/find/?location=ch--Zurich&source=EVENTS',
      scraper_config: {
        url: 'https://www.meetup.com/find/?location=ch--Zurich&source=EVENTS',
        selectors: {
          title: '.event-title',
          description: '.event-description',
          date: '.event-date',
          location: '.event-location'
        },
        type: 'dynamic'
      },
      enabled: true
    },
    {
      name: 'eventbrite',
      base_url: 'https://www.eventbrite.com/d/switzerland--zurich/events/',
      scraper_config: {
        url: 'https://www.eventbrite.com/d/switzerland--zurich/events/',
        selectors: {
          title: '.event-title',
          description: '.event-description',
          date: '.event-date',
          location: '.event-location',
          price: '.ticket-price'
        },
        type: 'static'
      },
      enabled: true
    },
    {
      name: 'linkedin',
      base_url: 'https://www.linkedin.com/events/',
      scraper_config: {
        url: 'https://www.linkedin.com/events/',
        selectors: {
          title: '.event-card__title',
          description: '.event-card__description',
          date: '.event-card__date',
          location: '.event-card__location'
        },
        type: 'dynamic'
      },
      enabled: false // Requires authentication
    }
  ];

  return NextResponse.json({
    sources: availableSources,
    total: availableSources.length
  });
}

/**
 * POST /api/scrape/custom
 * Scrape a custom URL with provided configuration
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, html, selectors, type } = body;

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    const scraper = new CustomScraper({
      url,
      selectors: selectors || {},
      type: type || 'static'
    });

    const result = await scraper.scrape(html);

    // Enrich events with category and language
    const enrichedEvents = result.events.map(event => ({
      ...event,
      category: categorizeEvent(event),
      language: detectLanguage(`${event.title} ${event.description}`)
    }));

    return NextResponse.json({
      success: result.success,
      events: enrichedEvents,
      total_events: enrichedEvents.length,
      scraped_at: result.scraped_at
    });

  } catch (error) {
    console.error('Custom scraping error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to scrape custom URL',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Made with Bob