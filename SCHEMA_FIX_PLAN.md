# Database Schema Fix Plan

## Problem Summary

The application is failing with error: `Could not find the 'attendees_count' column of 'events' in the schema cache`

This occurs because the TypeScript code expects database columns that don't exist in the actual Supabase schema.

## Root Cause Analysis

### Current Database Schema (from SETUP.md)
```sql
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
```

**Columns in database:** 9 columns
- event_id
- title
- description
- date_time
- location
- category
- language
- rsvp_url
- created_at
- updated_at

### TypeScript Event Interface (from lib/types.ts)
```typescript
export interface Event {
  event_id: string;
  title: string;
  description: string;
  date_time: string;
  location: string;
  category: EventCategory;
  language: EventLanguage;
  price: number;                    // ❌ NOT IN DATABASE
  currency: string;                 // ❌ NOT IN DATABASE
  registration_url: string;         // ❌ NOT IN DATABASE (rsvp_url exists instead)
  image_url: string | null;         // ❌ NOT IN DATABASE
  organizer: string | null;         // ❌ NOT IN DATABASE
  tags: string[];                   // ❌ NOT IN DATABASE
  is_featured: boolean;             // ❌ NOT IN DATABASE
  capacity: number | null;          // ❌ NOT IN DATABASE
  attendees_count: number;          // ❌ NOT IN DATABASE
  created_at?: string;
  updated_at?: string;
}
```

**Extra fields in TypeScript (not in database):** 9 fields
- price
- currency
- registration_url (database has rsvp_url)
- image_url
- organizer
- tags
- is_featured
- capacity
- attendees_count

## Solution: Minimal Fix Approach

Align the TypeScript code with the existing database schema by removing unsupported fields.

### Files to Modify

#### 1. lib/types.ts
**Changes:**
- Remove: price, currency, image_url, organizer, tags, is_featured, capacity, attendees_count
- Rename: registration_url → rsvp_url (to match database)

**New Event interface:**
```typescript
export interface Event {
  event_id: string;
  title: string;
  description: string;
  date_time: string;
  location: string;
  category: EventCategory;
  language: EventLanguage;
  rsvp_url: string;
  created_at?: string;
  updated_at?: string;
}
```

#### 2. app/api/events/submit/route.ts
**Changes:**
- Remove price, currency, organizer validation
- Remove registration_url → use rsvp_url instead
- Simplify eventData object to only include supported fields
- Remove references to attendees_count, tags, is_featured, capacity, image_url

**Key changes:**
```typescript
// Remove these validations (lines 51-73)
const price = body.price !== undefined ? parseFloat(body.price) : 0;
const currency = body.currency || 'CHF';
const organizer = body.organizer || null;

// Simplify eventData (lines 103-119)
const eventData: Omit<Event, 'event_id' | 'created_at' | 'updated_at'> = {
  title: title.trim(),
  description: description.trim(),
  date_time,
  location: location.trim(),
  category,
  language,
  rsvp_url: body.rsvp_url || ''
};
```

#### 3. app/contact/page.tsx
**Changes:**
- Remove price, currency, organizer, registration_url fields from form
- Update FormData interface
- Remove related validation
- Simplify form to only collect: title, description, date_time, location

**New FormData interface:**
```typescript
interface FormData {
  title: string;
  description: string;
  date_time: string;
  location: string;
}
```

**Remove these form sections:**
- Lines 436-450: Organizer field
- Lines 452-488: Price and Currency fields
- Lines 490-505: Registration URL field

#### 4. lib/supabase.ts
**Changes:**
- Update createEvent to only use supported fields
- Update storeScrapedEvents to map to correct schema
- Remove references to unsupported fields

**Key changes in storeScrapedEvents (lines 126-148):**
```typescript
const eventData: Omit<Event, 'event_id' | 'created_at' | 'updated_at'> = {
  title: scrapedEvent.title,
  description: scrapedEvent.description,
  date_time: scrapedEvent.date_time,
  location: scrapedEvent.location,
  category: category as EventCategory,
  language: language as EventLanguage,
  rsvp_url: scrapedEvent.source_url
};
```

## Implementation Steps

1. ✅ **Analyze schema mismatch** - Completed
2. ✅ **Document missing columns** - Completed
3. ⏳ **Update lib/types.ts** - Remove unsupported fields
4. ⏳ **Update app/api/events/submit/route.ts** - Simplify to supported fields only
5. ⏳ **Update app/contact/page.tsx** - Remove price, currency, organizer, registration_url fields
6. ⏳ **Update lib/supabase.ts** - Fix eventService methods
7. ⏳ **Test event submission** - Verify error is resolved
8. ⏳ **Update SETUP.md** - Document the correct, minimal schema

## Expected Outcome

After these changes:
- ✅ Event submission will work without schema errors
- ✅ Form will be simpler with only essential fields
- ✅ Code will match the actual database schema
- ✅ Auto-categorization and language detection will still work
- ✅ Events will be published immediately after submission

## Future Enhancements (Optional)

If additional fields are needed later, they can be added to the database with:
```sql
ALTER TABLE events ADD COLUMN price DECIMAL(10,2) DEFAULT 0;
ALTER TABLE events ADD COLUMN currency VARCHAR(10) DEFAULT 'CHF';
ALTER TABLE events ADD COLUMN organizer VARCHAR(200);
ALTER TABLE events ADD COLUMN image_url TEXT;
ALTER TABLE events ADD COLUMN tags TEXT[];
ALTER TABLE events ADD COLUMN is_featured BOOLEAN DEFAULT FALSE;
ALTER TABLE events ADD COLUMN capacity INTEGER;
ALTER TABLE events ADD COLUMN attendees_count INTEGER DEFAULT 0;
```

But for now, the minimal fix approach is faster and requires no database changes.