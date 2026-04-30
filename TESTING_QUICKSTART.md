# Testing Quick Start Guide

## Important Note

The test scripts have been updated to work without requiring TypeScript compilation. However, some tests require the Next.js application to be running.

---

## Running Tests

### 1. Database Integration Test ✅

This test works standalone and doesn't require the server to be running.

```bash
npm run test:db
```

**What it tests:**
- Database connection
- Event insertion
- Duplicate detection
- Event updates
- Search functionality
- Category/language/date filtering

**Requirements:**
- `.env.local` file with Supabase credentials

---

### 2. Eventbrite Scraper Test ℹ️

This test verifies that all scraper files exist.

```bash
npm run test:scraper
```

**To actually test scraping, use one of these methods:**

#### Method A: Admin Interface (Recommended)
```bash
# Start the development server
npm run dev

# Visit in browser:
http://localhost:3000/admin/scraper

# Select "Preview & Store" mode
# Enable "Eventbrite" source
# Click "Start Scraping"
```

#### Method B: API Endpoint
```bash
# Start the development server
npm run dev

# In another terminal, make API request:
curl -X POST http://localhost:3000/api/scrape \
  -H "Content-Type: application/json" \
  -d '{
    "sources": [{
      "name": "eventbrite",
      "base_url": "https://www.eventbrite.com/d/switzerland--zurich/events/",
      "scraper_config": {
        "url": "https://www.eventbrite.com/d/switzerland--zurich/events/",
        "selectors": {},
        "type": "static"
      },
      "enabled": true
    }],
    "mode": "preview"
  }'
```

---

### 3. Automated Scraper Test 🔄

This test requires the Next.js server to be running.

```bash
# Terminal 1: Start the server
npm run dev

# Terminal 2: Run the automated scraper
npm run scrape:auto
```

**What it does:**
- Checks if server is running
- Calls the scraping API
- Stores events in database
- Logs results to `logs/scraper.log`

---

## Quick Test Workflow

### Option 1: Test Database Only
```bash
npm run test:db
```

### Option 2: Test Everything
```bash
# Terminal 1
npm run dev

# Terminal 2 (wait for server to start)
npm run test:db
npm run scrape:auto
```

### Option 3: Use Admin Interface
```bash
npm run dev
# Visit: http://localhost:3000/admin/scraper
# Click "Start Scraping"
```

---

## Troubleshooting

### "Cannot find module" errors
These are TypeScript linting warnings and can be ignored. The scripts will run correctly.

### "Server is not running" error
Start the Next.js server first:
```bash
npm run dev
```

### "Missing Supabase credentials" error
Create `.env.local` file with:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

### Database connection fails
1. Check `.env.local` has correct credentials
2. Verify Supabase project is active
3. Check internet connection

---

## Test Results Location

- **Console output**: Real-time test results
- **Log files**: `logs/scraper.log` (for automated scraper)
- **Database**: Check Supabase dashboard for stored events

---

## What Each Test Validates

### Database Test (`npm run test:db`)
- ✅ Connection to Supabase
- ✅ Insert events
- ✅ Detect duplicates
- ✅ Update events
- ✅ Search events
- ✅ Filter by category
- ✅ Filter by language
- ✅ Filter by date range

### Scraper Test (`npm run test:scraper`)
- ✅ Scraper files exist
- ✅ TypeScript files are present
- ✅ API routes are configured

### Automated Scraper (`npm run scrape:auto`)
- ✅ Server connectivity
- ✅ API endpoint functionality
- ✅ Event scraping
- ✅ Database storage
- ✅ Error handling
- ✅ Logging

---

## Expected Output

### Successful Database Test
```
🧪 Testing Database Integration
============================================================
📡 Test 1: Testing database connection...
   ✅ Database connection successful
📝 Test 2: Inserting test events...
   ✅ Inserted: "AI & Machine Learning Workshop - TEST"
   ✅ Inserted: "Data Science Meetup Zürich - TEST"
...
✅ All database integration tests passed!
🎉 Database integration verified!
```

### Successful Automated Scraper
```
[2026-04-30T14:00:00.000Z] [INFO] Starting automated scraping session
[2026-04-30T14:00:00.000Z] [INFO] ✅ Server is running
[2026-04-30T14:00:05.000Z] [INFO] Scraping session summary:
[2026-04-30T14:00:05.000Z] [INFO]   Duration: 5s
[2026-04-30T14:00:05.000Z] [INFO]   Success: Yes
[2026-04-30T14:00:05.000Z] [INFO]   Total events: 15
[2026-04-30T14:00:05.000Z] [INFO]   Stored: 15
[2026-04-30T14:00:05.000Z] [INFO] ✅ Automated scraping completed successfully
```

---

## Production Testing

Before deploying to production:

1. **Test database connection**
   ```bash
   npm run test:db
   ```

2. **Test scraping via admin interface**
   ```bash
   npm run dev
   # Visit /admin/scraper and test
   ```

3. **Test automated scraping**
   ```bash
   npm run dev
   # In another terminal:
   npm run scrape:auto
   ```

4. **Verify events in database**
   - Check Supabase dashboard
   - Visit `/events` page
   - Test search and filters

---

## CI/CD Integration

For automated testing in CI/CD pipelines:

```yaml
# Example GitHub Actions
- name: Test Database
  env:
    NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
    NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
  run: npm run test:db
```

---

## Need Help?

1. Check this guide first
2. Review `README_TESTING.md` for detailed information
3. Check `DEPLOYMENT_GUIDE.md` for setup instructions
4. Review logs in `logs/scraper.log`
5. Check console output for error messages

---

**Last Updated**: 2026-04-30  
**Version**: 1.0