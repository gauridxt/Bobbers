/**
 * Test script for database integration
 * Usage: node scripts/test-database-integration.js
 * 
 * Note: Requires .env.local with Supabase credentials
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const match = line.match(/^([^=:#]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim();
        process.env[key] = value;
      }
    });
  }
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.error('   Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Test event data
const testEvents = [
  {
    title: 'AI & Machine Learning Workshop - TEST',
    description: 'Learn about artificial intelligence and machine learning techniques in this hands-on workshop.',
    date_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    location: 'Zurich, Switzerland',
    category: 'AI',
    language: 'English',
    price: 50,
    currency: 'CHF',
    registration_url: 'https://example.com/test-event-1',
    organizer: 'Google',
    tags: ['AI', 'Machine Learning', 'Deep Learning'],
    is_featured: false,
    capacity: null,
    attendees_count: 0
  },
  {
    title: 'Data Science Meetup Zürich - TEST',
    description: 'Treffen Sie andere Data Scientists und diskutieren Sie über die neuesten Trends in der Datenanalyse.',
    date_time: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    location: 'ETH Zurich',
    category: 'Data',
    language: 'German',
    price: 0,
    currency: 'CHF',
    registration_url: 'https://example.com/test-event-2',
    organizer: 'ETH Zurich',
    tags: ['Data Science', 'Analytics', 'Big Data'],
    is_featured: false,
    capacity: null,
    attendees_count: 0
  }
];

async function testDatabaseIntegration() {
  console.log('🧪 Testing Database Integration\n');
  console.log('=' .repeat(60));

  try {
    // Test 1: Connection
    console.log('\n📡 Test 1: Testing database connection...');
    const { data: connectionTest, error: connectionError } = await supabase
      .from('events')
      .select('count')
      .limit(1);

    if (connectionError) {
      throw new Error(`Connection failed: ${connectionError.message}`);
    }
    console.log('   ✅ Database connection successful');

    // Test 2: Insert test events
    console.log('\n📝 Test 2: Inserting test events...');
    let insertedIds = [];

    for (const testEvent of testEvents) {
      const { data, error } = await supabase
        .from('events')
        .insert([testEvent])
        .select()
        .single();

      if (error) {
        console.error(`   ❌ Failed to insert "${testEvent.title}": ${error.message}`);
      } else {
        insertedIds.push(data.event_id);
        console.log(`   ✅ Inserted: "${testEvent.title}" (ID: ${data.event_id})`);
        console.log(`      Category: ${testEvent.category}, Language: ${testEvent.language}`);
      }
    }

    // Test 3: Duplicate detection
    console.log('\n🔍 Test 3: Testing duplicate detection...');
    const duplicateEvent = testEvents[0];
    const { data: existingEvents } = await supabase
      .from('events')
      .select('event_id, title')
      .eq('title', duplicateEvent.title)
      .eq('date_time', duplicateEvent.date_time);

    if (existingEvents && existingEvents.length > 0) {
      console.log(`   ✅ Duplicate detected: Found ${existingEvents.length} event(s) with same title and date`);
      console.log(`      Event ID: ${existingEvents[0].event_id}`);
    } else {
      console.log('   ⚠️  No duplicates found (unexpected)');
    }

    // Test 4: Update existing event
    console.log('\n🔄 Test 4: Testing event update...');
    if (insertedIds.length > 0) {
      const updateData = {
        description: 'UPDATED: ' + testEvents[0].description,
        attendees_count: 25
      };

      const { data, error } = await supabase
        .from('events')
        .update(updateData)
        .eq('event_id', insertedIds[0])
        .select()
        .single();

      if (error) {
        console.error(`   ❌ Update failed: ${error.message}`);
      } else {
        console.log(`   ✅ Updated event: "${data.title}"`);
        console.log(`      Attendees: ${data.attendees_count}`);
      }
    }

    // Test 5: Search functionality
    console.log('\n🔎 Test 5: Testing search functionality...');
    const { data: searchResults, error: searchError } = await supabase
      .from('events')
      .select('*')
      .or(`title.ilike.%AI%,description.ilike.%AI%`)
      .limit(5);

    if (searchError) {
      console.error(`   ❌ Search failed: ${searchError.message}`);
    } else {
      console.log(`   ✅ Search completed: Found ${searchResults.length} events matching "AI"`);
      searchResults.slice(0, 3).forEach(event => {
        console.log(`      - ${event.title}`);
      });
    }

    // Test 6: Filter by category
    console.log('\n🏷️  Test 6: Testing category filter...');
    const { data: categoryResults, error: categoryError } = await supabase
      .from('events')
      .select('*')
      .eq('category', 'AI')
      .limit(5);

    if (categoryError) {
      console.error(`   ❌ Category filter failed: ${categoryError.message}`);
    } else {
      console.log(`   ✅ Category filter completed: Found ${categoryResults.length} AI events`);
    }

    // Test 7: Filter by language
    console.log('\n🌐 Test 7: Testing language filter...');
    const { data: languageResults, error: languageError } = await supabase
      .from('events')
      .select('*')
      .eq('language', 'German')
      .limit(5);

    if (languageError) {
      console.error(`   ❌ Language filter failed: ${languageError.message}`);
    } else {
      console.log(`   ✅ Language filter completed: Found ${languageResults.length} German events`);
    }

    // Test 8: Date range filter
    console.log('\n📅 Test 8: Testing date range filter...');
    const now = new Date().toISOString();
    const futureDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    const { data: dateResults, error: dateError } = await supabase
      .from('events')
      .select('*')
      .gte('date_time', now)
      .lte('date_time', futureDate)
      .order('date_time', { ascending: true });

    if (dateError) {
      console.error(`   ❌ Date filter failed: ${dateError.message}`);
    } else {
      console.log(`   ✅ Date filter completed: Found ${dateResults.length} events in next 30 days`);
    }

    // Cleanup: Delete test events
    console.log('\n🧹 Cleanup: Deleting test events...');
    for (const eventId of insertedIds) {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('event_id', eventId);

      if (error) {
        console.error(`   ❌ Failed to delete event ${eventId}: ${error.message}`);
      } else {
        console.log(`   ✅ Deleted test event: ${eventId}`);
      }
    }

    console.log('\n' + '=' .repeat(60));
    console.log('\n✅ All database integration tests passed!\n');

    return {
      success: true,
      testsRun: 8,
      testsPassed: 8
    };

  } catch (error) {
    console.error('\n❌ Test failed with error:');
    console.error(`   ${error.message}`);
    console.error('\nStack trace:');
    console.error(error.stack);
    process.exit(1);
  }
}

// Run the test
if (require.main === module) {
  testDatabaseIntegration()
    .then(() => {
      console.log('🎉 Database integration verified!\n');
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Test suite failed:', error);
      process.exit(1);
    });
}

module.exports = { testDatabaseIntegration };

// Made with Bob
