import { NextRequest, NextResponse } from 'next/server';
import { eventService } from '@/lib/supabase';

/**
 * GET /api/events/search
 * Search and filter events
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Extract search parameters
    const query = searchParams.get('q') || undefined;
    const categories = searchParams.get('categories')?.split(',').filter(Boolean) || undefined;
    const languages = searchParams.get('languages')?.split(',').filter(Boolean) || undefined;
    const startDate = searchParams.get('startDate') || undefined;
    const endDate = searchParams.get('endDate') || undefined;
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined;
    const location = searchParams.get('location') || undefined;
    const freeFood = searchParams.get('freeFood') === 'true' ? true : undefined;

    // Search events with filters
    const events = await eventService.searchEvents({
      query,
      categories,
      languages,
      startDate,
      endDate,
      minPrice,
      maxPrice,
      location,
      freeFood
    });

    return NextResponse.json({
      success: true,
      total: events.length,
      events,
      filters: {
        query,
        categories,
        languages,
        startDate,
        endDate,
        minPrice,
        maxPrice,
        location,
        freeFood
      }
    });

  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to search events',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Made with Bob