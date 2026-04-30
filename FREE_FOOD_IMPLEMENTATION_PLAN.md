# Free Food Feature Implementation Plan

## Overview
Add a `free_food` boolean column to the events system to indicate whether an event provides free food. The default value should be `false`, and any missing entries in the database should be treated as `false`.

## Requirements (Confirmed)
1. **UI Placement**: Manual checkbox in the event submission form
2. **Filter Behavior**: Simple checkbox filter "Free Food Only" (shows only events with free food when checked)
3. **Visual Indicator**: Badge "🍕 Free Food" displayed next to category/language badges
4. **Database**: Column already exists in database schema

## Database Schema
The `free_food` column has been added to the database schema with the following characteristics:
- **Type**: `boolean`
- **Default**: `false`
- **Nullable**: Yes (for backward compatibility)
- **Handling**: Treat `NULL` values as `false` in application logic

## Implementation Checklist

### 1. Type Definitions (`lib/types.ts`)
- [x] Add `free_food?: boolean` to the `Event` interface
- This makes the field optional to handle existing events without this field

### 2. Database Service (`lib/supabase.ts`)
- [x] Update `getAllEvents()` to include `free_food` field
- [x] Update `getFilteredEvents()` to include `free_food` field
- [x] Update `createEvent()` to accept and store `free_food` field
- [x] Update `updateEvent()` to handle `free_food` field
- [x] Update `storeScrapedEvents()` to set `free_food: false` by default for scraped events
- [x] Update `searchEvents()` to support filtering by `free_food` parameter
- [x] Ensure all queries handle `NULL` values by coalescing to `false`

### 3. Event Submission API (`app/api/events/submit/route.ts`)
- [x] Accept `free_food` field from request body
- [x] Validate `free_food` as boolean (optional)
- [x] Default to `false` if not provided
- [x] Include in event data sent to database

### 4. Event Search API (`app/api/events/search/route.ts`)
- [x] Add `free_food` query parameter support
- [x] Parse `free_food` as boolean from query string
- [x] Pass to `searchEvents()` function
- [x] Include in response filters

### 5. Frontend Event Form (`app/events/page.tsx`)
- [x] Add `free_food: false` to `FormData` interface
- [x] Add `free_food: false` to initial form state
- [x] Add checkbox input for "Free Food Provided"
- [x] Handle checkbox state changes
- [x] Include in form submission

### 6. Frontend Event Display (`app/events/page.tsx`)
- [x] Add visual indicator (badge/icon) for events with free food
- [x] Display "🍕 Free Food" badge when `event.free_food === true`
- [x] Handle missing/undefined values gracefully

### 7. Frontend Search Filters (`app/events/page.tsx`)
- [x] Add "Free Food Only" toggle/checkbox filter
- [x] Add state management for free food filter
- [x] Include in API search parameters
- [x] Update filter UI to show free food option

### 8. Scraper Types (`lib/scraper-types.ts`)
- [x] Add `free_food?: boolean` to `ScrapedEventData` interface
- This allows scrapers to detect and include free food information

### 9. Data Handling Strategy
**Default Value Handling:**
- New events: Default to `false` if not specified
- Scraped events: Default to `false` unless detected
- Database queries: Use `COALESCE(free_food, false)` to handle NULL values
- Frontend display: Treat undefined/null as `false`

**Backward Compatibility:**
- Existing events without `free_food` value will be treated as `false`
- No migration needed for existing data
- Optional field in TypeScript interfaces

## UI/UX Design

### Event Form
```
┌─────────────────────────────────────┐
│ Event Title *                       │
│ [________________________]          │
│                                     │
│ Description *                       │
│ [________________________]          │
│                                     │
│ Date & Time *                       │
│ [________________________]          │
│                                     │
│ Location *                          │
│ [________________________]          │
│                                     │
│ RSVP/Event URL *                    │
│ [________________________]          │
│                                     │
│ ☐ Free Food Provided                │
│                                     │
│ [Submit Event]                      │
└─────────────────────────────────────┘
```

### Event Card Display
```
┌─────────────────────────────────────┐
│ [AI] [English] [🍕 Free Food]       │
│                                     │
│ Event Title                         │
│ Event description...                │
│                                     │
│ 📅 Date and time                    │
│ 📍 Location                         │
│                                     │
│ [View Event]                        │
└─────────────────────────────────────┘
```

### Search Filters
```
┌─────────────────────────────────────┐
│ Search Events                       │
│                                     │
│ Categories: [AI] [Data] [Process]   │
│ Languages: [English] [German]       │
│ Location: [____________]            │
│                                     │
│ ☐ Free Food Only                    │
└─────────────────────────────────────┘
```

## Testing Checklist

### Backend Testing
- [ ] Test creating event with `free_food: true`
- [ ] Test creating event with `free_food: false`
- [ ] Test creating event without `free_food` field (should default to false)
- [ ] Test searching events with `free_food=true` filter
- [ ] Test that existing events without `free_food` are treated as false
- [ ] Test scraper integration with `free_food` field

### Frontend Testing
- [ ] Test form submission with free food checkbox checked
- [ ] Test form submission with free food checkbox unchecked
- [ ] Test that free food badge appears on events with `free_food: true`
- [ ] Test that free food badge does NOT appear on events with `free_food: false`
- [ ] Test free food filter functionality
- [ ] Test that events without `free_food` field display correctly

## Implementation Order

1. **Backend First** (Types → Database → APIs)
   - Update type definitions
   - Update database service layer
   - Update API endpoints

2. **Frontend Second** (Form → Display → Filters)
   - Update form to include checkbox
   - Update event cards to show badge
   - Add filter option

3. **Testing & Validation**
   - Test all CRUD operations
   - Test filtering
   - Test backward compatibility

## Notes

- The field is optional (`free_food?: boolean`) to maintain backward compatibility
- All undefined/null values should be treated as `false` in the application logic
- The database column allows NULL but application logic defaults to `false`
- Scrapers should default to `false` unless they can detect free food information
- The UI should clearly indicate when free food is provided using a visual badge/icon

## Success Criteria

✅ Events can be created with `free_food` field
✅ Events display free food indicator when applicable
✅ Users can filter events by free food availability
✅ Existing events without `free_food` field work correctly
✅ Scraped events default to `free_food: false`
✅ All database queries handle NULL values properly