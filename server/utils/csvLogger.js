const fs = require('fs').promises;
const path = require('path');
const logger = require('./logger');

/**
 * Append data to CSV file
 * Creates file with headers if it doesn't exist
 */
async function appendToCSV(filename, data) {
  try {
    const dataDir = process.env.DATA_DIR || path.join(__dirname, '../../data');
    const filePath = path.join(dataDir, filename);

    // Ensure data directory exists
    await fs.mkdir(dataDir, { recursive: true });

    // Check if file exists
    let fileExists = false;
    try {
      await fs.access(filePath);
      fileExists = true;
    } catch (err) {
      // File doesn't exist
    }

    // Get headers from data keys
    const headers = Object.keys(data);
    
    // Create CSV row
    const values = headers.map(h => {
      const val = data[h];
      // Escape commas and quotes
      if (typeof val === 'string' && (val.includes(',') || val.includes('"'))) {
        return `"${val.replace(/"/g, '""')}"`;
      }
      return val;
    });

    const row = values.join(',');

    // Write headers if file doesn't exist
    if (!fileExists) {
      const headerRow = headers.join(',');
      await fs.writeFile(filePath, headerRow + '\n' + row + '\n');
    } else {
      await fs.appendFile(filePath, row + '\n');
    }

  } catch (error) {
    logger.error('CSV append error:', error);
    throw error;
  }
}

module.exports = { appendToCSV };
