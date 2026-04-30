# Events Page Tabbed Interface - Visual Design

## Current Layout

```
┌─────────────────────────────────────────────────────────────┐
│                    BOBBERS - Events Page                     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   🎉 Submit Your Event                       │
│                   List Your Tech Event                       │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │ Event Title *                                       │    │
│  │ [_____________________________________________]     │    │
│  │                                                     │    │
│  │ Description *                                       │    │
│  │ [_____________________________________________]     │    │
│  │ [_____________________________________________]     │    │
│  │                                                     │    │
│  │ Date & Time *                                       │    │
│  │ [_____________________________________________]     │    │
│  │                                                     │    │
│  │ Location *                                          │    │
│  │ [_____________________________________________]     │    │
│  │                                                     │    │
│  │ RSVP/Event URL *                                    │    │
│  │ [_____________________________________________]     │    │
│  │                                                     │    │
│  │              [Submit Event Button]                  │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Search: [_________________________________________]         │
│                                                              │
│  Categories: [AI] [Data] [Process] [System] [CS]            │
│                                                              │
│  Languages: [English] [German] [French] [Italian]           │
│                                                              │
│  Location: [_________________________________________]       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                        Events List                           │
│  [Event Card] [Event Card] [Event Card]                     │
└─────────────────────────────────────────────────────────────┘
```

## New Tabbed Layout

```
┌─────────────────────────────────────────────────────────────┐
│                    BOBBERS - Events Page                     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  ┏━━━━━━━━━━━━━━━┓ ┌───────────────┐                       │
│  ┃ Search Events ┃ │  Post Event   │  ← Clickable Headers  │
│  ┗━━━━━━━━━━━━━━━┛ └───────────────┘                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Search: [_________________________________________]         │
│                                                              │
│  Categories: [AI] [Data] [Process] [System] [CS]            │
│                                                              │
│  Languages: [English] [German] [French] [Italian]           │
│                                                              │
│  Location: [_________________________________________]       │
│                                                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                        Events List                           │
│  [Event Card] [Event Card] [Event Card]                     │
└─────────────────────────────────────────────────────────────┘
```

## When "Post Event" Tab is Clicked

```
┌─────────────────────────────────────────────────────────────┐
│                    BOBBERS - Events Page                     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  ┌───────────────┐ ┏━━━━━━━━━━━━━┓                         │
│  │ Search Events │ ┃ Post Event  ┃  ← Clickable Headers    │
│  └───────────────┘ ┗━━━━━━━━━━━━━┛                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│                   🎉 Submit Your Event                       │
│                   List Your Tech Event                       │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │ Event Title *                                       │    │
│  │ [_____________________________________________]     │    │
│  │                                                     │    │
│  │ Description *                                       │    │
│  │ [_____________________________________________]     │    │
│  │ [_____________________________________________]     │    │
│  │                                                     │    │
│  │ Date & Time *                                       │    │
│  │ [_____________________________________________]     │    │
│  │                                                     │    │
│  │ Location *                                          │    │
│  │ [_____________________________________________]     │    │
│  │                                                     │    │
│  │ RSVP/Event URL *                                    │    │
│  │ [_____________________________________________]     │    │
│  │                                                     │    │
│  │              [Submit Event Button]                  │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                        Events List                           │
│  [Event Card] [Event Card] [Event Card]                     │
└─────────────────────────────────────────────────────────────┘
```

## Tab Header States

### Active Tab
```
┏━━━━━━━━━━━━━━━┓
┃ Search Events ┃  ← Bold text, dark color, bottom border
┗━━━━━━━━━━━━━━━┛
```

### Inactive Tab
```
┌───────────────┐
│  Post Event   │  ← Regular text, lighter color, no border
└───────────────┘
```

### Hover State (Inactive)
```
┌───────────────┐
│  Post Event   │  ← Slightly darker, background tint
└───────────────┘
    ↑ cursor
```

## Responsive Behavior (Mobile)

```
┌─────────────────────────┐
│   BOBBERS - Events      │
└─────────────────────────┘

┌─────────────────────────┐
│ ┏━━━━━━━━━━━━━┓        │
│ ┃Search Events┃        │
│ ┗━━━━━━━━━━━━━┛        │
│ ┌─────────────┐        │
│ │ Post Event  │        │
│ └─────────────┘        │
├─────────────────────────┤
│                         │
│  Search: [_________]    │
│                         │
│  Categories:            │
│  [AI] [Data]            │
│  [Process] [System]     │
│                         │
│  Languages:             │
│  [English] [German]     │
│                         │
└─────────────────────────┘
```

## Color Scheme

- **Active Tab**
  - Text: `text-navy-900` (#1a2332)
  - Font Weight: `font-semibold` (600)
  - Border: `border-b-3 border-navy-800`
  - Background: `bg-white`

- **Inactive Tab**
  - Text: `text-navy-600` (#475569)
  - Font Weight: `font-medium` (500)
  - Border: `border-b-3 border-transparent`
  - Background: `bg-white`
  - Hover: `bg-navy-50 text-navy-900`

- **Box Container**
  - Background: `bg-white`
  - Border Radius: `rounded-2xl`
  - Shadow: `shadow-lg`

## Interaction Flow

1. **User lands on page** → Search tab is active by default
2. **User clicks "Post Event"** → Content smoothly transitions to form
3. **User submits event** → Success message shows, stays on Post tab
4. **User clicks "Search Events"** → Returns to search interface
5. **Events list** → Always visible below, updates based on search/filters