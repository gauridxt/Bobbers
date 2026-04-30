# ⚓ BOBBERS: Localized Tech Networking, Simplified

**BOBBERS** is a niche event aggregation platform designed to bridge the gap in fragmented professional networking. We help tech professionals, expats, and students find the right rooms to be in—without the noise.

---

## 🚀 The Mission
Networking in a new city or a specialized field is often a manual, time-consuming chore. **BOBBERS** cuts the "time-to-event" from hours of manual searching across disparate platforms to under **two minutes**. 

We focus on high-signal, niche IT/Data events in specific regional hubs (starting with the DACH region), ensuring that you spend less time scrolling and more time connecting.

## 🎯 Target Audience
* **The Market Integrator:** Expats and professionals relocating to hubs like Zurich or Geneva who need to find English or local-language tech communities.
* **The Upskiller:** Specialists tracking specific certifications (Scrum, Data Science, AI) looking for peer-led workshops.
* **The Career Starter:** Students seeking their first internship or entry-level role through local networking.

## ✨ Core Features (MVP)
* **High-Signal Search:** Filter by strict categories: AI, Data, Process, System, and CS.
* **Language-First UI:** Quickly toggle between German and English-led events.
* **Location Hubs:** Focused, localized databases (starting with Switzerland/Germany).
* **Clean Event Cards:** Scannable summaries with direct links to organizer RSVP pages.
* **Responsive Design:** Optimized for the professional on the move (Desktop & Mobile Browser).

## 🛠 Tech Stack
* **Frontend:** Next.js (App Router), Tailwind CSS, Lucide React (Icons).
* **Backend:** Supabase (PostgreSQL, Auth, and Edge Functions).
* **Deployment:** Vercel.
* **Data Pipeline:** Python-based scrapers (v2) and manual admin curation (v1).

---

## 📂 Project Structure
```text
bobbers/
├── app/                # Next.js App Router (Frontend)
├── components/         # Reusable UI components (EventCards, Filters)
├── lib/                # Shared utilities and Supabase client
├── public/             # Static assets (logos, icons)
├── scripts/            # Data ingestion and scraping scripts
└── supabase/           # Database migrations and schema definitions
```

## 🛠 Getting Started

### Prerequisites
* Node.js (v18 or higher)
* A Supabase account

### Installation
1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/bobbers.git
    cd bobbers
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Set up Environment Variables:**
    Create a `.env.local` file and add your Supabase credentials:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
    ```
4.  **Run the development server:**
    ```bash
    npm run dev
    ```
**Built for the community, by the community.** *Because your next big career break shouldn't be hidden on page 10 of a search result.*
