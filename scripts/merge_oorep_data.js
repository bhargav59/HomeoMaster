const fs = require('fs');
const path = require('path');

const TARGET_FILE = path.join(__dirname, '../src/data/remediesFull.json');
const SOURCE_FILE = path.join(__dirname, '../src/data/oorepRemedies.json');

// Load Data
let targetData = {};
try {
    targetData = JSON.parse(fs.readFileSync(TARGET_FILE, 'utf8'));
} catch (e) {
    console.error("Target file not found or invalid.");
    process.exit(1);
}

const sourceData = JSON.parse(fs.readFileSync(SOURCE_FILE, 'utf8'));

console.log(`Loaded ${Object.keys(targetData).length} existing remedies.`);
console.log(`Loaded ${sourceData.length} OOREP remedies.`);

// Index existing remedies for matching
const existingByAbbrev = {};
const existingByName = {};

Object.values(targetData).forEach(rem => {
    if (rem.abbrev) existingByAbbrev[rem.abbrev.toLowerCase()] = rem.id;
    if (rem.name) existingByName[rem.name.toLowerCase()] = rem.id;
});

let addedCount = 0;
let mergedCount = 0;

sourceData.forEach(oorepRem => {
    const abbrev = oorepRem.abbrev || '';
    const name = oorepRem.name || '';
    
    // Try to find match
    let matchId = existingByAbbrev[abbrev.toLowerCase()] || existingByName[name.toLowerCase()];

    // Special handling for common discrepancies (e.g. "Calc-c." vs "Calc.")
    if (!matchId && abbrev.endsWith('.')) {
         matchId = existingByAbbrev[abbrev.slice(0, -1).toLowerCase()];
    }

    if (matchId) {
        // MERGE
        const target = targetData[matchId];
        if (!target.materiaMedica) target.materiaMedica = [];
        
        // Avoid duplicate sections if run multiple times
        // We'll just overwrite/append for now, assuming source is OOREP
        // Check if we already have OOREP data
        const hasOorep = target.materiaMedica.some(m => m.source && m.source.includes('Pocket manual'));
        
        if (!hasOorep) {
             target.materiaMedica.push(...oorepRem.materiaMedica);
             mergedCount++;
        }
    } else {
        // ADD NEW
        const newId = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
        
        if (!newId) return; // Skip if name is invalid

        targetData[newId] = {
            id: newId,
            name: name,
            abbrev: abbrev,
            source: oorepRem.source, // 'OOREP Import'
            keynotes: [], // Placeholder
            essence: "", // Placeholder
            generalModalities: { agg: [], amel: [] },
            relationships: { complementary: [], antidotes: [], followsWell: [] },
            clinicalIndications: [],
            potencies: ["30C", "200C"], // Default safe assumption
            dosing: "Consult standard materia medica.",
            materiaMedica: oorepRem.materiaMedica
        };
        addedCount++;
    }
});

fs.writeFileSync(TARGET_FILE, JSON.stringify(targetData, null, 4));
console.log(`Merge Complete.`);
console.log(`Merged text into: ${mergedCount} existing remedies.`);
console.log(`Added: ${addedCount} new remedies.`);
console.log(`Total Database Size: ${Object.keys(targetData).length} remedies.`);
