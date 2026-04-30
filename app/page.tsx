export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-white to-cream-100">
      {/* Navigation Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-navy-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-display font-bold text-navy-800 tracking-tight">
                BOBBERS
              </h1>
              <p className="text-sm text-navy-600 mt-0.5 font-medium">
                Tech Events in Zurich
              </p>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <a href="/" className="text-navy-900 font-bold transition-colors border-b-2 border-navy-900">
                Home
              </a>
              <a href="#events" className="text-navy-700 hover:text-navy-900 font-medium transition-colors">
                Events
              </a>
              <a href="/about" className="text-navy-700 hover:text-navy-900 font-medium transition-colors">
                About
              </a>
              <button className="btn-primary text-sm">
                Get Started
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="py-16 md:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block mb-4 px-4 py-2 bg-navy-50 rounded-full">
              <span className="text-navy-700 font-semibold text-sm">
                🚀 Find Your Next Opportunity
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl font-display font-bold text-navy-900 mb-6 leading-tight">
              Discover Tech Events in
              <span className="text-navy-600"> Under 2 Minutes</span>
            </h2>
            <p className="text-xl text-navy-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              Curated IT, Data, AI, and Computer Science events for professionals
              and students in Zurich. Connect, learn, and grow your network.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary text-base px-8 py-4">
                Browse Events
              </button>
              <button className="btn-secondary text-base px-8 py-4">
                Learn More
              </button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 grid md:grid-cols-3 gap-8">
          <div className="card p-8 text-center hover:scale-105 transition-transform duration-200">
            <div className="w-16 h-16 bg-navy-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">⚡</span>
            </div>
            <h3 className="text-xl font-display font-bold text-navy-900 mb-3">
              Lightning Fast
            </h3>
            <p className="text-navy-600 leading-relaxed">
              Find relevant events in under 2 minutes with our intelligent filtering system
            </p>
          </div>

          <div className="card p-8 text-center hover:scale-105 transition-transform duration-200">
            <div className="w-16 h-16 bg-navy-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🎯</span>
            </div>
            <h3 className="text-xl font-display font-bold text-navy-900 mb-3">
              Highly Curated
            </h3>
            <p className="text-navy-600 leading-relaxed">
              Only the most relevant niche IT and Data events tailored for you
            </p>
          </div>

          <div className="card p-8 text-center hover:scale-105 transition-transform duration-200">
            <div className="w-16 h-16 bg-navy-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🤝</span>
            </div>
            <h3 className="text-xl font-display font-bold text-navy-900 mb-3">
              Network Better
            </h3>
            <p className="text-navy-600 leading-relaxed">
              Connect with like-minded professionals and expand your network
            </p>
          </div>
        </section>

        {/* Status Section */}
        <section className="py-16">
          <div className="card p-10 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-navy-500 to-navy-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🚀</span>
              </div>
              <h3 className="text-2xl font-display font-bold text-navy-900 mb-4">
                Project Setup Complete!
              </h3>
              <p className="text-navy-600 mb-8">
                Your platform is ready. Here's what we've accomplished:
              </p>
              <div className="grid sm:grid-cols-2 gap-4 text-left max-w-xl mx-auto">
                <div className="flex items-start space-x-3 bg-navy-50 p-4 rounded-lg">
                  <span className="text-green-600 font-bold text-lg">✓</span>
                  <span className="text-navy-700 font-medium">Next.js with TypeScript</span>
                </div>
                <div className="flex items-start space-x-3 bg-navy-50 p-4 rounded-lg">
                  <span className="text-green-600 font-bold text-lg">✓</span>
                  <span className="text-navy-700 font-medium">Tailwind CSS integrated</span>
                </div>
                <div className="flex items-start space-x-3 bg-cream-100 p-4 rounded-lg">
                  <span className="text-navy-400 font-bold text-lg">○</span>
                  <span className="text-navy-600">Supabase database</span>
                </div>
                <div className="flex items-start space-x-3 bg-cream-100 p-4 rounded-lg">
                  <span className="text-navy-400 font-bold text-lg">○</span>
                  <span className="text-navy-600">Event listing components</span>
                </div>
                <div className="flex items-start space-x-3 bg-cream-100 p-4 rounded-lg">
                  <span className="text-navy-400 font-bold text-lg">○</span>
                  <span className="text-navy-600">Search functionality</span>
                </div>
                <div className="flex items-start space-x-3 bg-cream-100 p-4 rounded-lg">
                  <span className="text-navy-400 font-bold text-lg">○</span>
                  <span className="text-navy-600">Filter system</span>
                </div>
              </div>
            </div>
          </div>
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
                <li><a href="#events" className="hover:text-white transition-colors">Events</a></li>
                <li><a href="/about" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
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
