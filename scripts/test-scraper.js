/**
 * Test script to verify web scraping functionality
 * Usage: node scripts/test-scraper.js
 */

const axios = require('axios');

async function testScraper() {
  console.log('🧪 Testing Web Scraper...\n');

  try {
    // Test scraping Eventbrite
    console.log('📡 Scraping Eventbrite...');
    const eventbriteUrl = 'https://www.eventbrite.com/d/switzerland--zurich/events/';
    
    const response = await axios.get(eventbriteUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });

    console.log(`✅ Successfully fetched Eventbrite page (${response.data.length} bytes)`);
    
    // Check for structured data
    const hasStructuredData = response.data.includes('application/ld+json');
    console.log(`${hasStructuredData ? '✅' : '❌'} Structured data found: ${hasStructuredData}`);
    
    // Extract event titles
    const titlePattern = /<h[23][^>]*>(.*?)<\/h[23]>/gi;
    const titles = [];
    let match;
    while ((match = titlePattern.exec(response.data)) !== null && titles.length < 5) {
      const title = match[1].replace(/<[^>]*>/g, '').trim();
      if (title.length > 10 && title.length < 200) {
        titles.push(title);
      }
    }
    
    console.log(`\n📋 Sample event titles found:`);
    titles.forEach((title, i) => {
      console.log(`   ${i + 1}. ${title.substring(0, 80)}...`);
    });

    console.log('\n✅ Scraper test completed successfully!');
    console.log('\n💡 Next steps:');
    console.log('   1. Install dependencies: npm install');
    console.log('   2. Start dev server: npm run dev');
    console.log('   3. Visit: http://localhost:3000/admin/scraper');
    console.log('   4. Click "Start Scraping" to fetch real events');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('   - Check your internet connection');
    console.log('   - Eventbrite may be blocking automated requests');
    console.log('   - Try using a VPN or different network');
  }
}

testScraper();

// Made with Bob
