// Build script to bundle the brands into the background script
const fs = require('fs');
const path = require('path');

// Read the brands file
const brandsContent = fs.readFileSync(path.join(__dirname, 'brands.js'), 'utf8');

// Extract the BRANDS array
const brandsMatch = brandsContent.match(/export const BRANDS = (\[[\s\S]*?\]);/);
if (!brandsMatch) {
  console.error('Could not find BRANDS array in brands.js');
  process.exit(1);
}

const brandsArray = brandsMatch[1];

// Read the background script
let backgroundContent = fs.readFileSync(path.join(__dirname, 'background.js'), 'utf8');

// Replace the dynamic import with the actual brands array
backgroundContent = backgroundContent.replace(
  '// @ts-ignore\n  BRANDS = BRANDS_IMPORT;',
  `// @ts-ignore\n  BRANDS = ${brandsArray};`
);

// Write the updated background script
fs.writeFileSync(path.join(__dirname, 'background.bundled.js'), backgroundContent);

console.log('Build complete. Use background.bundled.js in your manifest.');
