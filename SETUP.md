# BOBBERS - Setup Guide

## ✅ Completed Setup Steps

The following has been configured for you:

1. **Next.js Project Structure**
   - Next.js 16 with App Router
   - TypeScript configuration
   - Tailwind CSS for styling
   - PostCSS configuration

2. **Project Files Created**
   - `app/layout.tsx` - Root layout with metadata
   - `app/page.tsx` - Homepage with basic UI
   - `app/globals.css` - Global styles with Tailwind
   - `lib/types.ts` - TypeScript interfaces for Event model
   - `lib/supabase.ts` - Supabase client and helper functions
   - Configuration files (tsconfig.json, tailwind.config.ts, etc.)

3. **Dependencies Installed**
   - next, react, react-dom
   - typescript, @types packages
   - tailwindcss, postcss, autoprefixer
   - @supabase/supabase-js

## 🚀 Next Steps

### 1. Set Up Supabase Database

#### Create Supabase Account
1. Go to [https://supabase.com](https://supabase.com)
2. Sign up for a free account
3. Create a new project
   - Choose a project name (e.g., "bobbers-events")
   - Set a strong database password
   - Select region: **Europe West (Frankfurt)** - closest to Zurich

#### Create Events Table
1. In your Supabase dashboard, go to **SQL Editor**
2. Run this SQL to create the events table:

```sql
-- Create events table
CREATE TABLE events (
  event_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  date_time TIMESTAMP WITH TIME ZONE NOT NULL,
  location VARCHAR(255) NOT NULL,
  category VARCHAR(50) CHECK (category IN ('AI', 'Data', 'Process', 'System', 'CS')),
  language VARCHAR(50) NOT NULL,
  rsvp_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_events_date ON events(date_time);
CREATE INDEX idx_events_category ON events(category);
CREATE INDEX idx_events_language ON events(language);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

#### Get API Credentials
1. Go to **Project Settings** → **API**
2. Copy the following:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

### 2. Configure Environment Variables

1. Copy the example file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### 3. Test the Setup

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

You should see the BOBBERS homepage with a welcome message!

### 4. Add Sample Data (Optional)

To test the database connection, add a sample event via Supabase dashboard:

1. Go to **Table Editor** → **events**
2. Click **Insert row**
3. Add sample data:
   - title: "Zurich AI Meetup"
   - description: "Monthly gathering for AI enthusiasts"
   - date_time: (pick a future date)
   - location: "ETH Zurich, Main Building"
   - category: "AI"
   - language: "English"
   - rsvp_url: "https://example.com"

## 📁 Project Structure

```
bobbers/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Homepage
│   └── globals.css         # Global styles
├── components/             # React components (to be created)
├── lib/
│   ├── supabase.ts        # Supabase client & helpers
│   └── types.ts           # TypeScript types
├── scrapers/             # (External) Python/Node scripts for data scraping
├── public/                # Static assets
├── .env.local.example     # Environment variables template
├── .gitignore            # Git ignore rules
├── next.config.ts        # Next.js configuration
├── package.json          # Dependencies
├── tailwind.config.ts    # Tailwind configuration
└── tsconfig.json         # TypeScript configuration
## Development Roadmap
Phase 1: Frontend Core (Current)
[x] Project setup & UI scaffolding
[x] Database schema creation
[ ] Event fetching logic (Supabase select queries)
[ ] Search functionality & Category/Language filters
[ ] Event Cards rendering

Phase 2: Data Aggregation Pipeline (Backend Engine)
[ ] Build external scraper (e.g., Python + BeautifulSoup/Playwright)
[ ] Map scraped data to the events table schema
[ ] Use Supabase service_role key to securely INSERT scraped events into the DB
[ ] Implement data deduplication (preventing duplicate events on re-scrape)

Phase 3: Automation & Enhancements
[ ] Set up CRON jobs (e.g., GitHub Actions or Vercel Cron) to run scrapers daily
[ ] Automated cleanup script to delete past events
[ ] SEO & Performance optimization

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 📚 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Deployment:** Vercel (recommended)

## 🆘 Troubleshooting

### Port 3000 already in use
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9
```

### Module not found errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Supabase connection issues
- Verify your `.env.local` file exists and has correct credentials
- Check that your Supabase project is active
- Ensure the anon key has proper permissions

## 📞 Support

For issues or questions:
1. Check the README.md for project context
2. Review Supabase documentation: https://supabase.com/docs
3. Check Next.js documentation: https://nextjs.org/docs

---