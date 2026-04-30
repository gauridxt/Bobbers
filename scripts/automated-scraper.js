/**
 * Automated scraping script with scheduling
 * Usage: node scripts/automated-scraper.js
 * 
 * This script can be run as a cron job or scheduled task
 * Example cron: 0 */6 * * * node /path/to/scripts/automated-scraper.js
 * 
 * Note: This is a simplified version that calls the API endpoint
 */

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

// Configuration
const CONFIG = {
  apiUrl: process.env.API_URL || 'http://localhost:3000',
  maxRetries: 3,
  retryDelay: 5000,
  logToFile: true,
  logFilePath: './logs/scraper.log'
};

// Logging utility
function log(message, level = 'INFO') {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level}] ${message}`;
  console.log(logMessage);
  
  if (CONFIG.logToFile) {
    // Ensure log directory exists
    const logDir = path.dirname(CONFIG.logFilePath);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    
    // Append to log file
    fs.appendFileSync(CONFIG.logFilePath, logMessage + '\n');
  }
}

// Main scraping function
async function runAutomatedScraping() {
  log('Starting automated scraping session', 'INFO');
  log('='.repeat(60), 'INFO');
  
  const startTime = Date.now();
  
  try {
    log('⚠️  This script requires the Next.js application to be running', 'WARN');
    log('   Please ensure the server is started with: npm run dev or npm start', 'WARN');
    log('', 'INFO');
    log('Alternative: Use the admin interface at /admin/scraper', 'INFO');
    log('', 'INFO');
    
    // Check if server is running
    log('Checking if Next.js server is running...', 'INFO');
    
    const http = require('http');
    const https = require('https');
    const url = require('url');
    
    const apiUrl = `${CONFIG.apiUrl}/api/scrape`;
    const parsedUrl = url.parse(apiUrl);
    const protocol = parsedUrl.protocol === 'https:' ? https : http;
    
    // Try to connect to the server
    const checkServer = () => {
      return new Promise((resolve, reject) => {
        const req = protocol.get(apiUrl.replace('/api/scrape', '/'), (res) => {
          resolve(true);
        });
        req.on('error', (err) => {
          reject(err);
        });
        req.setTimeout(5000, () => {
          req.destroy();
          reject(new Error('Connection timeout'));
        });
      });
    };
    
    try {
      await checkServer();
      log('✅ Server is running', 'INFO');
    } catch (error) {
      log('❌ Server is not running', 'ERROR');
      log('   Please start the server with: npm run dev', 'ERROR');
      log('   Then run this script again', 'ERROR');
      process.exit(1);
    }
    
    // Define sources to scrape
    const sources = [
      {
        name: 'eventbrite',
        base_url: 'https://www.eventbrite.com/d/switzerland--zurich/events/',
        scraper_config: {
          url: 'https://www.eventbrite.com/d/switzerland--zurich/events/',
          selectors: {},
          type: 'static'
        },
        enabled: true
      }
    ];
    
    log(`Configured ${sources.length} source(s)`, 'INFO');
    log('Starting scraping process...', 'INFO');
    
    // Make API request
    const requestBody = JSON.stringify({
      sources: sources,
      mode: 'both' // Preview and store
    });
    
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
      path: '/api/scrape',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestBody)
      }
    };
    
    const makeRequest = () => {
      return new Promise((resolve, reject) => {
        const req = protocol.request(options, (res) => {
          let data = '';
          
          res.on('data', (chunk) => {
            data += chunk;
          });
          
          res.on('end', () => {
            try {
              const result = JSON.parse(data);
              resolve(result);
            } catch (error) {
              reject(new Error(`Failed to parse response: ${error.message}`));
            }
          });
        });
        
        req.on('error', (error) => {
          reject(error);
        });
        
        req.setTimeout(60000, () => {
          req.destroy();
          reject(new Error('Request timeout'));
        });
        
        req.write(requestBody);
        req.end();
      });
    };
    
    const result = await makeRequest();
    
    const duration = Date.now() - startTime;
    
    // Log summary
    log('='.repeat(60), 'INFO');
    log('Scraping session summary:', 'INFO');
    log(`  Duration: ${Math.round(duration / 1000)}s`, 'INFO');
    log(`  Success: ${result.success ? 'Yes' : 'No'}`, 'INFO');
    log(`  Total events: ${result.total_events || 0}`, 'INFO');
    
    if (result.storage) {
      log(`  Stored: ${result.storage.success || 0}`, 'INFO');
      log(`  Failed: ${result.storage.failed || 0}`, 'INFO');
    }
    
    if (result.results) {
      result.results.forEach(r => {
        log(`  Source ${r.source}: ${r.event_count} events`, 'INFO');
      });
    }
    
    if (result.storage && result.storage.errors && result.storage.errors.length > 0) {
      log(`  Errors: ${result.storage.errors.length}`, 'ERROR');
      result.storage.errors.slice(0, 5).forEach(error => {
        log(`    - ${error}`, 'ERROR');
      });
    }
    
    log('='.repeat(60), 'INFO');
    
    if (result.success) {
      log('✅ Automated scraping completed successfully', 'INFO');
      process.exit(0);
    } else {
      log('❌ Automated scraping completed with errors', 'ERROR');
      process.exit(1);
    }
    
  } catch (error) {
    log(`Scraping session failed: ${error.message}`, 'ERROR');
    log(error.stack, 'ERROR');
    process.exit(1);
  }
}

// Run the scraper
if (require.main === module) {
  runAutomatedScraping()
    .catch(error => {
      log(`💥 Fatal error: ${error.message}`, 'ERROR');
      process.exit(1);
    });
}

module.exports = { runAutomatedScraping };

// Made with Bob
