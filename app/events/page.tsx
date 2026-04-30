'use client';

import { useState, useEffect } from 'react';
import { Event, EventCategory, EventLanguage } from '@/lib/types';

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<EventCategory[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<EventLanguage[]>([]);
  const [locationFilter, setLocationFilter] = useState('');

  const categories: EventCategory[] = ['AI', 'Data', 'Process', 'System', 'CS'];
  const languages: EventLanguage[] = ['English', 'German', 'French', 'Italian'];

  // Fetch events
  useEffect(() => {
    fetchEvents();
  }, [searchQuery, selectedCategories, selectedLanguages, locationFilter]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('q', searchQuery);
      if (selectedCategories.length > 0) params.append('categories', selectedCategories.join(','));
      if (selectedLanguages.length > 0) params.append('languages', selectedLanguages.join(','));
      if (locationFilter) params.append('location', locationFilter);

      const response = await fetch(`/api/events/search?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setEvents(data.events);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (category: EventCategory) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleLanguage = (language: EventLanguage) => {
    setSelectedLanguages(prev =>
      prev.includes(language)
        ? prev.filter(l => l !== language)
        : [...prev, language]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
              <a href="/contact" className="text-navy-700 hover:text-navy-900 font-medium transition-colors">
                Contact
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-display font-bold text-navy-900 mb-4 leading-tight">
            Discover Events
          </h1>
          <p className="text-xl text-navy-600 max-w-3xl mx-auto leading-relaxed">
            Find the perfect tech event in Zurich
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          {/* Search Bar */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search events by title, description, or organizer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500"
            />
          </div>

          {/* Category Filters */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-navy-700 mb-3">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategories.includes(category)
                      ? 'bg-navy-800 text-white'
                      : 'bg-navy-50 text-navy-700 hover:bg-navy-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Language Filters */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-navy-700 mb-3">Languages</h3>
            <div className="flex flex-wrap gap-2">
              {languages.map((language) => (
                <button
                  key={language}
                  onClick={() => toggleLanguage(language)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedLanguages.includes(language)
                      ? 'bg-navy-800 text-white'
                      : 'bg-navy-50 text-navy-700 hover:bg-navy-100'
                  }`}
                >
                  {language}
                </button>
              ))}
            </div>
          </div>

          {/* Location Filter */}
          <div>
            <h3 className="text-sm font-semibold text-navy-700 mb-3">Location</h3>
            <input
              type="text"
              placeholder="Filter by location..."
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full px-4 py-2 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500"
            />
          </div>
        </div>

        {/* Events List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-navy-800"></div>
            <p className="mt-4 text-navy-600">Loading events...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
            <p className="text-xl text-navy-600">No events found matching your criteria.</p>
            <p className="text-navy-500 mt-2">Try adjusting your filters or search query.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <div
                key={event.event_id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                {event.image_url && (
                  <img
                    src={event.image_url}
                    alt={event.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-navy-100 text-navy-800 text-xs font-semibold rounded-full">
                      {event.category}
                    </span>
                    <span className="px-3 py-1 bg-cream-100 text-navy-700 text-xs font-semibold rounded-full">
                      {event.language}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-navy-900 mb-2 line-clamp-2">
                    {event.title}
                  </h3>
                  
                  <p className="text-navy-600 text-sm mb-4 line-clamp-3">
                    {event.description}
                  </p>
                  
                  <div className="space-y-2 text-sm text-navy-600 mb-4">
                    <div className="flex items-center gap-2">
                      <span>📅</span>
                      <span>{formatDate(event.date_time)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>📍</span>
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                    {event.organizer && (
                      <div className="flex items-center gap-2">
                        <span>👥</span>
                        <span className="line-clamp-1">{event.organizer}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <span>💰</span>
                      <span>
                        {event.price === 0 ? 'Free' : `${event.price} ${event.currency}`}
                      </span>
                    </div>
                  </div>
                  
                  {event.tags && event.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {event.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-navy-50 text-navy-600 text-xs rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <a
                    href={event.registration_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center bg-navy-800 text-white py-2 rounded-lg hover:bg-navy-900 transition-colors font-medium"
                  >
                    Register Now
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results Count */}
        {!loading && events.length > 0 && (
          <div className="text-center mt-8 text-navy-600">
            Showing {events.length} event{events.length !== 1 ? 's' : ''}
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
                <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
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