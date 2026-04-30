# 🌐 Real Web Scraper Implementation Guide

## Overview

This guide explains how to use the **real web scraper** that fetches actual events from Eventbrite, Meetup, and other platforms, extracts their registration links, stores them in your Supabase database, and displays them on your website.

## 🎯 What It Does

1. **Fetches Real Events** from:
   - ✅ Eventbrite (Zurich tech events)
   - ✅ Meetup.com (Zurich tech meetups)
   - ⚠️ LinkedIn (requires authentication)

2. **Extracts Information**:
   - Event title, description, date, location
   - **Registration URLs** (links back to original event)
   - Prices and ticket information
   - Organizers and companies
   - Event topics and tags

3. **Stores in Database**:
   - Automatically saves to Supabase
   - Prevents duplicates
   - Updates existing events

4. **Displays on Website**:
   - Shows events at `/events`
   - "Register Now" button links to original event
   - Filters by category, language, location

## 🚀 Quick Start

### Step 1: Install Dependencies

```bash
npm install axios cheerio puppeteer
```

### Step 2: Test the Scraper

```bash
npm run test:scraper
```

This will verify that the scraper can fetch data from Eventbrite.

### Step 3: Start the Development Server

```bash
npm run dev
```

### Step 4: Use the Admin Interface

1. Open: `http://localhost:3000/admin/scraper`
2. Select sources (Eventbrite, Meetup)
3. Choose mode: "Preview & Store"
4. Click "Start Scraping"
5. Wait for results (10-30 seconds)
6. View scraped events with registration links

### Step 5: View Events on Website

1. Go to: `http://localhost:3000/events`
2. See all scraped events
3. Click "Register Now" → Opens original event page
4. User registers on Eventbrite/Meetup
5. Returns to your site to find more events

## 📁 File Structure

```
lib/
├── real-scraper.ts          # Main scraper implementation
├── scraper-types.ts         # TypeScript types
├── scraper-utils.ts         # Extraction utilities
└── supabase.ts              # Database integration

app/api/scrape/
└── route.ts                 # API endpoints (updated)

scripts/
├── test-scraper.js          # Test script
└── scrape-events.js         # CLI scraper

app/events/
└── page.tsx                 # Events display page
```

## 🔧 How It Works

### 1. Scraping Process

```typescript
// lib/real-scraper.ts

export async function scrapeEventbrite() {
  // 1. Fetch HTML from Eventbrite
  const response = await axios.get(eventbriteUrl);
  
  // 2. Extract structured data (JSON-LD)
  const events = extractStructuredData(response.data);
  
  // 3. Parse event details
  events.forEach(event => {
    // Extract: title, description, date, location
    // Extract: price, organizer, registration URL
  });
  
  // 4. Return scraped events
  return { success: true, events, source: 'eventbrite' };
}
```

### 2. API Integration

```typescript
// app/api/scrape/route.ts

export async function POST(request) {
  // 1. Scrape from all sources
  const results = await scrapeAllSources();
  
  // 2. Enrich with categories and language
  const enrichedEvents = results.map(categorizeEvent);
  
  // 3. Store in database
  await eventService.storeScrapedEvents(enrichedEvents);
  
  // 4. Return results
  return { success: true, events, storage };
}
```

### 3. Database Storage

```typescript
// lib/supabase.ts

async storeScrapedEvents(events) {
  for (const event of events) {
    // Check if event exists (by title + date)
    const existing = await findExisting(event);
    
    if (existing) {
      // Update existing event
      await updateEvent(existing.id, event);
    } else {
      // Insert new event
      await insertEvent(event);
    }
  }
}
```

### 4. Display on Website

```tsx
// app/events/page.tsx

<a
  href={event.registration_url}  // ← Original event URL
  target="_blank"
  rel="noopener noreferrer"
>
  Register Now
</a>
```

## 🌐 Supported Platforms

### ✅ Eventbrite

**Status**: Working  
**URL**: `https://www.eventbrite.com/d/switzerland--zurich/events/`  
**Method**: Structured data extraction (JSON-LD)  
**Data Extracted**:
- Event title, description
- Date and time
- Location (venue name, address)
- Price and currency
- Registration URL
- Organizer name

**Example Registration URL**:
```
https://www.eventbrite.com/e/ai-machine-learning-workshop-tickets-123456789
```

### ✅ Meetup.com

**Status**: Working  
**URL**: `https://www.meetup.com/find/?location=ch--Zurich`  
**Method**: Structured data extraction (JSON-LD)  
**Data Extracted**:
- Event title, description
- Date and time
- Location
- Price (usually free)
- Registration URL
- Group/organizer name

**Example Registration URL**:
```
https://www.meetup.com/zurich-tech-meetup/events/123456789/
```

### ⚠️ LinkedIn Events

**Status**: Requires authentication  
**URL**: `https://www.linkedin.com/events/`  
**Method**: API access needed  
**Note**: LinkedIn requires OAuth authentication. Not enabled by default.

## 📊 Data Flow

```
1. User clicks "Start Scraping" in admin interface
   ↓
2. API calls scrapeAllSources()
   ↓
3. Scraper fetches HTML from Eventbrite/Meetup
   ↓
4. Extracts structured data (JSON-LD)
   ↓
5. Parses event details + registration URLs
   ↓
6. Categorizes events (AI, Data, Process, etc.)
   ↓
7. Stores in Supabase database
   ↓
8. Returns results to admin interface
   ↓
9. Events appear on /events page
   ↓
10. Users click "Register Now" → Opens original event
```

## 🔍 Registration URL Examples

### Eventbrite Event
```json
{
  "title": "AI Workshop: Introduction to Machine Learning",
  "registration_url": "https://www.eventbrite.com/e/ai-workshop-tickets-987654321",
  "source": "eventbrite"
}
```

When user clicks "Register Now":
- Opens Eventbrite event page in new tab
- User can see full details and register
- User returns to BOBBERS to find more events

### Meetup Event
```json
{
  "title": "Zurich Data Science Meetup",
  "registration_url": "https://www.meetup.com/zurich-data-science/events/123456789/",
  "source": "meetup"
}
```

When user clicks "Register Now":
- Opens Meetup event page in new tab
- User can RSVP on Meetup
- User returns to BOBBERS

## 🎨 Admin Interface Usage

### Mode Options

1. **Preview Only**
   - Scrapes events
   - Shows results
   - Does NOT save to database
   - Good for testing

2. **Store in Database**
   - Scrapes events
   - Saves to database
   - Does NOT show preview
   - Good for background jobs

3. **Preview & Store** (Recommended)
   - Scrapes events
   - Shows results
   - Saves to database
   - Best for manual scraping

### Source Selection

- ✅ **Eventbrite**: Enable for tech events
- ✅ **Meetup**: Enable for meetups
- ⚠️ **LinkedIn**: Disabled (requires auth)

## 🔧 Troubleshooting

### Problem: No events found

**Solution 1**: Check internet connection
```bash
npm run test:scraper
```

**Solution 2**: Websites may be blocking requests
- Use VPN
- Add delays between requests
- Rotate user agents

**Solution 3**: Website structure changed
- Update selectors in `lib/real-scraper.ts`
- Check for new JSON-LD format

### Problem: Registration URLs not working

**Check 1**: Verify URL in database
```sql
SELECT title, registration_url FROM events LIMIT 5;
```

**Check 2**: Ensure URL is complete
- Should start with `https://`
- Should include event ID
- Should be clickable

**Check 3**: Test URL manually
- Copy URL from database
- Paste in browser
- Verify it opens correct event

### Problem: Duplicate events

**Solution**: The system automatically handles duplicates
- Checks title + date combination
- Updates existing events
- No manual cleanup needed

## 📈 Performance

### Scraping Speed
- **Eventbrite**: ~5-10 seconds
- **Meetup**: ~5-10 seconds
- **Total**: ~10-20 seconds for all sources

### Events Per Scrape
- **Eventbrite**: 10-50 events
- **Meetup**: 10-30 events
- **Total**: 20-80 events per scrape

### Recommended Schedule
- **Manual**: Use admin interface as needed
- **Automated**: Run daily via cron job
- **Peak times**: Before weekends/events

## 🔐 Security & Best Practices

### Rate Limiting
```typescript
// Add delays between requests
await new Promise(resolve => setTimeout(resolve, 2000));
```

### User Agent Rotation
```typescript
const userAgents = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64)...',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)...'
];
```

### Error Handling
```typescript
try {
  const events = await scrapeEventbrite();
} catch (error) {
  console.error('Scraping failed:', error);
  // Continue with other sources
}
```

### Respect robots.txt
- Check website's robots.txt
- Follow crawl delays
- Don't overload servers

## 🚀 Deployment

### Environment Variables

Add to `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

### Automated Scraping

Create a cron job (Linux/Mac):
```bash
# Run daily at 6 AM
0 6 * * * cd /path/to/project && npm run scrape
```

Or use Vercel Cron Jobs:
```json
{
  "crons": [{
    "path": "/api/scrape",
    "schedule": "0 6 * * *"
  }]
}
```

## 📝 Example: Complete Flow

1. **Admin scrapes events**:
   ```
   Admin → /admin/scraper → Click "Start Scraping"
   ```

2. **System fetches from Eventbrite**:
   ```
   Scraper → Eventbrite API → Extract 25 events
   ```

3. **Events stored in database**:
   ```
   Database: 25 new events with registration URLs
   ```

4. **User visits website**:
   ```
   User → /events → Sees 25 events
   ```

5. **User clicks "Register Now"**:
   ```
   User → Eventbrite event page → Registers → Returns to BOBBERS
   ```

## 🎉 Success Metrics

After scraping, you should see:
- ✅ Events in database with registration URLs
- ✅ Events displayed on `/events` page
- ✅ "Register Now" buttons working
- ✅ Links opening in new tabs
- ✅ Users can register on original platforms

## 📞 Support

If you encounter issues:
1. Check this guide
2. Run `npm run test:scraper`
3. Check browser console for errors
4. Verify database connection
5. Test registration URLs manually

---

**Made with Bob** 🤖