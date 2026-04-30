export default function About() {
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
              <a href="/#events" className="text-navy-700 hover:text-navy-900 font-medium transition-colors">
                Events
              </a>
              <a href="/about" className="text-navy-900 font-bold transition-colors border-b-2 border-navy-900">
                About
              </a>
              <button className="btn-primary text-sm">
                Get Started
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <div className="inline-block mb-4 px-4 py-2 bg-navy-50 rounded-full">
            <span className="text-navy-700 font-semibold text-sm">
              🚀 Born at IBM Bobathon
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-display font-bold text-navy-900 mb-6 leading-tight">
            About BOBBERS
          </h1>
          <p className="text-xl text-navy-600 max-w-3xl mx-auto leading-relaxed">
            We're a super agile group of developers who met at the IBM Bobathon,
            united by a mission to cure fragmented networking in the tech community.
          </p>
        </section>

        {/* Origin Story */}
        <section className="mb-16">
          <div className="card p-10">
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-navy-500 to-navy-700 rounded-2xl flex items-center justify-center">
                <span className="text-4xl">💡</span>
              </div>
            </div>
            <h2 className="text-3xl font-display font-bold text-navy-900 mb-6 text-center">
              Our Story
            </h2>
            <div className="prose prose-lg max-w-none text-navy-700 leading-relaxed space-y-4">
              <p>
                BOBBERS was born during the IBM Bobathon, where a group of passionate developers
                came together with a shared frustration: finding relevant tech events in Zurich
                was taking way too long.
              </p>
              <p>
                As professionals and students navigating the tech scene, we experienced firsthand
                the challenge of discovering niche IT, Data, and AI events that matched our interests.
                Hours spent scrolling through generic event platforms, missing out on valuable
                networking opportunities, and feeling disconnected from the vibrant tech community
                around us.
              </p>
              <p>
                We decided to build the solution we wished existed: a platform that could help
                anyone find highly relevant tech events in under 2 minutes.
              </p>
            </div>
          </div>
        </section>

        {/* Our Approach */}
        <section className="mb-16">
          <h2 className="text-3xl font-display font-bold text-navy-900 mb-8 text-center">
            Our Approach
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card p-8">
              <div className="w-16 h-16 bg-navy-100 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-xl font-display font-bold text-navy-900 mb-3">
                Super Agile
              </h3>
              <p className="text-navy-600 leading-relaxed">
                We move fast, iterate quickly, and ship features that matter. Our agile mindset
                from the Bobathon continues to drive how we build and improve BOBBERS.
              </p>
            </div>

            <div className="card p-8">
              <div className="w-16 h-16 bg-navy-100 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-xl font-display font-bold text-navy-900 mb-3">
                User-Focused
              </h3>
              <p className="text-navy-600 leading-relaxed">
                Every feature we build solves a real problem we've experienced ourselves.
                We're not just developers—we're users of our own platform.
              </p>
            </div>

            <div className="card p-8">
              <div className="w-16 h-16 bg-navy-100 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-3xl">🤝</span>
              </div>
              <h3 className="text-xl font-display font-bold text-navy-900 mb-3">
                Community-Driven
              </h3>
              <p className="text-navy-600 leading-relaxed">
                We believe in the power of community. BOBBERS exists to strengthen connections
                within the Zurich tech ecosystem and beyond.
              </p>
            </div>

            <div className="card p-8">
              <div className="w-16 h-16 bg-navy-100 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-3xl">🚀</span>
              </div>
              <h3 className="text-xl font-display font-bold text-navy-900 mb-3">
                Innovation First
              </h3>
              <p className="text-navy-600 leading-relaxed">
                Born from a hackathon, innovation is in our DNA. We constantly explore new
                ways to make event discovery faster, smarter, and more intuitive.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="mb-16">
          <div className="card p-10 bg-gradient-to-br from-navy-900 to-navy-800 text-white">
            <div className="text-center">
              <h2 className="text-3xl font-display font-bold mb-6">
                Our Mission
              </h2>
              <p className="text-xl text-cream-100 max-w-3xl mx-auto leading-relaxed mb-6">
                To cure "fragmented networking" by helping tech professionals and students
                find highly relevant, niche IT/Data events in under two minutes.
              </p>
              <p className="text-lg text-navy-300 max-w-2xl mx-auto leading-relaxed">
                We're building more than a platform—we're building a community where
                every connection counts and every event matters.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <div className="card p-10">
            <h2 className="text-2xl font-display font-bold text-navy-900 mb-4">
              Join Us on This Journey
            </h2>
            <p className="text-navy-600 mb-8 max-w-2xl mx-auto">
              Whether you're looking for your next networking opportunity or want to
              contribute to our mission, we'd love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/" className="btn-primary text-base px-8 py-4 inline-block">
                Explore Events
              </a>
              <button className="btn-secondary text-base px-8 py-4">
                Get in Touch
              </button>
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
                <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
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