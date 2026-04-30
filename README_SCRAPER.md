# 🕷️ Web Scraper Feature - Quick Start

## What's Been Created

A complete web scraping system for the BOBBERS event discovery platform that automatically extracts and categorizes event information from multiple sources.

### 📁 Files Created

1. **`lib/scraper-types.ts`** - TypeScript types and interfaces
2. **`lib/scraper-utils.ts`** - Extraction utilities (prices, contacts, topics, etc.)
3. **`lib/event-scraper.ts`** - Main scraper classes and orchestrator
4. **`app/api/scrape/route.ts`** - API endpoints for scraping
5. **`app/admin/scraper/page.tsx`** - Admin UI for managing scrapes
6. **`scripts/scrape-events.js`** - Standalone CLI script
7. **`SCRAPER_GUIDE.md`** - Comprehensive documentation

### ✨ Features

#### Automatic Data Extraction
- **Prices**: Early Bird, Regular, Student, Free (CHF, USD, EUR)
- **Contact Info**: Email, phone, website, social media
- **Event Topics**: AI, Data Science, Cloud, DevOps, etc. (30+ categories)
- **Companies**: Attending companies and sponsors
- **Presenters**: Speaker names, titles, companies

#### Smart Categorization
- **AI**: Machine Learning, Neural Networks, NLP
- **Data**: Data Science, Analytics, Big Data
- **Process**: Agile, Scrum, DevOps
- **System**: Cloud, Infrastructure, Security
- **CS**: General Computer Science

#### Language Detection
- English, German, French, Italian

#### Multiple Scraping Methods
- **Static**: Fast scraping with Cheerio (HTML parsing)
- **Dynamic**: JavaScript-rendered sites with Puppeteer

## 🚀 Installation

### Step 1: Install Dependencies

```bash
npm install cheerio axios puppeteer @types/cheerio
```

### Step 2: Verify Installation

Check that `package.json` includes:
```json
{
  "dependencies": {
    "axios": "^1.6.0",
    "cheerio": "^1.0.0-rc.12",
    "puppeteer": "^21.0.0"
  },
  "devDependencies": {
    "@types/cheerio": "^0.22.35"
  }
}
```

## 📖 Usage

### Option 1: Admin Interface (Recommended)

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to: `http://localhost:3000/admin/scraper`

3. Select sources and click "Scrape"

4. View categorized results with:
   - Event details
   - Prices and contact info
   - Topics and companies
   - Presenters

### Option 2: API Endpoints

#### Scrape Multiple Sources
```bash
curl -X POST http://localhost:3000/api/scrape \
  -H "Content-Type: application/json" \
  -d '{
    "sources": [
      {
        "name": "meetup",
        "base_url": "https://www.meetup.com/find/?location=ch--Zurich",
        "scraper_config": {
          "url": "https://www.meetup.com/find/?location=ch--Zurich",
          "selectors": {},
          "type": "dynamic"
        },
        "enabled": true
      }
    ]
  }'
```

#### Get Available Sources
```bash
curl http://localhost:3000/api/scrape/sources
```

#### Scrape Custom URL
```bash
curl -X PUT http://localhost:3000/api/scrape/custom \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com/events",
    "type": "static"
  }'
```

### Option 3: CLI Script

```bash
npm run scrape
```

This will:
- Scrape configured sources
- Display results in terminal
- Save events to `scraped-events.json`

## 🎯 Example Output

```json
{
  "title": "AI & Machine Learning Meetup",
  "description": "Join us for an evening of AI discussions...",
  "date_time": "2026-05-15T18:00:00.000Z",
  "location": "Zurich, Switzerland",
  "prices": [
    {
      "type": "Free",
      "amount": 0,
      "currency": "CHF",
      "description": "Free admission"
    }
  ],
  "contact_info": {
    "email": "info@aimeetup.ch",
    "website": "https://aimeetup.ch",
    "social_media": {
      "linkedin": "https://linkedin.com/company/aimeetup"
    }
  },
  "event_topic": ["AI", "Machine Learning", "Deep Learning"],
  "companies_attending": ["Google", "Microsoft", "ETH Zurich"],
  "presenters": [
    {
      "name": "John Doe",
      "title": "AI Research Lead",
      "company": "Google"
    }
  ],
  "source_url": "https://example.com/events/ai-meetup"
}
```

## 🔧 Configuration

### Add New Source

Edit `app/api/scrape/route.ts` or use the API:

```typescript
const newSource = {
  name: 'custom',
  base_url: 'https://techevents.ch',
  scraper_config: {
    url: 'https://techevents.ch/zurich',
    selectors: {
      title: '.event-title',
      description: '.event-description',
      date: '.event-date',
      location: '.event-location',
      price: '.ticket-price'
    },
    type: 'static' // or 'dynamic'
  },
  enabled: true
};
```

### Customize Extraction

Modify `lib/scraper-utils.ts` to adjust:
- Price patterns
- Contact info regex
- Topic keywords
- Categorization rules

## 📚 Documentation

For detailed documentation, see **`SCRAPER_GUIDE.md`** which includes:
- Architecture overview
- API reference
- Advanced usage examples
- Custom scraper creation
- Troubleshooting guide
- Best practices
- Security considerations

## 🛠️ Troubleshooting

### TypeScript Errors
If you see TypeScript errors in the admin interface, run:
```bash
npm install
```

### Puppeteer Issues
If Puppeteer fails to install:
```bash
# Skip Chromium download
PUPPETEER_SKIP_DOWNLOAD=true npm install puppeteer

# Or set custom path
PUPPETEER_DOWNLOAD_PATH=/custom/path npm install puppeteer
```

### Scraping Fails
1. Check if the website is accessible
2. Verify CSS selectors are correct
3. Try dynamic scraping for JavaScript-heavy sites
4. Check rate limits

## 🔐 Security Notes

- **Never scrape personal data** without permission
- **Respect robots.txt** files
- **Add authentication** to admin interface in production
- **Rate limit** API endpoints
- **Sanitize** scraped content before display

## 📊 Performance

- **Static scraping**: ~100-500ms per page
- **Dynamic scraping**: ~2-5 seconds per page
- **Parallel scraping**: Multiple sources simultaneously
- **Caching**: Recommended for production

## 🚦 Next Steps

1. **Install dependencies**: `npm install`
2. **Test the admin interface**: Visit `/admin/scraper`
3. **Try the CLI script**: `npm run scrape`
4. **Read full documentation**: See `SCRAPER_GUIDE.md`
5. **Customize for your needs**: Add sources, adjust extraction logic
6. **Integrate with database**: Save scraped events to Supabase

## 🤝 Integration with BOBBERS

The scraped events can be automatically:
- Saved to Supabase database
- Displayed on the main events page
- Filtered by category, language, date
- Searched by keywords
- Exported to calendar formats

## 📝 Example Integration

```typescript
import { supabase } from '@/lib/supabase';
import { EventScraperOrchestrator } from '@/lib/event-scraper';
import { categorizeEvent, detectLanguage } from '@/lib/scraper-utils';

async function scrapeAndSave() {
  const orchestrator = new EventScraperOrchestrator();
  // Add sources...
  
  const results = await orchestrator.scrapeAll();
  const events = orchestrator.processEvents(results);
  
  // Save to database
  for (const event of events) {
    await supabase.from('events').insert({
      title: event.title,
      description: event.description,
      date_time: event.date_time,
      location: event.location,
      category: categorizeEvent(event),
      language: detectLanguage(`${event.title} ${event.description}`),
      rsvp_url: event.source_url
    });
  }
}
```

## 🎉 You're All Set!

The web scraper feature is ready to use. Start by visiting the admin interface or running the CLI script to see it in action.

For questions or issues, refer to `SCRAPER_GUIDE.md` for comprehensive documentation.

---

**Made with Bob** 🤖