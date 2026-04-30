# Events Page Tabbed Interface Implementation Plan

## Overview
Transform the events page to use a tabbed interface where search and post features are contained in a single box with clickable header tabs.

## Current State
- Event submission form is displayed as a separate section above search/filters
- Search and filters section is displayed as a separate box below the form
- Both sections are always visible simultaneously

## Target State
- Single unified box with a header containing two clickable tabs
- Left tab: "Search Events" (default active)
- Right tab: "Post Event"
- Only the active tab's content is displayed
- Clean visual indicators for active/inactive states

## Implementation Details

### 1. State Management
Add a new state variable to track the active tab:
```typescript
const [activeTab, setActiveTab] = useState<'search' | 'post'>('search');
```

### 2. Header Component Structure
```
┌─────────────────────────────────────────────┐
│ Search Events  │  Post Event                │ ← Clickable header
├─────────────────────────────────────────────┤
│                                             │
│         Active Tab Content Here             │
│                                             │
└─────────────────────────────────────────────┘
```

### 3. Tab Header Styling
- Active tab: Bold text, darker color, bottom border indicator
- Inactive tab: Regular weight, lighter color, hover effect
- Smooth transition effects on hover and click
- Clear visual separation between tabs

### 4. Content Sections

#### Search Tab Content (lines 418-481)
- Search bar
- Category filters (AI, Data, Process, System, CS)
- Language filters (English, German, French, Italian)
- Location filter

#### Post Tab Content (lines 256-415)
- Event submission form header with emoji and description
- Form fields:
  - Title (required)
  - Description (required, textarea)
  - Date & Time (required, datetime-local)
  - Location (required)
  - RSVP URL (required)
- Auto-detection info note
- Submit button with loading state
- Success/error message display

### 5. Layout Changes

**Before:**
```
Page Header
↓
Event Submission Form Section (always visible)
↓
Search and Filters Section (always visible)
↓
Events List
```

**After:**
```
Page Header
↓
Tabbed Box:
  - Header: [Search Events] | [Post Event]
  - Content: (conditional based on active tab)
↓
Events List
```

### 6. Component Organization

The main component structure will be:
```typescript
export default function Events() {
  // State declarations
  const [activeTab, setActiveTab] = useState<'search' | 'post'>('search');
  // ... existing state ...

  return (
    <div>
      {/* Navigation Header */}
      
      {/* Main Content */}
      <main>
        {/* Page Header */}
        
        {/* Tabbed Interface Box */}
        <section className="mb-16">
          <div className="card bg-white rounded-2xl shadow-lg">
            {/* Tab Header */}
            <div className="flex border-b border-navy-200">
              <button
                onClick={() => setActiveTab('search')}
                className={/* active/inactive styles */}
              >
                Search Events
              </button>
              <button
                onClick={() => setActiveTab('post')}
                className={/* active/inactive styles */}
              >
                Post Event
              </button>
            </div>
            
            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'search' ? (
                // Search and filters content
              ) : (
                // Event submission form content
              )}
            </div>
          </div>
        </section>
        
        {/* Events List */}
      </main>
      
      {/* Footer */}
    </div>
  );
}
```

### 7. Styling Specifications

#### Tab Header Container
- Flexbox layout
- Border bottom to separate from content
- Background: white

#### Tab Buttons
- Equal width or auto-width based on content
- Padding: 1rem horizontal, 0.75rem vertical
- Transition: all 0.2s ease

**Active State:**
- Font weight: 600 (semibold)
- Color: navy-900
- Border bottom: 3px solid navy-800
- Background: white

**Inactive State:**
- Font weight: 500 (medium)
- Color: navy-600
- Border bottom: 3px solid transparent
- Background: white
- Hover: background navy-50, color navy-900

#### Content Area
- Padding: 1.5rem (p-6)
- Smooth fade-in animation when switching tabs

### 8. Accessibility Considerations
- Use semantic button elements for tabs
- Add ARIA attributes:
  - `role="tablist"` on header container
  - `role="tab"` on tab buttons
  - `aria-selected` on active tab
  - `role="tabpanel"` on content area
- Keyboard navigation support (arrow keys)
- Focus indicators

### 9. Testing Checklist
- [ ] Tab switching works correctly
- [ ] Search functionality works in search tab
- [ ] Event submission works in post tab
- [ ] Form validation works correctly
- [ ] Success/error messages display properly
- [ ] Events list updates after submission
- [ ] Responsive design on mobile devices
- [ ] Keyboard navigation works
- [ ] Visual indicators are clear

## Files to Modify
- [`app/events/page.tsx`](app/events/page.tsx) - Main events page component

## Benefits
1. **Cleaner UI**: Reduces visual clutter by showing only relevant content
2. **Better UX**: Clear separation between browsing and posting actions
3. **Improved Focus**: Users can focus on one task at a time
4. **Responsive**: Easier to adapt for mobile devices
5. **Scalable**: Easy to add more tabs in the future if needed

## Migration Notes
- All existing functionality remains intact
- No changes to API endpoints required
- No database schema changes needed
- Backward compatible with existing event data