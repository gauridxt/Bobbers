# 🚀 Web Scraper Setup Instructions

Follow these steps to set up and run the real web scraper.

## Prerequisites

✅ **Node.js installed** (v18 or higher)
- Download from: https://nodejs.org/
- Verify: `node --version` and `npm --version`

✅ **Git repository cloned**
- You should be in: `c:/UoM/Bobber/Bobbers`

✅ **Supabase configured**
- `.env.local` file with Supabase credentials

## Step-by-Step Setup

### Step 1: Install Dependencies

Open your terminal in the project directory and run:

```bash
npm install axios cheerio puppeteer
```

**What this does:**
- `axios` - HTTP client for fetching web pages
- `cheerio` - HTML parser for extracting data
- `puppeteer` - Browser automation for dynamic content

**Expected output:**
```
added 150 packages in 45s
```

**If you see errors:**
- Make sure you're in the project directory
- Try: `npm install --legacy-peer-deps`
- For Puppeteer issues on Windows, see troubleshooting below

---

### Step 2: Test the Scraper

Run the test script to verify everything works:

```bash
npm run test:scraper
```

**What this does:**
- Fetches a page from Eventbrite
- Checks if data can be extracted
- Shows sample event titles

**Expected output:**
```
🧪 Testing Web Scraper...

📡 Scraping Eventbrite...
✅ Successfully fetched Eventbrite page (245678 bytes)
✅ Structured data found: true

📋 Sample event titles found:
   1. AI & Machine Learning Workshop - Introduction to Neural Networks...
   2. Data Science Meetup - Advanced Analytics with Python...
   3. Cloud Computing Summit - AWS and Azure Best Practices...
   4. DevOps Conference - CI/CD Pipeline Automation...
   5. Blockchain Technology - Smart Contracts Development...

✅ Scraper test completed successfully!
```

**If you see errors:**
- Check internet connection
- Eventbrite may be blocking requests (try VPN)
- See troubleshooting section below

---

### Step 3: Start Development Server

Start the Next.js development server:

```bash
npm run dev
```

**Expected output:**
```
  ▲ Next.js 16.2.4
  - Local:        http://localhost:3000
  - Network:      http://192.168.1.x:3000

 ✓ Ready in 2.5s
```

**Keep this terminal open!** The server needs to run continuously.

---

### Step 4: Access Admin Interface

Open your browser and go to:

```
http://localhost:3000/admin/scraper
```

You should see:
- **Scraping Mode** selection (Preview, Store, Both)
- **Source Selection** (Eventbrite, LinkedIn)
- **Start Scraping** button

---

### Step 5: Scrape Real Events

1. **Select Mode**: Choose "Preview & Store"
2. **Enable Sources**: Check "Eventbrite" (LinkedIn requires auth)
3. **Click**: "Start Scraping"
4. **Wait**: 10-30 seconds for results
5. **View Results**: See scraped events with details

**What happens:**
```
1. Fetches events from Eventbrite
2. Extracts: title, description, date, location, registration URL
3. Categorizes: AI, Data, Process, System, CS
4. Detects language: English, German, French, Italian
5. Stores in Supabase database
6. Shows results in admin interface
```

---

### Step 6: View Events on Website

Open a new tab and go to:

```
http://localhost:3000/events
```

You should see:
- All scraped events displayed
- Event cards with details
- **"Register Now"** buttons
- Filters for category, language, location

**Test Registration:**
1. Click "Register Now" on any event
2. Opens Eventbrite/Meetup in new tab
3. You can register on the original platform
4. Return to BOBBERS to find more events

---

## 🎯 Quick Command Reference

```bash
# Install dependencies
npm install axios cheerio puppeteer

# Test scraper
npm run test:scraper

# Start dev server
npm run dev

# Run scraper from CLI
npm run scrape

# Build for production
npm run build

# Start production server
npm start
```

---

## 🔧 Troubleshooting

### Problem: npm not recognized

**Solution:**
1. Install Node.js from https://nodejs.org/
2. Restart your terminal/VSCode
3. Verify: `node --version`

---

### Problem: Puppeteer installation fails on Windows

**Solution 1: Skip Chromium download**
```bash
set PUPPETEER_SKIP_DOWNLOAD=true
npm install puppeteer
```

**Solution 2: Use puppeteer-core**
```bash
npm install puppeteer-core
```

**Solution 3: Install manually**
```bash
npm install puppeteer --ignore-scripts
```

---

### Problem: Test scraper fails

**Error: "ECONNREFUSED" or "ETIMEDOUT"**

**Solution:**
- Check internet connection
- Try with VPN
- Eventbrite may be blocking automated requests
- Wait a few minutes and try again

**Error: "Cannot find module 'axios'"**

**Solution:**
```bash
npm install axios
```

---

### Problem: No events found

**Check 1: Verify Supabase connection**
```bash
# Check .env.local file exists
# Verify NEXT_PUBLIC_SUPABASE_URL is set
# Verify NEXT_PUBLIC_SUPABASE_ANON_KEY is set
```

**Check 2: Check database**
- Open Supabase dashboard
- Go to Table Editor
- Check `events` table
- Verify events are being inserted

**Check 3: Check browser console**
- Open browser DevTools (F12)
- Go to Console tab
- Look for error messages

---

### Problem: Registration URLs not working

**Check 1: Verify URL in database**
```sql
SELECT title, registration_url FROM events LIMIT 5;
```

**Check 2: Test URL manually**
- Copy a registration URL from database
- Paste in browser
- Verify it opens the correct event

**Check 3: Check events page**
- Go to http://localhost:3000/events
- Right-click "Register Now" button
- Select "Inspect Element"
- Verify `href` attribute has correct URL

---

## 📊 Expected Results

After successful scraping, you should have:

### In Admin Interface:
```
✓ Successfully scraped 25 events
• Stored: 25 events
• Failed: 0 events

Source Breakdown:
✓ eventbrite: 25 events
```

### In Database:
```sql
-- Check events table
SELECT COUNT(*) FROM events;
-- Should show: 25 (or more)

-- Check registration URLs
SELECT title, registration_url FROM events LIMIT 3;
-- Should show: Real Eventbrite URLs
```

### On Website:
- Visit: http://localhost:3000/events
- See: 25 events displayed
- Each event has: "Register Now" button
- Clicking button: Opens Eventbrite in new tab

---

## 🎉 Success Checklist

- [ ] Node.js installed and working
- [ ] Dependencies installed (axios, cheerio, puppeteer)
- [ ] Test scraper runs successfully
- [ ] Dev server starts without errors
- [ ] Admin interface loads at /admin/scraper
- [ ] Scraping completes successfully
- [ ] Events stored in database
- [ ] Events display on /events page
- [ ] "Register Now" buttons work
- [ ] Registration URLs open correct events

---

## 🚀 Next Steps

Once everything is working:

1. **Schedule Regular Scraping**
   - Set up cron job to run daily
   - Or use Vercel Cron Jobs

2. **Add More Sources**
   - Implement LinkedIn scraping (requires OAuth)
   - Add other event platforms

3. **Enhance Data**
   - Add event images
   - Extract presenter information
   - Add venue details

4. **Deploy to Production**
   - Deploy to Vercel/Netlify
   - Set up environment variables
   - Configure automated scraping

---

## 📞 Need Help?

If you're stuck:

1. **Check this guide** - Most issues are covered here
2. **Run test scraper** - `npm run test:scraper`
3. **Check browser console** - Look for error messages
4. **Check server logs** - Look at terminal output
5. **Verify database** - Check Supabase dashboard

---

## 📝 File Locations

```
c:/UoM/Bobber/Bobbers/
├── lib/
│   ├── real-scraper.ts          ← Main scraper
│   ├── scraper-utils.ts         ← Extraction utilities
│   └── supabase.ts              ← Database integration
├── app/
│   ├── api/scrape/route.ts      ← API endpoint
│   ├── admin/scraper/page.tsx   ← Admin interface
│   └── events/page.tsx          ← Events display
├── scripts/
│   ├── test-scraper.js          ← Test script
│   └── scrape-events.js         ← CLI scraper
└── REAL_SCRAPER_GUIDE.md        ← Detailed documentation
```

---

**Made with Bob** 🤖

Good luck with your web scraper! 🎉