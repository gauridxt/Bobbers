'use client';

import { useState } from 'react';
import { EventSourceConfig, ScraperResult } from '@/lib/scraper-types';

interface ScrapeResponse {
  success: boolean;
  total_events: number;
  events: any[];
  results: {
    source: string;
    success: boolean;
    event_count: number;
    errors?: string[];
  }[];
  scraped_at: string;
}

export default function ScraperAdminPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ScrapeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [availableSources, setAvailableSources] = useState<EventSourceConfig[]>([]);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [customUrl, setCustomUrl] = useState('');
  const [customHtml, setCustomHtml] = useState('');

  // Load available sources on mount
  useState(() => {
    loadSources();
  });

  const loadSources = async () => {
    try {
      const response = await fetch('/api/scrape/sources');
      const data = await response.json();
      setAvailableSources(data.sources);
      setSelectedSources(data.sources.filter((s: EventSourceConfig) => s.enabled).map((s: EventSourceConfig) => s.name));
    } catch (err) {
      console.error('Failed to load sources:', err);
    }
  };

  const handleScrape = async () => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const sourcesToScrape = availableSources.filter(s => 
        selectedSources.includes(s.name)
      );

      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sources: sourcesToScrape,
          mode: 'full'
        }),
      });

      if (!response.ok) {
        throw new Error('Scraping failed');
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomScrape = async () => {
    if (!customUrl) {
      setError('Please provide a URL');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch('/api/scrape/custom', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: customUrl,
          html: customHtml || undefined,
          type: customHtml ? 'static' : 'dynamic'
        }),
      });

      if (!response.ok) {
        throw new Error('Custom scraping failed');
      }

      const data = await response.json();
      setResults({
        success: data.success,
        total_events: data.total_events,
        events: data.events,
        results: [{
          source: 'custom',
          success: data.success,
          event_count: data.total_events
        }],
        scraped_at: data.scraped_at
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const toggleSource = (sourceName: string) => {
    setSelectedSources(prev => 
      prev.includes(sourceName)
        ? prev.filter(s => s !== sourceName)
        : [...prev, sourceName]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-white to-cream-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-navy-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-display font-bold text-navy-800">
                Event Scraper Admin
              </h1>
              <p className="text-sm text-navy-600 mt-0.5">
                Manage web scraping for event discovery
              </p>
            </div>
            <a href="/" className="btn-secondary text-sm">
              ← Back to Home
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Source Selection */}
        <section className="card p-6 mb-6">
          <h2 className="text-2xl font-display font-bold text-navy-900 mb-4">
            Select Sources to Scrape
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {availableSources.map(source => (
              <div
                key={source.name}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedSources.includes(source.name)
                    ? 'border-navy-600 bg-navy-50'
                    : 'border-navy-200 bg-white hover:border-navy-400'
                }`}
                onClick={() => toggleSource(source.name)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-navy-900 capitalize">
                    {source.name}
                  </h3>
                  <input
                    type="checkbox"
                    checked={selectedSources.includes(source.name)}
                    onChange={() => toggleSource(source.name)}
                    className="w-5 h-5"
                  />
                </div>
                <p className="text-sm text-navy-600 mb-2">
                  {source.base_url}
                </p>
                <span className={`text-xs px-2 py-1 rounded ${
                  source.enabled 
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {source.enabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            ))}
          </div>
          <button
            onClick={handleScrape}
            disabled={loading || selectedSources.length === 0}
            className="btn-primary mt-6 w-full md:w-auto"
          >
            {loading ? 'Scraping...' : `Scrape ${selectedSources.length} Source(s)`}
          </button>
        </section>

        {/* Custom URL Scraper */}
        <section className="card p-6 mb-6">
          <h2 className="text-2xl font-display font-bold text-navy-900 mb-4">
            Custom URL Scraper
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-2">
                Event Page URL
              </label>
              <input
                type="url"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="https://example.com/events/tech-meetup"
                className="w-full px-4 py-2 border border-navy-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-2">
                HTML Content (Optional - for static scraping)
              </label>
              <textarea
                value={customHtml}
                onChange={(e) => setCustomHtml(e.target.value)}
                placeholder="Paste HTML content here for static scraping..."
                rows={6}
                className="w-full px-4 py-2 border border-navy-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent font-mono text-sm"
              />
            </div>
            <button
              onClick={handleCustomScrape}
              disabled={loading || !customUrl}
              className="btn-secondary w-full md:w-auto"
            >
              {loading ? 'Scraping...' : 'Scrape Custom URL'}
            </button>
          </div>
        </section>

        {/* Error Display */}
        {error && (
          <div className="card p-6 mb-6 bg-red-50 border-2 border-red-200">
            <h3 className="text-lg font-semibold text-red-900 mb-2">
              ❌ Error
            </h3>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Results Display */}
        {results && (
          <section className="card p-6">
            <h2 className="text-2xl font-display font-bold text-navy-900 mb-4">
              Scraping Results
            </h2>
            
            {/* Summary */}
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-navy-50 p-4 rounded-lg">
                <div className="text-3xl font-bold text-navy-900">
                  {results.total_events}
                </div>
                <div className="text-sm text-navy-600">Total Events Found</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-3xl font-bold text-green-900">
                  {results.results.filter(r => r.success).length}
                </div>
                <div className="text-sm text-green-600">Successful Sources</div>
              </div>
              <div className="bg-cream-100 p-4 rounded-lg">
                <div className="text-sm text-navy-600">Scraped At</div>
                <div className="text-sm font-mono text-navy-900">
                  {new Date(results.scraped_at).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Source Results */}
            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-semibold text-navy-900">
                Source Breakdown
              </h3>
              {results.results.map((result, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-lg border-2 ${
                    result.success
                      ? 'border-green-200 bg-green-50'
                      : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-navy-900 capitalize">
                        {result.source}
                      </h4>
                      <p className="text-sm text-navy-600">
                        {result.event_count} events found
                      </p>
                    </div>
                    <span className={`text-2xl ${
                      result.success ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {result.success ? '✓' : '✗'}
                    </span>
                  </div>
                  {result.errors && result.errors.length > 0 && (
                    <div className="mt-2 text-sm text-red-700">
                      Errors: {result.errors.join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Event List */}
            <div>
              <h3 className="text-lg font-semibold text-navy-900 mb-4">
                Scraped Events ({results.events.length})
              </h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {results.events.map((event, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-lg border border-navy-200">
                    <h4 className="font-semibold text-navy-900 mb-2">
                      {event.title}
                    </h4>
                    <p className="text-sm text-navy-600 mb-2 line-clamp-2">
                      {event.description}
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs text-navy-600">
                      <div>📅 {new Date(event.date_time).toLocaleDateString()}</div>
                      <div>📍 {event.location}</div>
                      {event.prices && event.prices.length > 0 && (
                        <div>💰 {event.prices[0].type}: {event.prices[0].currency} {event.prices[0].amount}</div>
                      )}
                      {event.event_topic && event.event_topic.length > 0 && (
                        <div>🏷️ {event.event_topic.slice(0, 3).join(', ')}</div>
                      )}
                    </div>
                    {event.presenters && event.presenters.length > 0 && (
                      <div className="mt-2 text-xs text-navy-600">
                        👤 Presenters: {event.presenters.map((p: any) => p.name).join(', ')}
                      </div>
                    )}
                    {event.companies_attending && event.companies_attending.length > 0 && (
                      <div className="mt-1 text-xs text-navy-600">
                        🏢 Companies: {event.companies_attending.join(', ')}
                      </div>
                    )}
                    <a
                      href={event.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-navy-500 hover:text-navy-700 mt-2 inline-block"
                    >
                      View Source →
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

// Made with Bob