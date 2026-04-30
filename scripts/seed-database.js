/**
 * Seed database with sample events
 * Run with: npm run seed-db
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read .env.local file manually
const envPath = path.join(__dirname, '../.env.local');
let supabaseUrl = '';
let supabaseKey = '';

try {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const lines = envContent.split('\n');
  
  for (const line of lines) {
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
      supabaseUrl = line.split('=')[1].trim();
    }
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) {
      supabaseKey = line.split('=')[1].trim();
    }
  }
} catch (error) {
  console.error('❌ Could not read .env.local file');
  process.exit(1);
}

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const sampleEvents = [
  {
    title: 'Zurich AI & Machine Learning Meetup',
    description: 'Join us for an exciting evening of AI and Machine Learning discussions! This meetup brings together data scientists, ML engineers, and AI enthusiasts from across Zurich. We\'ll explore the latest developments in deep learning, neural networks, and natural language processing.',
    date_time: new Date('2026-05-15T18:00:00Z').toISOString(),
    location: 'ETH Zurich, Main Building, Rämistrasse 101, 8092 Zürich',
    category: 'AI',
    language: 'English',
    rsvp_url: 'https://example.com/ai-meetup'
  },
  {
    title: 'Data Science Workshop: Advanced Analytics',
    description: 'Learn advanced data analytics techniques with Python and SQL. This hands-on workshop covers data cleaning, exploratory data analysis, statistical modeling, and visualization. Perfect for data analysts and aspiring data scientists.',
    date_time: new Date('2026-05-20T14:00:00Z').toISOString(),
    location: 'Impact Hub Zurich, Viaduktstrasse 93, 8005 Zürich',
    category: 'Data',
    language: 'English',
    rsvp_url: 'https://example.com/data-workshop'
  },
  {
    title: 'Agile & Scrum Practitioners Meetup',
    description: 'Monthly gathering for Agile practitioners, Scrum Masters, and Product Owners. Share experiences, discuss challenges, and learn best practices in agile project management. Network with fellow professionals in the Zurich tech scene.',
    date_time: new Date('2026-05-22T18:30:00Z').toISOString(),
    location: 'Google Zurich, Europaallee 36, 8004 Zürich',
    category: 'Process',
    language: 'English',
    rsvp_url: 'https://example.com/agile-meetup'
  },
  {
    title: 'Cloud Infrastructure & DevOps Summit',
    description: 'Explore the latest in cloud computing, Kubernetes, Docker, and DevOps practices. Industry experts will share insights on infrastructure automation, CI/CD pipelines, and cloud-native architectures. Includes hands-on labs and networking.',
    date_time: new Date('2026-05-25T09:00:00Z').toISOString(),
    location: 'Technopark Zurich, Technoparkstrasse 1, 8005 Zürich',
    category: 'System',
    language: 'English',
    rsvp_url: 'https://example.com/cloud-summit'
  },
  {
    title: 'Blockchain & Web3 Developer Meetup',
    description: 'Dive into blockchain technology, smart contracts, and decentralized applications. Learn about Ethereum, Solidity, and the latest Web3 frameworks. Perfect for developers interested in blockchain and cryptocurrency technologies.',
    date_time: new Date('2026-05-28T19:00:00Z').toISOString(),
    location: 'Trust Square, Bahnhofstrasse 3, 8001 Zürich',
    category: 'CS',
    language: 'English',
    rsvp_url: 'https://example.com/blockchain-meetup'
  },
  {
    title: 'KI und Maschinelles Lernen für Einsteiger',
    description: 'Einführung in künstliche Intelligenz und maschinelles Lernen auf Deutsch. Wir behandeln grundlegende Konzepte, praktische Anwendungen und zeigen, wie Sie mit Python und TensorFlow starten können. Ideal für Anfänger.',
    date_time: new Date('2026-06-01T18:00:00Z').toISOString(),
    location: 'Universität Zürich, Rämistrasse 71, 8006 Zürich',
    category: 'AI',
    language: 'German',
    rsvp_url: 'https://example.com/ki-workshop'
  },
  {
    title: 'Python for Data Analysis Workshop',
    description: 'Master Python libraries for data analysis including Pandas, NumPy, and Matplotlib. This workshop covers data manipulation, statistical analysis, and creating compelling visualizations. Bring your laptop for hands-on exercises.',
    date_time: new Date('2026-06-05T13:00:00Z').toISOString(),
    location: 'Coworking Space Zurich, Hardturmstrasse 161, 8005 Zürich',
    category: 'Data',
    language: 'English',
    rsvp_url: 'https://example.com/python-workshop'
  },
  {
    title: 'Cybersecurity Best Practices for Developers',
    description: 'Learn essential cybersecurity practices for modern software development. Topics include secure coding, vulnerability assessment, encryption, authentication, and protecting against common attacks. Suitable for developers of all levels.',
    date_time: new Date('2026-06-08T17:00:00Z').toISOString(),
    location: 'Microsoft Zurich, The Circle, 8058 Zürich',
    category: 'System',
    language: 'English',
    rsvp_url: 'https://example.com/security-workshop'
  },
  {
    title: 'Product Management in Tech: From Idea to Launch',
    description: 'Comprehensive workshop on product management in technology companies. Learn about product strategy, user research, roadmap planning, agile development, and successful product launches. Network with experienced product managers.',
    date_time: new Date('2026-06-12T18:30:00Z').toISOString(),
    location: 'Swisscom Digital Lab, Pfingstweidstrasse 60, 8005 Zürich',
    category: 'Process',
    language: 'English',
    rsvp_url: 'https://example.com/product-workshop'
  },
  {
    title: 'React & Next.js: Building Modern Web Applications',
    description: 'Deep dive into React and Next.js for building fast, scalable web applications. Learn about server-side rendering, static site generation, API routes, and deployment strategies. Includes live coding sessions and Q&A.',
    date_time: new Date('2026-06-15T14:00:00Z').toISOString(),
    location: 'Digitec Galaxus, Pfingstweidstrasse 60b, 8005 Zürich',
    category: 'CS',
    language: 'English',
    rsvp_url: 'https://example.com/react-workshop'
  }
];

async function seedDatabase() {
  console.log('🌱 Seeding database with sample events...\n');

  try {
    // Check connection
    const { data: testData, error: testError } = await supabase
      .from('events')
      .select('count')
      .limit(1);

    if (testError) {
      throw new Error(`Database connection failed: ${testError.message}`);
    }

    console.log('✓ Connected to Supabase\n');

    let inserted = 0;
    let skipped = 0;
    let errors = 0;

    for (const event of sampleEvents) {
      try {
        // Check if event already exists
        const { data: existing } = await supabase
          .from('events')
          .select('event_id')
          .eq('title', event.title)
          .single();

        if (existing) {
          console.log(`⚠️  Skipped: "${event.title}" (already exists)`);
          skipped++;
          continue;
        }

        // Insert event
        const { data, error } = await supabase
          .from('events')
          .insert([event])
          .select();

        if (error) {
          throw error;
        }

        console.log(`✓ Added: "${event.title}"`);
        console.log(`  Category: ${event.category} | Language: ${event.language}`);
        inserted++;

      } catch (error) {
        console.error(`❌ Error adding "${event.title}":`, error.message);
        errors++;
      }
    }

    console.log('\n📊 Summary:');
    console.log(`  Total events: ${sampleEvents.length}`);
    console.log(`  Inserted: ${inserted}`);
    console.log(`  Skipped: ${skipped}`);
    console.log(`  Errors: ${errors}`);
    console.log('\n✨ Database seeding completed!');

  } catch (error) {
    console.error('\n❌ Seeding failed:', error.message);
    process.exit(1);
  }
}

// Run the seeder
seedDatabase();

// Made with Bob
