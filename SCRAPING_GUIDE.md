# Web Scraping System Guide

## Overview

The BOBBERS platform includes a comprehensive web scraping system that automatically collects event data from Eventbrite and LinkedIn, stores it in the Supabase database, and makes it searchable through the website.

## Features

### 1. Multi-Source Scraping
- **Eventbrite**: Scrapes public event listings from Eventbrite
- **LinkedIn**: Scrapes LinkedIn Events (requires authentication)
- **Custom Sources**: Extensible architecture for adding new sources

### 2. Intelligent Data Extraction
- Automatic event categorization (AI, Data, Process, System, CS)
- Language detection (English, German, French, Italian)
- Price information extraction
- Contact details and presenter information
- Company and topic extraction

### 3. Database Integration
- Automatic storage in Supabase
- Duplicate detection and prevention
- Event updates for existing entries
- Full CRUD operations support

### 4. Search & Filter
- Full-text search across titles, descriptions, and organizers
- Category filtering
- Language filtering
- Date range filtering
- Price range filtering
- Location-based filtering

## Architecture

```
┌─────────────────┐
│  Admin Panel    │
│  /admin/scraper │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  API Routes     │
│  /api/scrape    │
│  /api/events/   │
│     search      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Event Scraper  │
│  Orchestrator   │
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌─────────┐ ┌─────────┐
│Eventbrite│ │LinkedIn │
│ Scraper  │ │ Scraper │
└─────────┘ └─────────┘
         │
         ▼
┌─────────────────┐
│  Supabase DB    │
│  events table   │
└─────────────────┘
         │
         ▼
┌─────────────────┐
│  Events Page    │
│  /events        │
└─────────────────┘
```

## Usage

### Admin Panel

1. **Access the Admin Panel**
   - Navigate to `/admin/scraper`
   - This is the control center for all scraping operations

2. **Select Scraping Mode**
   - **Preview Only**: See what events will be scraped without saving
   - **Store in Database**: Save events directly without preview
   - **Preview & Store**: See events and save them (recommended)

3. **Enable Sources**
   - Check the sources you want to scrape from
   - Eventbrite: Works out of the box
   - LinkedIn: Requires authentication (currently disabled by default)

4. **Start Scraping**
   - Click "Start Scraping" button
   - Wait for the process to complete
   - Review the results

### API Endpoints

#### POST /api/scrape
Trigger web scraping for events.

**Request Body:**
```json
{
  "sources": [
    {
      "name": "eventbrite",
      "base_url": "https://www.eventbrite.com/d/switzerland--zurich/events/",
      "scraper_config": {
        "url": "https://www.eventbrite.com/d/switzerland--zurich/events/",
        "selectors": {},
        "type": "static"
      },
      "enabled": true
    }
  ],
  "mode": "both"
}
```

**Response:**
```json
{
  "success": true,
  "total_events": 15,
  "storage": {
    "success": 15,
    "failed": 0,
    "errors": []
  },
  "results": [
    {
      "source": "eventbrite",
      "success": true,
      "event_count": 15,
      "errors": []
    }
  ],
  "scraped_at": "2026-04-30T12:00:00.000Z"
}
```

#### GET /api/events/search
Search and filter events.

**Query Parameters:**
- `q`: Search query (searches title, description, organizer)
- `categories`: Comma-separated categories (AI,Data,Process,System,CS)
- `languages`: Comma-separated languages (English,German,French,Italian)
- `startDate`: ISO 8601 date string
- `endDate`: ISO 8601 date string
- `minPrice`: Minimum price
- `maxPrice`: Maximum price
- `location`: Location filter

**Example:**
```
GET /api/events/search?q=AI&categories=AI,Data&languages=English&minPrice=0&maxPrice=50
```

**Response:**
```json
{
  "success": true,
  "total": 5,
  "events": [
    {
      "event_id": "uuid",
      "title": "AI Workshop",
      "description": "Learn about AI...",
      "date_time": "2026-05-15T18:00:00Z",
      "location": "Zurich, Switzerland",
      "category": "AI",
      "language": "English",
      "price": 0,
      "currency": "CHF",
      "registration_url": "https://...",
      "organizer": "Tech Company",
      "tags": ["AI", "Machine Learning"],
      "is_featured": false,
      "capacity": 50,
      "attendees_count": 0
    }
  ],
  "filters": {
    "query": "AI",
    "categories": ["AI", "Data"],
    "languages": ["English"]
  }
}
```

## Implementation Details

### Eventbrite Scraper

The Eventbrite scraper uses multiple strategies:

1. **JSON-LD Extraction**: Parses structured data from `<script type="application/ld+json">` tags
2. **HTML Parsing**: Falls back to HTML structure parsing if JSON-LD is not available
3. **Data Enrichment**: Automatically categorizes and detects language

**Key Features:**
- Extracts event title, description, date, location
- Parses pricing information (multiple ticket types)
- Identifies presenters and organizers
- Extracts topics and tags

### LinkedIn Scraper

The LinkedIn scraper is designed for authenticated access:

1. **HTML Content Processing**: Works with provided HTML content
2. **JSON Data Extraction**: Parses LinkedIn's React data structures
3. **Event Card Parsing**: Extracts data from event card components

**Note:** LinkedIn requires authentication. The scraper expects HTML content to be provided rather than fetching directly.

### Database Schema

Events are stored with the following structure:

```sql
CREATE TABLE events (
  event_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  date_time TIMESTAMPTZ NOT NULL,
  location TEXT NOT NULL,
  category TEXT NOT NULL,
  language TEXT NOT NULL,
  price DECIMAL(10,2) DEFAULT 0,
  currency TEXT DEFAULT 'CHF',
  registration_url TEXT,
  image_url TEXT,
  organizer TEXT,
  tags TEXT[],
  is_featured BOOLEAN DEFAULT FALSE,
  capacity INTEGER,
  attendees_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Customization

### Adding New Sources

1. Create a new scraper class extending `EventScraper`:

```typescript
export class CustomScraper extends EventScraper {
  constructor(url: string) {
    super({
      url,
      selectors: {
        title: '.event-title',
        description: '.event-desc',
        // ... other selectors
      },
      type: 'static' // or 'dynamic'
    });
  }

  async scrape(html?: string): Promise<ScraperResult> {
    // Implementation
  }
}
```

2. Add to the orchestrator in `/api/scrape/route.ts`

### Customizing Categorization

Edit `lib/scraper-utils.ts` to modify the `categorizeEvent` function:

```typescript
export function categorizeEvent(event: ScrapedEventData): string {
  const text = `${event.title} ${event.description}`.toLowerCase();
  
  // Add your custom logic
  if (text.includes('your-keyword')) {
    return 'YourCategory';
  }
  
  // ... existing logic
}
```

## Best Practices

1. **Rate Limiting**: Implement delays between requests to avoid overwhelming servers
2. **Error Handling**: Always handle scraping errors gracefully
3. **Data Validation**: Validate scraped data before storing
4. **Duplicate Prevention**: Check for existing events before inserting
5. **Monitoring**: Log scraping activities and errors
6. **Respect robots.txt**: Follow website scraping policies

## Troubleshooting

### Common Issues

**Issue**: No events scraped
- **Solution**: Check if the source website structure has changed
- **Solution**: Verify selectors in scraper configuration
- **Solution**: Check network connectivity

**Issue**: Events not appearing in search
- **Solution**: Verify events were stored in database
- **Solution**: Check search filters
- **Solution**: Ensure database connection is working

**Issue**: LinkedIn scraping fails
- **Solution**: LinkedIn requires authentication
- **Solution**: Provide HTML content manually
- **Solution**: Consider using LinkedIn API instead

## Security Considerations

1. **API Authentication**: Implement authentication for admin endpoints
2. **Rate Limiting**: Add rate limiting to prevent abuse
3. **Input Validation**: Validate all user inputs
4. **CORS**: Configure CORS properly for API endpoints
5. **Environment Variables**: Store sensitive data in environment variables

## Future Enhancements

- [ ] Scheduled automatic scraping (cron jobs)
- [ ] Email notifications for new events
- [ ] Event recommendation system
- [ ] Social media integration
- [ ] Advanced analytics dashboard
- [ ] Multi-language support for UI
- [ ] Mobile app integration
- [ ] Event calendar export (iCal)

## Support

For issues or questions:
1. Check this documentation
2. Review the code comments
3. Check the console for error messages
4. Contact the development team

---

Made with Bob