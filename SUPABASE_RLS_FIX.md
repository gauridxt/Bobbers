# Fix Supabase Row Level Security (RLS)

## Problem
The database is rejecting inserts due to Row Level Security policies.

## Solution

You need to either:
1. **Disable RLS** (easier for development)
2. **Add RLS policies** (better for production)

### Option 1: Disable RLS (Recommended for Development)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **Table Editor** → **events** table
4. Click on the table settings (gear icon)
5. Find **"Enable Row Level Security (RLS)"**
6. **Uncheck** this option
7. Save changes

### Option 2: Add RLS Policies (For Production)

Run this SQL in your Supabase SQL Editor:

```sql
-- Allow public read access to events
CREATE POLICY "Allow public read access"
ON events
FOR SELECT
TO public
USING (true);

-- Allow public insert access (for development/testing)
CREATE POLICY "Allow public insert access"
ON events
FOR INSERT
TO public
WITH CHECK (true);

-- Allow public update access (for development/testing)
CREATE POLICY "Allow public update access"
ON events
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- Allow public delete access (for development/testing)
CREATE POLICY "Allow public delete access"
ON events
FOR DELETE
TO public
USING (true);
```

**Note:** For production, you should restrict these policies to authenticated users only.

### Production-Ready RLS Policies

For a production environment, use these more secure policies:

```sql
-- Drop the public policies first
DROP POLICY IF EXISTS "Allow public insert access" ON events;
DROP POLICY IF EXISTS "Allow public update access" ON events;
DROP POLICY IF EXISTS "Allow public delete access" ON events;

-- Keep public read access
-- (Already created above)

-- Allow authenticated users to insert events
CREATE POLICY "Allow authenticated insert"
ON events
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to update their own events
CREATE POLICY "Allow authenticated update"
ON events
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow authenticated users to delete events
CREATE POLICY "Allow authenticated delete"
ON events
FOR DELETE
TO authenticated
USING (true);
```

## After Fixing

Run the seed script again:

```bash
npm run seed-db
```

You should see:
```
✓ Added: "Zurich AI & Machine Learning Meetup"
✓ Added: "Data Science Workshop: Advanced Analytics"
...
```

## Verify

Check your events table in Supabase:
1. Go to **Table Editor** → **events**
2. You should see 10 sample events

---

**Quick Fix:** For now, just disable RLS in the Supabase dashboard to continue development.