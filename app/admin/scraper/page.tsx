'use client';

import { useState } from 'react';

interface ScraperSource {
  name: string;
  url: string;
  enabled: boolean;
}

export default function AdminScraper() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [mode, setMode] = useState<'preview' | 'store' | 'both'>('both');
  
  const [sources, setSources] = useState<ScraperSource[]>([
    { name: 'Eventbrite', url: 'https://www.eventbrite.com/d/switzerland--zurich/events/', enabled: true },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/events/', enabled: false },
  ]);

  const toggleSource = (index: number) => {
    setSources(prev => prev.map((source, i) => 
      i === index ? { ...source, enabled: !source.enabled } : source
    ));
  };

  const handleScrape = async () => {
    setLoading(true);
    setResults(null);

    try {
      const enabledSources = sources
        .filter(s => s.enabled)
        .map(s => ({
          name: s.name.toLowerCase(),
          base_url: s.url,
          scraper_config: {
            url: s.url,
            selectors: {},
            type: s.name === 'Eventbrite' ? 'static' : 'dynamic'
          },
          enabled: true
        }));

      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sources: enabledSources,
          mode: mode
        }),
      });

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Scraping error:', error);
      setResults({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
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
                  Admin - Event Scraper
                </p>
              </a>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <a href="/" className="text-navy-700 hover:text-navy-900 font-medium transition-colors">
                Home
              </a>
              <a href="/events" className="text-navy-700 hover:text-navy-900 font-medium transition-colors">
                Events
              </a>
              <a href="/admin/scraper" className="text-navy-900 font-bold transition-colors border-b-2 border-navy-900">
                Admin
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-navy-900 mb-6">Event Scraper Control Panel</h2>
          
          {/* Mode Selection */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-navy-800 mb-3">Scraping Mode</h3>
            <div className="flex gap-4">
              <button
                onClick={() => setMode('preview')}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  mode === 'preview'
                    ? 'bg-navy-800 text-white'
                    : 'bg-navy-50 text-navy-700 hover:bg-navy-100'
                }`}
              >
                Preview Only
              </button>
              <button
                onClick={() => setMode('store')}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  mode === 'store'
                    ? 'bg-navy-800 text-white'
                    : 'bg-navy-50 text-navy-700 hover:bg-navy-100'
                }`}
              >
                Store in Database
              </button>
              <button
                onClick={() => setMode('both')}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  mode === 'both'
                    ? 'bg-navy-800 text-white'
                    : 'bg-navy-50 text-navy-700 hover:bg-navy-100'
                }`}
              >
                Preview & Store
              </button>
            </div>
            <p className="text-sm text-navy-600 mt-2">
              {mode === 'preview' && 'Events will be scraped but not saved to the database'}
              {mode === 'store' && 'Events will be saved directly to the database without preview'}
              {mode === 'both' && 'Events will be shown in preview and saved to the database'}
            </p>
          </div>

          {/* Source Selection */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-navy-800 mb-3">Select Sources</h3>
            <div className="space-y-3">
              {sources.map((source, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border border-navy-200 rounded-lg hover:bg-navy-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={source.enabled}
                      onChange={() => toggleSource(index)}
                      className="w-5 h-5 text-navy-800 rounded focus:ring-navy-500"
                    />
                    <div>
                      <p className="font-semibold text-navy-900">{source.name}</p>
                      <p className="text-sm text-navy-600">{source.url}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    source.enabled
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {source.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Scrape Button */}
          <button
            onClick={handleScrape}
            disabled={loading || !sources.some(s => s.enabled)}
            className="w-full bg-navy-800 text-white py-4 rounded-lg font-bold text-lg hover:bg-navy-900 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                Scraping Events...
              </span>
            ) : (
              'Start Scraping'
            )}
          </button>

          {/* Results */}
          {results && (
            <div className="mt-8">
              <h3 className="text-xl font-bold text-navy-900 mb-4">Scraping Results</h3>
              
              {results.success ? (
                <div className="space-y-4">
                  {/* Summary */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800 font-semibold">
                      ✓ Successfully scraped {results.total_events} events
                    </p>
                    {results.storage && (
                      <div className="mt-2 text-sm text-green-700">
                        <p>• Stored: {results.storage.success} events</p>
                        {results.storage.failed > 0 && (
                          <p>• Failed: {results.storage.failed} events</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Source Results */}
                  <div className="space-y-2">
                    {results.results.map((result: any, index: number) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border ${
                          result.success
                            ? 'bg-green-50 border-green-200'
                            : 'bg-red-50 border-red-200'
                        }`}
                      >
                        <p className="font-semibold">
                          {result.source}: {result.event_count} events
                        </p>
                        {result.errors && result.errors.length > 0 && (
                          <ul className="mt-2 text-sm text-red-700">
                            {result.errors.map((error: string, i: number) => (
                              <li key={i}>• {error}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Storage Errors */}
                  {results.storage?.errors && results.storage.errors.length > 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="font-semibold text-yellow-800 mb-2">Storage Warnings:</p>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        {results.storage.errors.map((error: string, i: number) => (
                          <li key={i}>• {error}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Preview Events */}
                  {results.events && results.events.length > 0 && (
                    <div className="mt-6">
                      <h4 className="font-semibold text-navy-900 mb-3">Preview of Scraped Events:</h4>
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {results.events.slice(0, 10).map((event: any, index: number) => (
                          <div key={index} className="p-4 bg-navy-50 rounded-lg">
                            <p className="font-semibold text-navy-900">{event.title}</p>
                            <p className="text-sm text-navy-600 mt-1 line-clamp-2">
                              {event.description}
                            </p>
                            <div className="flex gap-4 mt-2 text-xs text-navy-600">
                              <span>📅 {new Date(event.date_time).toLocaleDateString()}</span>
                              <span>📍 {event.location}</span>
                              {event.category && <span>🏷️ {event.category}</span>}
                            </div>
                          </div>
                        ))}
                        {results.events.length > 10 && (
                          <p className="text-center text-navy-600 text-sm">
                            ... and {results.events.length - 10} more events
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 font-semibold">✗ Scraping failed</p>
                  <p className="text-sm text-red-700 mt-2">
                    {results.error || 'Unknown error occurred'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">📖 How to Use</h3>
          <ol className="space-y-2 text-blue-800">
            <li>1. Select the scraping mode (preview, store, or both)</li>
            <li>2. Enable the sources you want to scrape from</li>
            <li>3. Click "Start Scraping" to begin</li>
            <li>4. Review the results and check the database</li>
          </ol>
          <p className="mt-4 text-sm text-blue-700">
            <strong>Note:</strong> LinkedIn scraping requires authentication and may not work without proper credentials.
            Eventbrite scraping works with publicly available event listings.
          </p>
        </div>
      </main>
    </div>
  );
}

// Made with Bob