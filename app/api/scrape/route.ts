import { NextRequest, NextResponse } from 'next/server';
import { scrapeAllSources, scrapeEventbrite, scrapeMeetup } from '@/lib/real-scraper';
import { ScraperResult } from '@/lib/scraper-types';
import { categorizeEvent, detectLanguage } from '@/lib/scraper-utils';
import { eventService } from '@/lib/supabase';
import { SCRAPER_SOURCES } from '@/lib/scraper-config';

// Valid modes for scraping
const VALID_MODES = ['store', 'preview', 'both'] as const;
type ScraperMode = typeof VALID_MODES[number];

function isValidMode(mode: any): mode is ScraperMode {
  return VALID_MODES.includes(mode);
}

/**
 * POST /api/scrape
 * Trigger web scraping for events
 */
export async function POST(request: NextRequest) {
  try {
    // TODO: Add authentication check here
    // Example: const session = await getServerSession();
    // if (!session || !session.user.isAdmin) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const body = await request.json();
    const { sources, mode } = body;

    // Validate mode parameter
    if (mode && !isValidMode(mode)) {
      return NextResponse.json(
        { error: `Invalid mode. Must be one of: ${VALID_MODES.join(', ')}` },
        { status: 400 }
      );
    }

    console.log('Starting real web scraping...');

    // Scrape from real sources
    const results = await scrapeAllSources();

    // Collect all events from results
    const allEvents = results.flatMap(r => r.events);

    // Add category and language to each event
    const enrichedEvents = allEvents.map(event => ({
      ...event,
      category: categorizeEvent(event),
      language: detectLanguage(`${event.title} ${event.description}`)
    }));

    // Store events in database if mode is 'store' or 'both'
    let storageResult = null;
    if (mode === 'store' || mode === 'both' || !mode) {
      console.log(`Storing ${enrichedEvents.length} events in database...`);
      storageResult = await eventService.storeScrapedEvents(enrichedEvents);
    }

    return NextResponse.json({
      success: true,
      total_events: enrichedEvents.length,
      events: mode === 'preview' || mode === 'both' ? enrichedEvents : undefined,
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
    
    // Log full error server-side for debugging
    if (error instanceof Error) {
      console.error('Error stack:', error.stack);
    }
    
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
  return NextResponse.json({
    sources: SCRAPER_SOURCES,
    total: SCRAPER_SOURCES.length
  });
}

/**
 * POST /api/scrape/custom
 * Scrape a custom URL with provided configuration
 */
export async function PUT(request: NextRequest) {
  try {
    // TODO: Add authentication check here
    // Example: const session = await getServerSession();
    // if (!session || !session.user.isAdmin) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const body = await request.json();
    const { source } = body;

    // Validate source parameter
    const validSources = ['eventbrite', 'meetup'];
    if (!source || !validSources.includes(source)) {
      return NextResponse.json(
        { error: `Invalid source. Must be one of: ${validSources.join(', ')}` },
        { status: 400 }
      );
    }

    let result;
    
    if (source === 'eventbrite') {
      result = await scrapeEventbrite();
    } else if (source === 'meetup') {
      result = await scrapeMeetup();
    } else {
      return NextResponse.json(
        { error: 'Invalid source. Use "eventbrite" or "meetup"' },
        { status: 400 }
      );
    }

    // Enrich events with category and language
    const enrichedEvents = result.events.map(event => ({
      ...event,
      category: categorizeEvent(event),
      language: detectLanguage(`${event.title} ${event.description}`)
    }));

    // Store in database
    const storageResult = await eventService.storeScrapedEvents(enrichedEvents);

    return NextResponse.json({
      success: result.success,
      events: enrichedEvents,
      total_events: enrichedEvents.length,
      storage: storageResult,
      scraped_at: result.scraped_at
    });

  } catch (error) {
    console.error('Custom scraping error:', error);
    
    // Log full error server-side for debugging
    if (error instanceof Error) {
      console.error('Error stack:', error.stack);
    }
    
    return NextResponse.json(
      {
        error: 'Failed to scrape events',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Made with Bob