# Web Scraper Feature Guide

## Overview

The BOBBERS platform now includes a comprehensive web scraping feature that automatically extracts event information from various sources and categorizes it into structured data including:

- **Prices** (Early Bird, Regular, Student, Free, etc.)
- **Contact Information** (Email, Phone, Website, Social Media)
- **Event Topics** (AI, Data Science, Cloud Computing, etc.)
- **Companies Attending**
- **Presenters/Speakers**

## Installation

### 1. Install Required Dependencies

```bash
npm install cheerio axios puppeteer @types/cheerio
```

Or if using yarn:

```bash
yarn add cheerio axios puppeteer @types/cheerio
```

### 2. Optional: Puppeteer Setup

For dynamic content scraping (JavaScript-heavy sites), Puppeteer requires additional setup:

**Windows:**
```bash
# Puppeteer will download Chromium automatically
# Ensure you have sufficient disk space (~170MB)
```

**Linux:**
```bash
sudo apt-get install -y chromium-browser
```

**macOS:**
```bash
brew install chromium
```

## Architecture

### Core Components

1. **Types** (`lib/scraper-types.ts`)
   - Defines data structures for scraped events
   - Includes price info, contact details, presenters, etc.

2. **Utilities** (`lib/scraper-utils.ts`)
   - Extraction functions for prices, contacts, topics
   - Text cleaning and normalization
   - Event categorization and language detection

3. **Scrapers** (`lib/event-scraper.ts`)
   - Base scraper class
   - Platform-specific adapters (Meetup, Eventbrite, LinkedIn)
   - Custom scraper for any website
   - Orchestrator for managing multiple sources

4. **API Routes** (`app/api/scrape/route.ts`)
   - POST `/api/scrape` - Scrape multiple sources
   - GET `/api/scrape/sources` - List available sources
   - PUT `/api/scrape/custom` - Scrape custom URL

5. **Admin Interface** (`app/admin/scraper/page.tsx`)
   - Visual interface for triggering scrapes
   - Source selection and configuration
   - Results display with detailed breakdown

## Usage

### Using the Admin Interface

1. Navigate to `/admin/scraper` in your browser
2. Select sources to scrape (Meetup, Eventbrite, etc.)
3. Click "Scrape" button
4. View results with categorized event data

### Using the API Directly

#### Scrape Multiple Sources

```typescript
const response = await fetch('/api/scrape', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    sources: [
      {
        name: 'meetup',
        base_url: 'https://www.meetup.com/find/?location=ch--Zurich',
        scraper_config: {
          url: 'https://www.meetup.com/find/?location=ch--Zurich',
          selectors: {
            title: '.event-title',
            description: '.event-description',
            date: '.event-date',
            location: '.event-location'
          },
          type: 'dynamic'
        },
        enabled: true
      }
    ],
    mode: 'full'
  })
});

const data = await response.json();
console.log(`Found ${data.total_events} events`);
```

#### Scrape Custom URL

```typescript
const response = await fetch('/api/scrape/custom', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    url: 'https://example.com/events/tech-meetup',
    type: 'static' // or 'dynamic' for JavaScript-heavy sites
  })
});

const data = await response.json();
```

#### With HTML Content (Static Scraping)

```typescript
const html = `<html>...</html>`; // Your HTML content

const response = await fetch('/api/scrape/custom', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    url: 'https://example.com/events/tech-meetup',
    html: html,
    type: 'static'
  })
});
```

### Programmatic Usage

```typescript
import { EventScraperOrchestrator, MeetupScraper } from '@/lib/event-scraper';
import { categorizeEvent, detectLanguage } from '@/lib/scraper-utils';

// Create orchestrator
const orchestrator = new EventScraperOrchestrator();

// Add sources
orchestrator.addSource({
  name: 'meetup',
  base_url: 'https://www.meetup.com/find/?location=ch--Zurich',
  scraper_config: {
    url: 'https://www.meetup.com/find/?location=ch--Zurich',
    selectors: {},
    type: 'dynamic'
  },
  enabled: true
});

// Scrape all sources
const results = await orchestrator.scrapeAll();

// Process events
const events = orchestrator.processEvents(results);

// Each event includes:
events.forEach(event => {
  console.log('Title:', event.title);
  console.log('Prices:', event.prices);
  console.log('Contact:', event.contact_info);
  console.log('Topics:', event.event_topic);
  console.log('Companies:', event.companies_attending);
  console.log('Presenters:', event.presenters);
});
```

## Data Extraction Features

### Price Extraction

Automatically detects and categorizes prices:
- Free events
- Multiple price tiers (Early Bird, Regular, Student, VIP)
- Various currencies (CHF, USD, EUR)
- Formats: "CHF 50", "$100", "€75", "50 CHF"

```typescript
import { extractPrices } from '@/lib/scraper-utils';

const text = "Early Bird: CHF 25, Regular: CHF 50, Student: CHF 15";
const prices = extractPrices(text);
// Returns: [
//   { type: 'Early Bird', amount: 25, currency: 'CHF' },
//   { type: 'Regular', amount: 50, currency: 'CHF' },
//   { type: 'Student', amount: 15, currency: 'CHF' }
// ]
```

### Contact Information Extraction

Extracts:
- Email addresses
- Phone numbers (Swiss and international formats)
- Website URLs
- Social media links (LinkedIn, Twitter, Facebook)

```typescript
import { extractContactInfo } from '@/lib/scraper-utils';

const text = "Contact us at info@example.com or +41 44 123 45 67";
const contact = extractContactInfo(text);
// Returns: {
//   email: 'info@example.com',
//   phone: '+41 44 123 45 67'
// }
```

### Presenter/Speaker Extraction

Identifies speakers with:
- Names
- Titles
- Companies
- LinkedIn profiles (if available)

```typescript
import { extractPresenters } from '@/lib/scraper-utils';

const text = "Speaker: John Doe, Senior Engineer at TechCorp";
const presenters = extractPresenters(text);
// Returns: [
//   { name: 'John Doe', title: 'Senior Engineer', company: 'TechCorp' }
// ]
```

### Topic/Tag Extraction

Automatically identifies tech-related topics:
- AI, Machine Learning, Deep Learning
- Data Science, Big Data, Analytics
- Cloud Computing, DevOps, Kubernetes
- Web/Mobile Development
- And 30+ more categories

```typescript
import { extractTopics } from '@/lib/scraper-utils';

const text = "Learn about AI and Machine Learning in this workshop";
const topics = extractTopics(text);
// Returns: ['AI', 'Machine Learning']
```

### Event Categorization

Automatically categorizes events into:
- **AI**: Artificial Intelligence, Machine Learning, Neural Networks
- **Data**: Data Science, Analytics, Big Data
- **Process**: Agile, Scrum, DevOps, Project Management
- **System**: Cloud, Infrastructure, Networking, Security
- **CS**: General Computer Science topics

```typescript
import { categorizeEvent } from '@/lib/scraper-utils';

const event = {
  title: "Machine Learning Workshop",
  description: "Learn about neural networks and deep learning",
  // ... other fields
};

const category = categorizeEvent(event);
// Returns: 'AI'
```

### Language Detection

Detects event language:
- English
- German
- French
- Italian

```typescript
import { detectLanguage } from '@/lib/scraper-utils';

const text = "Willkommen zu unserem Event über Künstliche Intelligenz";
const language = detectLanguage(text);
// Returns: 'German'
```

## Creating Custom Scrapers

### For Static Websites

```typescript
import { CustomScraper } from '@/lib/event-scraper';

const scraper = new CustomScraper({
  url: 'https://example.com/events',
  selectors: {
    title: '.event-title',
    description: '.event-desc',
    date: '.event-date',
    location: '.event-location',
    price: '.ticket-price'
  },
  type: 'static'
});

const result = await scraper.scrape(htmlContent);
```

### For Dynamic Websites (JavaScript-rendered)

```typescript
import { CustomScraper } from '@/lib/event-scraper';

const scraper = new CustomScraper({
  url: 'https://example.com/events',
  selectors: {
    title: '.event-title',
    description: '.event-desc',
    date: '.event-date'
  },
  type: 'dynamic' // Uses Puppeteer
});

const result = await scraper.scrape();
```

## Supported Platforms

### Built-in Adapters

1. **Meetup.com**
   - Dynamic scraping (requires Puppeteer)
   - Extracts event details, attendees, organizers

2. **Eventbrite**
   - Static scraping (uses Cheerio)
   - Extracts tickets, prices, venue information

3. **LinkedIn Events**
   - Dynamic scraping
   - Note: May require authentication

### Custom Websites

Use the `CustomScraper` class for any website by providing:
- URL
- CSS selectors for data extraction
- Scraping type (static or dynamic)

## Best Practices

### 1. Respect Rate Limits

```typescript
// Add delays between requests
await new Promise(resolve => setTimeout(resolve, 2000));
```

### 2. Handle Errors Gracefully

```typescript
try {
  const result = await scraper.scrape();
  if (!result.success) {
    console.error('Scraping failed:', result.errors);
  }
} catch (error) {
  console.error('Error:', error);
}
```

### 3. Cache Results

```typescript
// Store results in database or cache
const results = await orchestrator.scrapeAll();
// Save to Supabase or other storage
```

### 4. Schedule Regular Scrapes

```typescript
// Use cron jobs or scheduled tasks
// Example: Every 6 hours
// 0 */6 * * * node scrape-events.js
```

### 5. Validate Extracted Data

```typescript
const event = scrapedEvent;
if (!event.title || !event.date_time) {
  console.warn('Incomplete event data:', event);
  // Skip or handle appropriately
}
```

## Troubleshooting

### Puppeteer Issues

**Problem**: Chromium download fails
```bash
# Set custom download path
PUPPETEER_DOWNLOAD_PATH=/custom/path npm install puppeteer
```

**Problem**: Puppeteer crashes on Linux
```bash
# Install dependencies
sudo apt-get install -y libx11-xcb1 libxcomposite1 libxcursor1 libxdamage1
```

### Scraping Fails

1. **Check selectors**: Websites change their HTML structure
2. **Verify URL**: Ensure the URL is accessible
3. **Check rate limits**: You may be blocked temporarily
4. **Use dynamic scraping**: Some sites require JavaScript execution

### TypeScript Errors

The TypeScript errors in the admin interface are expected if dependencies aren't installed yet. They will resolve after running:

```bash
npm install
```

## Security Considerations

1. **Never scrape personal data** without permission
2. **Respect robots.txt** files
3. **Use authentication** for the admin interface in production
4. **Sanitize scraped content** before displaying
5. **Rate limit API endpoints** to prevent abuse

## Performance Tips

1. **Use static scraping** when possible (faster than Puppeteer)
2. **Scrape in parallel** for multiple sources
3. **Cache results** to reduce redundant scraping
4. **Use selective scraping** - only scrape what you need
5. **Implement pagination** for large result sets

## Future Enhancements

- [ ] Add more platform adapters (Facebook Events, Eventful, etc.)
- [ ] Implement machine learning for better categorization
- [ ] Add image extraction for event posters
- [ ] Support for recurring events
- [ ] Email notifications for new events
- [ ] Integration with calendar systems (Google Calendar, iCal)
- [ ] Advanced filtering and deduplication
- [ ] Multi-language support for extraction

## Support

For issues or questions:
1. Check this guide first
2. Review the code comments in the scraper files
3. Test with the admin interface at `/admin/scraper`
4. Check browser console for errors

## License

This scraper feature is part of the BOBBERS platform.

---

**Made with Bob** 🤖