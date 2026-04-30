'use client';

import { useState, useEffect, FormEvent } from 'react';
import { Event, EventCategory, EventLanguage } from '@/lib/types';

interface FormData {
  title: string;
  description: string;
  date_time: string;
  location: string;
  rsvp_url: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<EventCategory[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<EventLanguage[]>([]);
  const [locationFilter, setLocationFilter] = useState('');

  // Tab state
  const [activeTab, setActiveTab] = useState<'search' | 'post'>('search');

  // Event submission form state
  const [eventForm, setEventForm] = useState<FormData>({
    title: '',
    description: '',
    date_time: '',
    location: '',
    rsvp_url: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

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

  // Validate event form
  const validateEventForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!eventForm.title.trim() || eventForm.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    } else if (eventForm.title.length > 200) {
      newErrors.title = 'Title must be less than 200 characters';
    }

    if (!eventForm.description.trim() || eventForm.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    } else if (eventForm.description.length > 2000) {
      newErrors.description = 'Description must be less than 2000 characters';
    }

    if (!eventForm.date_time) {
      newErrors.date_time = 'Date and time are required';
    } else {
      const eventDate = new Date(eventForm.date_time);
      if (eventDate < new Date()) {
        newErrors.date_time = 'Event date must be in the future';
      }
    }

    if (!eventForm.location.trim() || eventForm.location.length < 3) {
      newErrors.location = 'Location must be at least 3 characters';
    } else if (eventForm.location.length > 200) {
      newErrors.location = 'Location must be less than 200 characters';
    }

    if (!eventForm.rsvp_url || !eventForm.rsvp_url.trim()) {
      newErrors.rsvp_url = 'Event URL is required';
    } else {
      try {
        new URL(eventForm.rsvp_url);
      } catch {
        newErrors.rsvp_url = 'Please enter a valid URL';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle event form submission
  const handleEventSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateEventForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setSubmitMessage('');

    try {
      const response = await fetch('/api/events/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventForm),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitStatus('success');
        setSubmitMessage('Event submitted successfully! It will appear in the events list shortly.');
        // Reset form
        setEventForm({
          title: '',
          description: '',
          date_time: '',
          location: '',
          rsvp_url: ''
        });
        setErrors({});
        // Refresh events list
        fetchEvents();
      } else {
        setSubmitStatus('error');
        setSubmitMessage(data.error || 'Failed to submit event. Please try again.');
        if (data.errors) {
          setErrors(data.errors);
        }
      }
    } catch (error) {
      setSubmitStatus('error');
      setSubmitMessage('Network error. Please check your connection and try again.');
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle input changes
  const handleEventInputChange = (field: keyof FormData, value: string) => {
    setEventForm(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
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

        {/* Tabbed Interface Box */}
        <section className="mb-16">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Tab Header */}
            <div className="flex border-b border-navy-200" role="tablist">
              <button
                role="tab"
                aria-selected={activeTab === 'search'}
                onClick={() => setActiveTab('search')}
                className={`flex-1 px-6 py-4 text-base font-medium transition-all duration-200 ${
                  activeTab === 'search'
                    ? 'text-navy-900 font-semibold border-b-3 border-navy-800 bg-white'
                    : 'text-navy-600 font-medium border-b-3 border-transparent bg-white hover:bg-navy-50 hover:text-navy-900'
                }`}
              >
                Search Events
              </button>
              <button
                role="tab"
                aria-selected={activeTab === 'post'}
                onClick={() => setActiveTab('post')}
                className={`flex-1 px-6 py-4 text-base font-medium transition-all duration-200 ${
                  activeTab === 'post'
                    ? 'text-navy-900 font-semibold border-b-3 border-navy-800 bg-white'
                    : 'text-navy-600 font-medium border-b-3 border-transparent bg-white hover:bg-navy-50 hover:text-navy-900'
                }`}
              >
                Post Event
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-6" role="tabpanel">
              {activeTab === 'search' ? (
                /* Search and Filters Content */
                <div>
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
              ) : (
                /* Event Submission Form Content */
                <div>
                  <div className="text-center mb-8">
                    <div className="inline-block mb-4 px-4 py-2 bg-navy-50 rounded-full">
                      <span className="text-navy-700 font-semibold text-sm">
                        🎉 Submit Your Event
                      </span>
                    </div>
                    <h2 className="text-3xl font-display font-bold text-navy-900 mb-4">
                      List Your Tech Event
                    </h2>
                    <p className="text-navy-600 max-w-2xl mx-auto">
                      Organizing a tech event in Zurich? Share it with our community! Fill out the form below and your event will be published immediately.
                    </p>
                  </div>

                  {/* Success/Error Messages */}
                  {submitStatus === 'success' && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-start">
                        <span className="text-2xl mr-3">✅</span>
                        <div>
                          <h4 className="font-semibold text-green-900 mb-1">Success!</h4>
                          <p className="text-green-700">{submitMessage}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-start">
                        <span className="text-2xl mr-3">❌</span>
                        <div>
                          <h4 className="font-semibold text-red-900 mb-1">Error</h4>
                          <p className="text-red-700">{submitMessage}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleEventSubmit} className="max-w-3xl mx-auto space-y-6">
                    {/* Title */}
                    <div>
                      <label htmlFor="event-title" className="block text-sm font-semibold text-navy-700 mb-2">
                        Event Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="event-title"
                        value={eventForm.title}
                        onChange={(e) => handleEventInputChange('title', e.target.value)}
                        className={`w-full px-4 py-3 rounded-lg border ${errors.title ? 'border-red-500' : 'border-navy-200'} focus:border-navy-500 focus:ring-2 focus:ring-navy-200 outline-none transition-colors bg-white`}
                        placeholder="e.g., AI & Machine Learning Meetup"
                        disabled={isSubmitting}
                      />
                      {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                    </div>

                    {/* Description */}
                    <div>
                      <label htmlFor="event-description" className="block text-sm font-semibold text-navy-700 mb-2">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="event-description"
                        rows={6}
                        value={eventForm.description}
                        onChange={(e) => handleEventInputChange('description', e.target.value)}
                        className={`w-full px-4 py-3 rounded-lg border ${errors.description ? 'border-red-500' : 'border-navy-200'} focus:border-navy-500 focus:ring-2 focus:ring-navy-200 outline-none transition-colors resize-none bg-white`}
                        placeholder="Describe your event, what attendees will learn, and what to expect..."
                        disabled={isSubmitting}
                      />
                      {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                    </div>

                    {/* Date and Time */}
                    <div>
                      <label htmlFor="event-datetime" className="block text-sm font-semibold text-navy-700 mb-2">
                        Date & Time <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="datetime-local"
                        id="event-datetime"
                        value={eventForm.date_time}
                        onChange={(e) => handleEventInputChange('date_time', e.target.value)}
                        className={`w-full px-4 py-3 rounded-lg border ${errors.date_time ? 'border-red-500' : 'border-navy-200'} focus:border-navy-500 focus:ring-2 focus:ring-navy-200 outline-none transition-colors bg-white`}
                        disabled={isSubmitting}
                      />
                      {errors.date_time && <p className="mt-1 text-sm text-red-600">{errors.date_time}</p>}
                    </div>

                    {/* Location */}
                    <div>
                      <label htmlFor="event-location" className="block text-sm font-semibold text-navy-700 mb-2">
                        Location <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="event-location"
                        value={eventForm.location}
                        onChange={(e) => handleEventInputChange('location', e.target.value)}
                        className={`w-full px-4 py-3 rounded-lg border ${errors.location ? 'border-red-500' : 'border-navy-200'} focus:border-navy-500 focus:ring-2 focus:ring-navy-200 outline-none transition-colors bg-white`}
                        placeholder="e.g., Google Zurich, Europaallee 36, 8004 Zürich"
                        disabled={isSubmitting}
                      />
                      {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
                    </div>

                    {/* RSVP URL */}
                    <div>
                      <label htmlFor="event-url" className="block text-sm font-semibold text-navy-700 mb-2">
                        RSVP/Event URL <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="url"
                        id="event-url"
                        value={eventForm.rsvp_url}
                        onChange={(e) => handleEventInputChange('rsvp_url', e.target.value)}
                        className={`w-full px-4 py-3 rounded-lg border ${errors.rsvp_url ? 'border-red-500' : 'border-navy-200'} focus:border-navy-500 focus:ring-2 focus:ring-navy-200 outline-none transition-colors bg-white`}
                        placeholder="https://example.com/event"
                        disabled={isSubmitting}
                      />
                      {errors.rsvp_url && <p className="mt-1 text-sm text-red-600">{errors.rsvp_url}</p>}
                    </div>

                    {/* Info Note */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <span className="text-xl mr-3">ℹ️</span>
                        <div className="text-sm text-blue-800">
                          <p className="font-semibold mb-1">Auto-Detection</p>
                          <p>The event category and language will be automatically detected based on your title and description. Your event will be published immediately after submission.</p>
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="text-center pt-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`btn-primary text-base px-8 py-4 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Submitting...
                          </span>
                        ) : (
                          'Submit Event'
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </section>

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
                  </div>
                  
                  {event.rsvp_url && (
                    <a
                      href={event.rsvp_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center bg-navy-800 text-white py-2 rounded-lg hover:bg-navy-900 transition-colors font-medium"
                    >
                      View Event
                    </a>
                  )}
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