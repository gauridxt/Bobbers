# BOBBERS Web Scraping - Deployment Guide

## Prerequisites

### Required Software
- Node.js 18+ and npm
- Git
- Supabase account (for database)

### Required Environment Variables
Create a `.env.local` file in the project root:

```env
# Supabase Configuration (Required)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Scraping Configuration
SCRAPING_SCHEDULE=0 */6 * * *
SCRAPING_TIMEOUT=30000
SCRAPING_MAX_RETRIES=3
SCRAPING_RATE_LIMIT=2000

# Optional: Notification Configuration
NOTIFICATION_EMAIL=admin@example.com
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
```

---

## Installation Steps

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd bobbers

# Install dependencies
npm install

# Verify installation
npm list cheerio axios puppeteer @supabase/supabase-js
```

### 2. Configure Supabase Database

Ensure your Supabase database has the `events` table:

```sql
CREATE TABLE IF NOT EXISTS events (
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

-- Create indexes for better performance
CREATE INDEX idx_events_date_time ON events(date_time);
CREATE INDEX idx_events_category ON events(category);
CREATE INDEX idx_events_language ON events(language);
CREATE INDEX idx_events_location ON events(location);
```

### 3. Test the Installation

```bash
# Test database connection
node scripts/test-database-integration.js

# Test Eventbrite scraper
node scripts/test-eventbrite-scraper.js

# Test full scraping workflow
npm run scrape
```

---

## Running the Application

### Development Mode

```bash
# Start Next.js development server
npm run dev

# Access the application
# - Main site: http://localhost:3000
# - Events page: http://localhost:3000/events
# - Admin scraper: http://localhost:3000/admin/scraper
```

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

---

## Automated Scraping Setup

### Option 1: Using Cron (Linux/macOS)

1. Open crontab editor:
```bash
crontab -e
```

2. Add scraping schedule (example: every 6 hours):
```cron
0 */6 * * * cd /path/to/bobbers && node scripts/automated-scraper.js >> logs/cron.log 2>&1
```

3. Verify cron job:
```bash
crontab -l
```

### Option 2: Using Task Scheduler (Windows)

1. Open Task Scheduler
2. Create Basic Task
3. Set trigger (e.g., Daily at specific times)
4. Set action:
   - Program: `node`
   - Arguments: `scripts/automated-scraper.js`
   - Start in: `C:\path\to\bobbers`

### Option 3: Using PM2 (Recommended for Production)

```bash
# Install PM2 globally
npm install -g pm2

# Create PM2 ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'bobbers-scraper',
    script: './scripts/automated-scraper.js',
    cron_restart: '0 */6 * * *',
    autorestart: false,
    watch: false,
    env: {
      NODE_ENV: 'production'
    }
  }]
};
EOF

# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on system boot
pm2 startup
```

### Option 4: Using Vercel Cron Jobs

If deploying to Vercel, add to `vercel.json`:

```json
{
  "crons": [{
    "path": "/api/scrape",
    "schedule": "0 */6 * * *"
  }]
}
```

---

## Monitoring and Logs

### View Scraping Logs

```bash
# View recent logs
tail -f logs/scraper.log

# View last 100 lines
tail -n 100 logs/scraper.log

# Search for errors
grep ERROR logs/scraper.log
```

### Monitor Database

```bash
# Check recent events
node -e "
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
supabase.from('events').select('count').then(r => console.log('Total events:', r.data));
"
```

### Health Check Script

Create `scripts/health-check.js`:

```javascript
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function healthCheck() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  
  const { data, error } = await supabase
    .from('events')
    .select('count')
    .limit(1);
  
  if (error) {
    console.error('❌ Health check failed:', error.message);
    process.exit(1);
  }
  
  console.log('✅ System healthy');
  process.exit(0);
}

healthCheck();
```

---

## Troubleshooting

### Issue: Puppeteer Installation Fails

**Solution 1**: Skip Chromium download
```bash
PUPPETEER_SKIP_DOWNLOAD=true npm install puppeteer
```

**Solution 2**: Install system dependencies (Linux)
```bash
sudo apt-get install -y \
  chromium-browser \
  libx11-xcb1 \
  libxcomposite1 \
  libxcursor1 \
  libxdamage1 \
  libxi6 \
  libxtst6 \
  libnss3 \
  libcups2 \
  libxss1 \
  libxrandr2 \
  libasound2 \
  libpangocairo-1.0-0 \
  libatk1.0-0 \
  libatk-bridge2.0-0 \
  libgtk-3-0
```

### Issue: Database Connection Fails

**Check**:
1. Verify `.env.local` has correct Supabase credentials
2. Check Supabase project is active
3. Verify network connectivity
4. Check RLS policies allow anonymous access

**Test connection**:
```bash
node scripts/test-database-integration.js
```

### Issue: No Events Scraped

**Possible causes**:
1. Website structure changed
2. Rate limiting/IP blocking
3. Network issues
4. Invalid selectors

**Debug**:
```bash
# Enable verbose logging
DEBUG=* node scripts/test-eventbrite-scraper.js

# Test with custom URL
node -e "
const { CustomScraper } = require('./lib/event-scraper');
const scraper = new CustomScraper({
  url: 'https://example.com',
  selectors: {},
  type: 'static'
});
scraper.scrape().then(r => console.log(r));
"
```

### Issue: High Memory Usage

**Solutions**:
1. Limit concurrent scraping
2. Use static scraping instead of dynamic when possible
3. Increase Node.js memory limit:
```bash
NODE_OPTIONS="--max-old-space-size=4096" node scripts/automated-scraper.js
```

### Issue: Duplicate Events

**Check**:
1. Duplicate detection logic in `lib/supabase.ts`
2. Database unique constraints
3. Event title and date matching

**Fix duplicates**:
```sql
-- Find duplicates
SELECT title, date_time, COUNT(*)
FROM events
GROUP BY title, date_time
HAVING COUNT(*) > 1;

-- Remove duplicates (keep oldest)
DELETE FROM events a
USING events b
WHERE a.event_id > b.event_id
  AND a.title = b.title
  AND a.date_time = b.date_time;
```

---

## Performance Optimization

### 1. Database Indexing

```sql
-- Add indexes for common queries
CREATE INDEX IF NOT EXISTS idx_events_search 
ON events USING gin(to_tsvector('english', title || ' ' || description));

CREATE INDEX IF NOT EXISTS idx_events_tags 
ON events USING gin(tags);
```

### 2. Caching Strategy

Add Redis caching for scraped data:

```javascript
// Example with node-cache
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 3600 }); // 1 hour

async function getCachedEvents(source) {
  const cached = cache.get(source);
  if (cached) return cached;
  
  const events = await scrapeEvents(source);
  cache.set(source, events);
  return events;
}
```

### 3. Parallel Scraping

```javascript
// Scrape multiple sources in parallel
const results = await Promise.all([
  scrapeEventbrite(),
  scrapeMeetup(),
  scrapeLinkedIn()
]);
```

---

## Security Best Practices

### 1. Environment Variables

- Never commit `.env.local` to version control
- Use different credentials for dev/staging/production
- Rotate API keys regularly

### 2. Rate Limiting

Add rate limiting to API endpoints:

```javascript
// middleware/rateLimit.js
import rateLimit from 'express-rate-limit';

export const scraperLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: 'Too many scraping requests, please try again later'
});
```

### 3. Authentication

Add authentication to admin routes:

```javascript
// middleware/auth.js
export function requireAuth(req, res, next) {
  const token = req.headers.authorization;
  if (!token || !verifyToken(token)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}
```

### 4. Input Sanitization

Always sanitize scraped content:

```javascript
import DOMPurify from 'isomorphic-dompurify';

function sanitizeHTML(html) {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: []
  });
}
```

---

## Backup and Recovery

### Database Backup

```bash
# Backup events table
pg_dump -h your-supabase-host -U postgres -t events > backup.sql

# Restore from backup
psql -h your-supabase-host -U postgres < backup.sql
```

### Automated Backups

Add to crontab:
```cron
0 2 * * * pg_dump -h your-supabase-host -U postgres -t events > /backups/events-$(date +\%Y\%m\%d).sql
```

---

## Scaling Considerations

### Horizontal Scaling

1. **Multiple Scraper Instances**
   - Use message queue (Redis, RabbitMQ)
   - Distribute sources across instances
   - Implement leader election

2. **Load Balancing**
   - Use Nginx or cloud load balancer
   - Distribute API requests
   - Session affinity for admin interface

### Vertical Scaling

1. **Increase Resources**
   - More CPU for Puppeteer
   - More RAM for concurrent scraping
   - Faster storage for logs

2. **Database Optimization**
   - Connection pooling
   - Read replicas
   - Partitioning by date

---

## Monitoring Dashboard

### Recommended Tools

1. **Application Monitoring**
   - New Relic
   - Datadog
   - Sentry (for error tracking)

2. **Database Monitoring**
   - Supabase Dashboard
   - pgAdmin
   - Custom queries

3. **Log Aggregation**
   - ELK Stack (Elasticsearch, Logstash, Kibana)
   - Splunk
   - CloudWatch (AWS)

### Custom Metrics

Track these metrics:
- Scraping success rate
- Events per source
- Processing time
- Database write latency
- Error frequency
- Duplicate rate

---

## Support and Maintenance

### Regular Maintenance Tasks

**Weekly**:
- Review scraping logs
- Check error rates
- Verify data quality
- Update selectors if needed

**Monthly**:
- Database cleanup (old events)
- Performance review
- Security updates
- Backup verification

**Quarterly**:
- Add new event sources
- Update categorization logic
- Review and optimize queries
- Capacity planning

### Getting Help

1. Check documentation: `README_SCRAPER.md`, `SCRAPER_GUIDE.md`
2. Review logs: `logs/scraper.log`
3. Test components individually
4. Check GitHub issues (if applicable)

---

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Database schema created
- [ ] Dependencies installed
- [ ] Tests passing
- [ ] Logs directory created
- [ ] Cron job/scheduler configured
- [ ] Monitoring setup
- [ ] Backup strategy in place
- [ ] Security measures implemented
- [ ] Documentation reviewed
- [ ] Health checks working
- [ ] Error notifications configured

---

**Document Version**: 1.0  
**Last Updated**: 2026-04-30  
**Maintained By**: BOBBERS Team