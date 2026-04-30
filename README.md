# BOBBERS APP - Project Specification & AI Context

## 0. Core Identity & Elevator Pitch
**App Name:** BOBBERS
**Mission:** To cure "fragmented networking" by helping tech professionals and students find highly relevant, niche IT/Data events in under two minutes.
**Current Phase:** MVP Development

## 1. AI Agent Instructions
* **Role:** Act as a Senior Full-Stack Developer and Product Advisor.
* **Task:** When asked to generate code or suggest features, prioritize the MVP Scope. Do not suggest out-of-scope features unless explicitly asked.
* **Coding Standards:** Use Next.js (App Router), Tailwind CSS for styling, and strict TypeScript. 

## 2. Target Audience (User Personas)
* **The Market Integrator:** A relocated professional (e.g., Zurich/Geneva) needing English/local-language events to build a network.
* **The Upskiller:** IT/Data specialist pursuing certifications seeking specialized workshops and peer groups.
* **Students:** Searching for first internships or full-time roles.

## 3. Business Objectives
* **Goal 1:** Reduce time-to-find relevant events from hours to < 2 minutes.
* **Goal 2:** Establish a localized database for a specific initial launch region before global scaling.

## 4. Scope of Work (MVP)
* **In-Scope:** Web-based platform, searchable database, category filtering (AI, Data, Process, System, CS), language filtering, external RSVP linking.
* **Out-of-Scope:** In-app ticketing/payments, native iOS/Android apps, direct user-to-user messaging.

## 5. Tech Stack & Architecture (Proposed)
* **Frontend:** Next.js, Tailwind CSS
* **Backend/Database:** Supabase (PostgreSQL)
* **Data Sourcing:** Manual entry for V1, transitioning to targeted web scrapers (Python) in V2.

## 6. Functional Requirements
* **Search & Filter:** Strict categorization, geolocation, and primary language filtering.
* **Event Cards:** Display Title, Date, Location, Niche Tag, and Brief Description.
* **Data Aggregation:** Backend interface for admins to input and categorize event data.

## 7. Non-Functional Requirements
* **Usability:** Mobile-first responsive web design.
* **Performance:** Sub-second latency on search/filtering to maintain an "interactive" feel.

## 8. Core Data Model (Draft `Event` Object)
* `event_id` (UUID)
* `title` (String)
* `description` (Text)
* `date_time` (Timestamp)
* `location` (String/GeoJSON)
* `category` (Enum: AI, Data, Process, System, CS)
* `language` (String)
* `rsvp_url` (String)
