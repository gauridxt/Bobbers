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
    title: 'Some Test Event',
    description: 'h dive into React and Next.js for building fast, scalable web applications. Learn about server-side rendering, static site generation, API routes, and deployment strategies. Includes live coding sessions and Q&A.',
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
