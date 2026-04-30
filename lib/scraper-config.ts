// Shared scraper configuration
import { EventSourceConfig } from './scraper-types';

export const SCRAPER_SOURCES: EventSourceConfig[] = [
  {
    name: 'meetup',
    base_url: 'https://www.meetup.com/find/?location=ch--Zurich&source=EVENTS',
    scraper_config: {
      url: 'https://www.meetup.com/find/?location=ch--Zurich&source=EVENTS',
      selectors: {
        title: '.event-title',
        description: '.event-description',
        date: '.event-date',
        location: '.event-location'
      },
      type: 'dynamic'
    },
    enabled: true
  },
  {
    name: 'eventbrite',
    base_url: 'https://www.eventbrite.com/d/switzerland--zurich/events/',
    scraper_config: {
      url: 'https://www.eventbrite.com/d/switzerland--zurich/events/',
      selectors: {
        title: '.event-title',
        description: '.event-description',
        date: '.event-date',
        location: '.event-location',
        price: '.ticket-price'
      },
      type: 'static'
    },
    enabled: true
  },
  {
    name: 'linkedin',
    base_url: 'https://www.linkedin.com/events/',
    scraper_config: {
      url: 'https://www.linkedin.com/events/',
      selectors: {
        title: '.event-card__title',
        description: '.event-card__description',
        date: '.event-card__date',
        location: '.event-card__location'
      },
      type: 'dynamic'
    },
    enabled: false // Requires authentication
  }
];

// Made with Bob