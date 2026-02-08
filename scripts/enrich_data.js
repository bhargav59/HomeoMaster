const fs = require('fs');
const path = require('path');

const REMEDIES_FILE = path.join(__dirname, '../src/data/remediesFull.json');

// Load Data
const remedies = JSON.parse(fs.readFileSync(REMEDIES_FILE, 'utf8'));
let updatedCount = 0;

console.log(`Processing ${Object.keys(remedies).length} remedies...`);

Object.values(remedies).forEach(remedy => {
    if (!remedy.materiaMedica || remedy.materiaMedica.length === 0) return;

    let modified = false;

    // 1. Extract Essence (Introductory text)
    // Usually the entry with section matching the remedy name or "Intro" or similar
    // In our OOREP dump, checking for section == chapter roughly
    const introEntry = remedy.materiaMedica.find(m => 
        m.section === m.chapter || 
        m.section === remedy.name.toUpperCase() ||
        m.section === "Introduction"
    );

    if (introEntry && (!remedy.essence || remedy.essence.length < 50 || remedy.essence.includes(remedy.name.toUpperCase()))) {
        // Remove title line if present (e.g. "Socotrine Aloes (ALOE)")
        let lines = introEntry.text.split('\n').map(l => l.trim()).filter(l => l);
        if (lines.length > 0 && (lines[0].toUpperCase().includes('ALOE') || lines[0].length < 50)) {
            lines.shift();
        }
        const essenceText = lines.join('\n\n');
        if (essenceText.length > 10) {
             remedy.essence = essenceText.length > 500 ? essenceText.substring(0, 500) + '...' : essenceText;
             modified = true;
        }
    }

    // 2. Extract Modalities
    const modEntry = remedy.materiaMedica.find(m => m.section === 'Modalities');
    if (modEntry) {
        const text = modEntry.text;
        
        // Extract Worse
        // Handle *Worse*, Worse:, Worse; etc.
        // Make punctuation optional [:,]?
        const worseMatch = text.match(/(?:\*|)\s*Worse(?:\*|)\s*[:,]?\s*(.*?)(?:\s*(?:\*|)(?:Better|$)|\n|$)/is);
        if (worseMatch && worseMatch[1]) {
            const worseText = worseMatch[1].trim();
            // Split by semicolons or commas if possible, but keep it simple for now as strings
            // Remove trailing dot or asterisk
            const cleanWorse = worseText.replace(/[.*]+$/, '');
            remedy.generalModalities.agg = cleanWorse.split(/[;]/).map(s => s.trim()).filter(s => s.length > 2);
            modified = true;
        }

        // Extract Better
        const betterMatch = text.match(/(?:\*|)\s*Better(?:\*|)\s*[:,]?\s*(.*?)(?:$|(?:\*|)Worse|\n)/is);
        if (betterMatch && betterMatch[1]) {
            const betterText = betterMatch[1].trim();
            const cleanBetter = betterText.replace(/[.*]+$/, '');
            remedy.generalModalities.amel = cleanBetter.split(/[;]/).map(s => s.trim()).filter(s => s.length > 2);
            modified = true;
        }
    }

    // 3. Extract Relationships
    const relEntry = remedy.materiaMedica.find(m => m.section === 'Relationship');
    if (relEntry) {
        const text = relEntry.text;

        // Compare
        const compareMatch = text.match(/Compare:? (.*?)(Antidote|Complementary|$)/is);
        if (compareMatch && compareMatch[1]) {
            const compareText = compareMatch[1].replace(/\n/g, ' ').trim();
            // Extract stuff between * * or just split by semicolons
            // Let's try to extract remedy names. 
            // Often format: *Acon*; *Bell*; etc.
            const matches = compareText.match(/\*([^*]+)\*/g);
            if (matches) {
                remedy.relationships.complementary = matches.map(m => m.replace(/\*/g, '').trim());
            } else {
                 // Fallback split
                 remedy.relationships.complementary = compareText.split(/[;,]/).map(s => s.trim()).filter(s => s.length > 2 && s.length < 20);
            }
            modified = true;
        }

        // Antidotes
        const antiMatch = text.match(/Antidote:? (.*?)(Compare|Complementary|$)/is);
        if (antiMatch && antiMatch[1]) {
             const antiText = antiMatch[1].replace(/\n/g, ' ').trim();
             const matches = antiText.match(/\*([^*]+)\*/g);
             if (matches) {
                remedy.relationships.antidotes = matches.map(m => m.replace(/\*/g, '').trim());
            } else {
                 remedy.relationships.antidotes = antiText.split(/[;,]/).map(s => s.trim()).filter(s => s.length > 2 && s.length < 20);
            }
            modified = true;
        }
    }

    // 4. Extract Dose
    const doseEntry = remedy.materiaMedica.find(m => m.section === 'Dose');
    if (doseEntry && (!remedy.dosing || remedy.dosing.includes("Consult standard"))) {
        remedy.dosing = doseEntry.text.trim();
        modified = true;
    }

    if (modified) updatedCount++;
});

fs.writeFileSync(REMEDIES_FILE, JSON.stringify(remedies, null, 4));
console.log(`Enrichment Complete.`);
console.log(`Updated ${updatedCount} remedies with new data.`);
