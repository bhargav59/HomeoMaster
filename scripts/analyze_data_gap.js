const fs = require('fs');
const path = require('path');

// Load data files
const remediesFull = require('../src/data/remediesFull.json');
const oorepRemedies = require('../src/data/oorepRemedies.json');

// Get unique remedy names from OOREP
const oorepNames = new Set();
oorepRemedies.forEach(r => {
    if (r.name) oorepNames.add(r.name);
});

console.log('=== DATA ANALYSIS ===\n');
console.log(`Total entries in oorepRemedies: ${oorepRemedies.length}`);
console.log(`Unique remedy names in OOREP: ${oorepNames.size}`);
console.log(`Total remedies in remediesFull: ${Object.keys(remediesFull).length}\n`);

// Check which OOREP remedies are missing from remediesFull
const missingRemedies = [];
const foundRemedies = [];

oorepNames.forEach(name => {
    // Try to find this remedy in remediesFull by name or abbrev
    const found = Object.values(remediesFull).some(r => {
        return r.name.toLowerCase() === name.toLowerCase() || 
               (r.abbrev && r.abbrev.toLowerCase().replace('.', '') === name.toLowerCase().replace('.', ''));
    });
    
    if (!found) {
        missingRemedies.push(name);
    } else {
        foundRemedies.push(name);
    }
});

console.log(`=== MATCHING RESULTS ===\n`);
console.log(`Remedies found in remediesFull: ${foundRemedies.length}`);
console.log(`Remedies MISSING from remediesFull: ${missingRemedies.length}\n`);

if (missingRemedies.length > 0) {
    console.log(`=== MISSING REMEDIES (first 50) ===\n`);
    missingRemedies.slice(0, 50).forEach(name => {
        console.log(`- ${name}`);
    });
    
    if (missingRemedies.length > 50) {
        console.log(`\n... and ${missingRemedies.length - 50} more\n`);
    }
}

// Save full list to file
fs.writeFileSync(
    path.join(__dirname, 'missing_remedies.txt'),
    missingRemedies.join('\n'),
    'utf8'
);

console.log(`\nFull list saved to: scripts/missing_remedies.txt`);
