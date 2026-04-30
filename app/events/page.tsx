'use client';

import { useState, useEffect } from 'react';
import { Event, EventCategory, EventLanguage } from '@/lib/types';
import { eventService } from '@/lib/supabase';
import EventCard from '@/components/EventCard';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<EventCategory[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<EventLanguage[]>([]);

  const categories: EventCategory[] = ['AI', 'Data', 'Process', 'System', 'CS'];
  const languages: EventLanguage[] = ['English', 'German', 'French', 'Italian'];

  // Fetch events on mount
  useEffect(() => {
    fetchEvents();
  }, []);

  // Apply filters whenever they change
  useEffect(() => {
    applyFilters();
  }, [events, searchQuery, selectedCategories, selectedLanguages]);

  async function fetchEvents() {
    try {
      setLoading(true);
      setError(null);
      const data = await eventService.getAllEvents();
      setEvents(data);
    } catch (err) {
      setError('Failed to load events. Please try again later.');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  }

  function applyFilters() {
    let filtered = [...events];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        event =>
          event.title.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query) ||
          event.location.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(event =>
        selectedCategories.includes(event.category)
      );
    }

    // Language filter
    if (selectedLanguages.length > 0) {
      filtered = filtered.filter(event =>
        selectedLanguages.includes(event.language)
      );
    }

    setFilteredEvents(filtered);
  }

  function toggleCategory(category: EventCategory) {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  }

  function toggleLanguage(language: EventLanguage) {
    setSelectedLanguages(prev =>
      prev.includes(language)
        ? prev.filter(l => l !== language)
        : [...prev, language]
    );
  }

  function clearFilters() {
    setSearchQuery('');
    setSelectedCategories([]);
    setSelectedLanguages([]);
  }

  const hasActiveFilters = searchQuery || selectedCategories.length > 0 || selectedLanguages.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-white to-cream-100">
      {/* Navigation Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-navy-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div>
              <a href="/" className="block">
                <h1 className="text-3xl font-display font-bold text-navy-800 tracking-tight">
                  BOBBERS
                </h1>
                <p className="text-sm text-navy-600 mt-0.5 font-medium">
                  Tech Events in Zurich
                </p>
              </a>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <a href="/" className="text-navy-700 hover:text-navy-900 font-medium transition-colors">
                Home
              </a>
              <a href="/events" className="text-navy-900 font-bold transition-colors border-b-2 border-navy-900">
                Events
              </a>
              <a href="/about" className="text-navy-700 hover:text-navy-900 font-medium transition-colors">
                About
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-navy-900 mb-4">
            Discover Tech Events
          </h2>
          <p className="text-xl text-navy-600 max-w-2xl mx-auto">
            Find the perfect event to expand your network and skills
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search events by title, description, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 rounded-2xl border-2 border-navy-200 focus:border-navy-500 focus:outline-none text-navy-900 placeholder-navy-400 shadow-sm"
            />
            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-2xl">
              🔍
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-6">
          {/* Category Filters */}
          <div>
            <h3 className="text-sm font-semibold text-navy-700 mb-3">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategories.includes(category)
                      ? 'bg-navy-800 text-white shadow-md'
                      : 'bg-white text-navy-700 border-2 border-navy-200 hover:border-navy-400'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Language Filters */}
          <div>
            <h3 className="text-sm font-semibold text-navy-700 mb-3">Languages</h3>
            <div className="flex flex-wrap gap-2">
              {languages.map(language => (
                <button
                  key={language}
                  onClick={() => toggleLanguage(language)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedLanguages.includes(language)
                      ? 'bg-navy-800 text-white shadow-md'
                      : 'bg-white text-navy-700 border-2 border-navy-200 hover:border-navy-400'
                  }`}
                >
                  {language}
                </button>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <div className="flex justify-center">
              <button
                onClick={clearFilters}
                className="text-navy-600 hover:text-navy-900 font-medium text-sm underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6 text-center">
          <p className="text-navy-600">
            {loading ? (
              'Loading events...'
            ) : (
              <>
                Showing <span className="font-bold text-navy-900">{filteredEvents.length}</span> of{' '}
                <span className="font-bold text-navy-900">{events.length}</span> events
              </>
            )}
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-navy-200 border-t-navy-800"></div>
            <p className="mt-4 text-navy-600">Loading events...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="card bg-red-50 border-2 border-red-200 p-8 text-center max-w-2xl mx-auto">
            <span className="text-4xl mb-4 block">⚠️</span>
            <h3 className="text-xl font-bold text-red-900 mb-2">Error Loading Events</h3>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={fetchEvents}
              className="btn-primary"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredEvents.length === 0 && (
          <div className="card p-12 text-center max-w-2xl mx-auto">
            <span className="text-6xl mb-4 block">🔍</span>
            <h3 className="text-2xl font-display font-bold text-navy-900 mb-3">
              No Events Found
            </h3>
            <p className="text-navy-600 mb-6">
              {hasActiveFilters
                ? 'Try adjusting your filters or search query'
                : 'No events available at the moment. Check back soon!'}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="btn-secondary"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Events Grid */}
        {!loading && !error && filteredEvents.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map(event => (
              <EventCard key={event.event_id} event={event} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-navy-900 text-white mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-display font-bold mb-3">BOBBERS</h3>
              <p className="text-navy-300 leading-relaxed">
                Curing fragmented networking, one event at a time.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-cream-200">Quick Links</h4>
              <ul className="space-y-2 text-navy-300">
                <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="/events" className="hover:text-white transition-colors">Events</a></li>
                <li><a href="/about" className="hover:text-white transition-colors">About</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-cream-200">Connect</h4>
              <p className="text-navy-300">
                Stay updated with the latest tech events in Zurich.
              </p>
            </div>
          </div>
          <div className="border-t border-navy-800 pt-8 text-center text-navy-400">
            <p>&copy; 2026 BOBBERS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Made with Bob
