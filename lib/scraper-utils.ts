// Web scraping utilities for extracting event information

import { ScrapedEventData, PriceInfo, ContactInfo, Presenter } from './scraper-types';

/**
 * Extract price information from text
 * Handles various formats: CHF 50, $100, €75, Free, etc.
 */
export function extractPrices(text: string): PriceInfo[] {
  const prices: PriceInfo[] = [];
  
  // Check for free events
  if (/\b(free|kostenlos|gratuit|gratis)\b/i.test(text)) {
    prices.push({
      type: 'Free',
      amount: 0,
      currency: 'CHF',
      description: 'Free admission'
    });
    return prices;
  }

  // Match currency patterns: CHF 50, $100, €75, 50 CHF, etc.
  const currencyPatterns = [
    /CHF\s*(\d+(?:\.\d{2})?)/gi,
    /(\d+(?:\.\d{2})?)\s*CHF/gi,
    /\$\s*(\d+(?:\.\d{2})?)/gi,
    /€\s*(\d+(?:\.\d{2})?)/gi,
    /(\d+(?:\.\d{2})?)\s*EUR/gi,
  ];

  const priceTypes = ['Early Bird', 'Regular', 'Student', 'VIP', 'Member', 'Non-Member'];
  
  currencyPatterns.forEach((pattern, index) => {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      const amount = parseFloat(match[1]);
      let currency = 'CHF';
      
      if (index === 2) currency = 'USD';
      else if (index === 3 || index === 4) currency = 'EUR';
      
      // Try to determine price type from context
      let type = 'Regular';
      const contextBefore = text.substring(Math.max(0, match.index! - 50), match.index!).toLowerCase();
      
      for (const priceType of priceTypes) {
        if (contextBefore.includes(priceType.toLowerCase())) {
          type = priceType;
          break;
        }
      }
      
      prices.push({
        type,
        amount,
        currency,
        description: match[0]
      });
    }
  });

  return prices;
}

/**
 * Extract contact information from text
 */
export function extractContactInfo(text: string): ContactInfo {
  const contact: ContactInfo = {};

  // Extract email
  const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
  if (emailMatch) {
    contact.email = emailMatch[0];
  }

  // Extract phone numbers (Swiss format and international)
  const phonePatterns = [
    /\+41\s*\d{2}\s*\d{3}\s*\d{2}\s*\d{2}/,
    /0\d{2}\s*\d{3}\s*\d{2}\s*\d{2}/,
    /\+\d{1,3}\s*\d{1,4}\s*\d{1,4}\s*\d{1,4}/
  ];
  
  for (const pattern of phonePatterns) {
    const phoneMatch = text.match(pattern);
    if (phoneMatch) {
      contact.phone = phoneMatch[0].replace(/\s+/g, ' ').trim();
      break;
    }
  }

  // Extract website URLs
  const urlMatch = text.match(/https?:\/\/[^\s<>"]+/);
  if (urlMatch) {
    contact.website = urlMatch[0];
  }

  // Extract social media
  const linkedinMatch = text.match(/linkedin\.com\/(?:company|in)\/[\w-]+/);
  const twitterMatch = text.match(/twitter\.com\/[\w]+/);
  const facebookMatch = text.match(/facebook\.com\/[\w.]+/);

  if (linkedinMatch || twitterMatch || facebookMatch) {
    contact.social_media = {};
    if (linkedinMatch) contact.social_media.linkedin = `https://${linkedinMatch[0]}`;
    if (twitterMatch) contact.social_media.twitter = `https://${twitterMatch[0]}`;
    if (facebookMatch) contact.social_media.facebook = `https://${facebookMatch[0]}`;
  }

  return contact;
}

/**
 * Extract presenter/speaker information
 */
export function extractPresenters(text: string): Presenter[] {
  const presenters: Presenter[] = [];
  
  // Common patterns for speaker sections
  const speakerPatterns = [
    /(?:speaker|presenter|host|moderator)s?:?\s*([^.!?\n]+)/gi,
    /(?:with|featuring|by)\s+([A-Z][a-z]+\s+[A-Z][a-z]+)/g,
  ];

  const foundNames = new Set<string>();

  speakerPatterns.forEach(pattern => {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      const nameText = match[1];
      // Extract names (capitalized words)
      const names = nameText.match(/[A-Z][a-z]+\s+[A-Z][a-z]+/g);
      
      if (names) {
        names.forEach(name => {
          if (!foundNames.has(name)) {
            foundNames.add(name);
            
            // Try to extract title/company from context
            const contextAfter = text.substring(
              match.index! + match[0].length,
              Math.min(text.length, match.index! + match[0].length + 100)
            );
            
            const titleMatch = contextAfter.match(/,\s*([^,\n]+?)(?:,|\sat\s)/);
            const companyMatch = contextAfter.match(/(?:at|from)\s+([^,.\n]+)/);
            
            presenters.push({
              name,
              title: titleMatch ? titleMatch[1].trim() : undefined,
              company: companyMatch ? companyMatch[1].trim() : undefined
            });
          }
        });
      }
    }
  });

  return presenters;
}

/**
 * Extract company names from text
 */
export function extractCompanies(text: string): string[] {
  const companies = new Set<string>();
  
  // Common patterns for company mentions
  const companyPatterns = [
    /(?:sponsored by|presented by|hosted by|in partnership with)\s+([A-Z][A-Za-z0-9\s&]+?)(?:\.|,|\n|$)/gi,
    /(?:at|from)\s+([A-Z][A-Za-z0-9\s&]+?)(?:\.|,|\n|will|is)/g,
  ];

  companyPatterns.forEach(pattern => {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      const company = match[1].trim();
      // Filter out common false positives
      if (company.length > 2 && company.length < 50 && 
          !/^(the|and|or|with|will|is|are)$/i.test(company)) {
        companies.add(company);
      }
    }
  });

  return Array.from(companies);
}

/**
 * Extract event topics/tags from text
 */
export function extractTopics(text: string): string[] {
  const topics = new Set<string>();
  
  // Tech-related keywords
  const techKeywords = [
    'AI', 'Machine Learning', 'Deep Learning', 'Data Science', 'Big Data',
    'Cloud Computing', 'DevOps', 'Blockchain', 'Cryptocurrency', 'IoT',
    'Cybersecurity', 'Web Development', 'Mobile Development', 'API',
    'Microservices', 'Kubernetes', 'Docker', 'Python', 'JavaScript',
    'TypeScript', 'React', 'Node.js', 'Database', 'SQL', 'NoSQL',
    'Analytics', 'Business Intelligence', 'ETL', 'Data Engineering',
    'Software Architecture', 'Agile', 'Scrum', 'Product Management',
    'UX', 'UI', 'Design', 'Networking', 'System Administration'
  ];

  const lowerText = text.toLowerCase();
  
  techKeywords.forEach(keyword => {
    const pattern = new RegExp(`\\b${keyword.toLowerCase()}\\b`, 'i');
    if (pattern.test(lowerText)) {
      topics.add(keyword);
    }
  });

  return Array.from(topics);
}

/**
 * Categorize event based on content
 */
export function categorizeEvent(data: ScrapedEventData): 'AI' | 'Data' | 'Process' | 'System' | 'CS' {
  const text = `${data.title} ${data.description}`.toLowerCase();
  
  // AI category
  if (/\b(ai|artificial intelligence|machine learning|deep learning|neural network|nlp|computer vision)\b/i.test(text)) {
    return 'AI';
  }
  
  // Data category
  if (/\b(data science|big data|analytics|data engineering|etl|business intelligence|data warehouse)\b/i.test(text)) {
    return 'Data';
  }
  
  // Process category
  if (/\b(agile|scrum|devops|project management|product management|lean|kanban)\b/i.test(text)) {
    return 'Process';
  }
  
  // System category
  if (/\b(cloud|infrastructure|networking|system admin|devops|kubernetes|docker|security|cybersecurity)\b/i.test(text)) {
    return 'System';
  }
  
  // Default to CS
  return 'CS';
}

/**
 * Detect language of event
 */
export function detectLanguage(text: string): 'English' | 'German' | 'French' | 'Italian' {
  const lowerText = text.toLowerCase();
  
  // German indicators
  const germanWords = ['und', 'der', 'die', 'das', 'mit', 'für', 'von', 'zu', 'im', 'am'];
  const germanCount = germanWords.filter(word => 
    new RegExp(`\\b${word}\\b`, 'i').test(lowerText)
  ).length;
  
  // French indicators
  const frenchWords = ['et', 'le', 'la', 'les', 'de', 'du', 'pour', 'avec', 'dans', 'sur'];
  const frenchCount = frenchWords.filter(word => 
    new RegExp(`\\b${word}\\b`, 'i').test(lowerText)
  ).length;
  
  // Italian indicators
  const italianWords = ['e', 'il', 'la', 'di', 'per', 'con', 'nel', 'della', 'degli'];
  const italianCount = italianWords.filter(word => 
    new RegExp(`\\b${word}\\b`, 'i').test(lowerText)
  ).length;
  
  if (germanCount > frenchCount && germanCount > italianCount && germanCount >= 2) {
    return 'German';
  }
  if (frenchCount > germanCount && frenchCount > italianCount && frenchCount >= 2) {
    return 'French';
  }
  if (italianCount > germanCount && italianCount > frenchCount && italianCount >= 2) {
    return 'Italian';
  }
  
  return 'English';
}

/**
 * Clean and normalize text
 */
export function cleanText(text: string): string {
  return text
    .replace(/\s+/g, ' ')
    .replace(/\n+/g, '\n')
    .trim();
}

/**
 * Parse date from various formats
 */
export function parseEventDate(dateStr: string): string | null {
  try {
    // Try ISO format first
    const isoDate = new Date(dateStr);
    if (!isNaN(isoDate.getTime())) {
      return isoDate.toISOString();
    }

    // Common European formats
    const formats = [
      /(\d{1,2})\.(\d{1,2})\.(\d{4})/,  // DD.MM.YYYY
      /(\d{1,2})\/(\d{1,2})\/(\d{4})/,  // DD/MM/YYYY
      /(\d{4})-(\d{1,2})-(\d{1,2})/,    // YYYY-MM-DD
    ];

    for (const format of formats) {
      const match = dateStr.match(format);
      if (match) {
        let year, month, day;
        if (format === formats[2]) {
          [, year, month, day] = match;
        } else {
          [, day, month, year] = match;
        }
        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        if (!isNaN(date.getTime())) {
          return date.toISOString();
        }
      }
    }

    return null;
  } catch (error) {
    return null;
  }
}

// Made with Bob