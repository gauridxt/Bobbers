export default function Events() {
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
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <section className="text-center">
          <div className="inline-block mb-4 px-4 py-2 bg-navy-50 rounded-full">
            <span className="text-navy-700 font-semibold text-sm">
              🎯 Coming Soon
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-display font-bold text-navy-900 mb-6 leading-tight">
            All Events
          </h1>
          <p className="text-xl text-navy-600 max-w-3xl mx-auto leading-relaxed">
            You can view all events here. This page is currently under development.
          </p>
        </section>
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