import { Event } from '@/lib/types';

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  // Format date
  const eventDate = new Date(event.date_time);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const formattedTime = eventDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  // Category colors
  const categoryColors: Record<string, string> = {
    AI: 'bg-purple-100 text-purple-800 border-purple-200',
    Data: 'bg-blue-100 text-blue-800 border-blue-200',
    Process: 'bg-green-100 text-green-800 border-green-200',
    System: 'bg-orange-100 text-orange-800 border-orange-200',
    CS: 'bg-pink-100 text-pink-800 border-pink-200'
  };

  // Language flags
  const languageFlags: Record<string, string> = {
    English: '🇬🇧',
    German: '🇩🇪',
    French: '🇫🇷',
    Italian: '🇮🇹'
  };

  return (
    <div className="card group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Category Badge */}
      <div className="flex items-center justify-between mb-4">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${categoryColors[event.category] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
          {event.category}
        </span>
        <span className="text-2xl" title={event.language}>
          {languageFlags[event.language] || '🌐'}
        </span>
      </div>

      {/* Event Title */}
      <h3 className="text-xl font-display font-bold text-navy-900 mb-3 group-hover:text-navy-700 transition-colors line-clamp-2">
        {event.title}
      </h3>

      {/* Event Description */}
      <p className="text-navy-600 mb-4 line-clamp-3 leading-relaxed">
        {event.description}
      </p>

      {/* Event Details */}
      <div className="space-y-2 mb-4">
        {/* Date & Time */}
        <div className="flex items-start text-sm text-navy-700">
          <span className="mr-2 mt-0.5">📅</span>
          <div>
            <div className="font-semibold">{formattedDate}</div>
            <div className="text-navy-600">{formattedTime}</div>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-start text-sm text-navy-700">
          <span className="mr-2 mt-0.5">📍</span>
          <div className="line-clamp-2">{event.location}</div>
        </div>
      </div>

      {/* RSVP Button */}
      <a
        href={event.rsvp_url}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary w-full text-center text-sm group-hover:scale-105 transition-transform"
      >
        RSVP Now →
      </a>
    </div>
  );
}

// Made with Bob
