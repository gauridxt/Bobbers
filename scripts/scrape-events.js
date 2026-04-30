/**
 * Standalone script to scrape events
 * Usage: node scripts/scrape-events.js
 */

const { EventScraperOrchestrator } = require('../lib/event-scraper');
const { SCRAPER_SOURCES } = require('../lib/scraper-config');

async function main() {
  console.log('🚀 Starting event scraping...\n');

  const orchestrator = new EventScraperOrchestrator();

  // Add sources from shared configuration
  SCRAPER_SOURCES.forEach(source => {
    orchestrator.addSource(source);
    console.log(`✓ Added source: ${source.name}`);
  });

  console.log('\n📡 Scraping events...\n');

  try {
    const results = await orchestrator.scrapeAll();
    
    console.log('\n📊 Results:\n');
    
    let totalEvents = 0;
    results.forEach(result => {
      console.log(`Source: ${result.source}`);
      console.log(`  Status: ${result.success ? '✓ Success' : '✗ Failed'}`);
      console.log(`  Events: ${result.events.length}`);
      if (result.errors && result.errors.length > 0) {
        console.log(`  Errors: ${result.errors.join(', ')}`);
      }
      console.log('');
      totalEvents += result.events.length;
    });

    console.log(`\n🎉 Total events scraped: ${totalEvents}`);

    // Process events
    const processedEvents = orchestrator.processEvents(results);
    
    console.log('\n📝 Sample events:\n');
    processedEvents.slice(0, 3).forEach((event, idx) => {
      console.log(`${idx + 1}. ${event.title}`);
      console.log(`   Date: ${new Date(event.date_time).toLocaleDateString()}`);
      console.log(`   Location: ${event.location}`);
      if (event.prices && event.prices.length > 0) {
        console.log(`   Price: ${event.prices[0].currency} ${event.prices[0].amount}`);
      }
      if (event.event_topic && event.event_topic.length > 0) {
        console.log(`   Topics: ${event.event_topic.join(', ')}`);
      }
      console.log('');
    });

    // Save to file (optional)
    const fs = require('fs');
    const outputPath = './scraped-events.json';
    fs.writeFileSync(outputPath, JSON.stringify(processedEvents, null, 2));
    console.log(`\n💾 Events saved to: ${outputPath}`);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

main();

// Made with Bob
