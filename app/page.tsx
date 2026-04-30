export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-blue-600">BOBBERS</h1>
          <p className="text-gray-600 mt-1">Find tech events in Zurich in under 2 minutes</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Discover Your Next Tech Event
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Curated IT, Data, AI, and Computer Science events for professionals and students in Zurich
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="text-center text-gray-500">
            <p className="text-lg mb-4">🚀 Project Setup Complete!</p>
            <p>Next steps:</p>
            <ul className="text-left max-w-md mx-auto mt-4 space-y-2">
              <li>✅ Next.js with TypeScript configured</li>
              <li>✅ Tailwind CSS integrated</li>
              <li>⏳ Set up Supabase database</li>
              <li>⏳ Create event listing components</li>
              <li>⏳ Add search and filter functionality</li>
            </ul>
          </div>
        </div>
      </main>

      <footer className="bg-gray-50 border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-600">
          <p>BOBBERS - Curing fragmented networking, one event at a time</p>
        </div>
      </footer>
    </div>
  );
}

// Made with Bob
