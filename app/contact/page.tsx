export default function Contact() {
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
              <a href="/events" className="text-navy-700 hover:text-navy-900 font-medium transition-colors">
                Events
              </a>
              <a href="/about" className="text-navy-700 hover:text-navy-900 font-medium transition-colors">
                About
              </a>
              <a href="/contact" className="text-navy-900 font-bold transition-colors border-b-2 border-navy-900">
                Contact
              </a>
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
              💬 Let's Connect
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-display font-bold text-navy-900 mb-6 leading-tight">
            Get in Touch
          </h1>
          <p className="text-xl text-navy-600 max-w-3xl mx-auto leading-relaxed">
            Have questions, suggestions, or want to collaborate? We'd love to hear from you.
          </p>
        </section>

        {/* Contact Options */}
        <section className="mb-16">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="card p-8">
              <div className="w-16 h-16 bg-navy-100 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-3xl">📧</span>
              </div>
              <h3 className="text-xl font-display font-bold text-navy-900 mb-3">
                Email Us
              </h3>
              <p className="text-navy-600 leading-relaxed mb-4">
                For general inquiries, partnerships, or feedback.
              </p>
              <a href="mailto:hello@bobbers.tech" className="text-navy-700 hover:text-navy-900 font-semibold transition-colors">
                hello@bobbers.tech
              </a>
            </div>

            <div className="card p-8">
              <div className="w-16 h-16 bg-navy-100 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-3xl">🚀</span>
              </div>
              <h3 className="text-xl font-display font-bold text-navy-900 mb-3">
                Join Our Community
              </h3>
              <p className="text-navy-600 leading-relaxed mb-4">
                Connect with us and stay updated on the latest tech events.
              </p>
              <p className="text-navy-500 font-medium">
                Coming soon!
              </p>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="mb-16">
          <div className="card p-10">
            <h2 className="text-3xl font-display font-bold text-navy-900 mb-6 text-center">
              Send Us a Message
            </h2>
            <form className="max-w-2xl mx-auto space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-navy-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-4 py-3 rounded-lg border border-navy-200 focus:border-navy-500 focus:ring-2 focus:ring-navy-200 outline-none transition-colors"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-navy-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-3 rounded-lg border border-navy-200 focus:border-navy-500 focus:ring-2 focus:ring-navy-200 outline-none transition-colors"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-semibold text-navy-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  className="w-full px-4 py-3 rounded-lg border border-navy-200 focus:border-navy-500 focus:ring-2 focus:ring-navy-200 outline-none transition-colors"
                  placeholder="What's this about?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-navy-700 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg border border-navy-200 focus:border-navy-500 focus:ring-2 focus:ring-navy-200 outline-none transition-colors resize-none"
                  placeholder="Tell us more..."
                />
              </div>

              <div className="text-center">
                <button type="submit" className="btn-primary text-base px-8 py-4">
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Additional Info */}
        <section className="text-center">
          <div className="card p-10 bg-navy-50">
            <h3 className="text-2xl font-display font-bold text-navy-900 mb-4">
              Want to List Your Event?
            </h3>
            <p className="text-navy-600 mb-6 max-w-2xl mx-auto">
              If you're organizing a tech event in Zurich and want it featured on BOBBERS,
              we'd love to hear about it!
            </p>
            <a href="mailto:events@bobbers.tech" className="btn-secondary text-base px-8 py-4 inline-block">
              Submit Your Event
            </a>
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