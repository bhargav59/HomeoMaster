const fs = require('fs');
const path = require('path');

const OOREP_FILE = path.join(__dirname, '../src/data/oorepRemedies.json');
const FULL_REMEDIES_FILE = path.join(__dirname, '../src/data/remediesFull.json');
const BODY_PARTS_FILE = path.join(__dirname, '../src/data/bodyParts.json');
const OUTPUT_FILE = path.join(__dirname, '../src/data/symptomEntries.json');

// Load Data
const remedies = JSON.parse(fs.readFileSync(OOREP_FILE, 'utf8'));
const remediesFull = JSON.parse(fs.readFileSync(FULL_REMEDIES_FILE, 'utf8'));
const bodyPartsList = JSON.parse(fs.readFileSync(BODY_PARTS_FILE, 'utf8'));

// Map OOREP Chapters (uppercase usually) to Body Part IDs
const chapterMap = {
    "MIND": "mind",
    "HEAD": "head",
    "EYES": "eyes",
    "EARS": "ears",
    "NOSE": "nose",
    "FACE": "head", // Map face to head or create new? Let's map to head for now or skin? PRD says "Head & Vertigo", maybe Face goes there or separate. PRD doesn't strict Face.
    "MOUTH": "mouth-throat",
    "THROAT": "mouth-throat",
    "STOMACH": "digestive",
    "ABDOMEN": "digestive",
    "RECTUM": "digestive",
    "STOOL": "digestive",
    "URINE": "urinary-male",
    "MALE": "urinary-male",
    "FEMALE": "female",
    "RESPIRATORY": "respiratory",
    "CHEST": "respiratory",
    "HEART": "heart-circulatory",
    "BACK": "back-spine",
    "EXTREMITIES": ["upper-limbs", "lower-limbs"], // Complex, will split if possible or duplicate
    "SKIN": "skin",
    "SLEEP": "sleep-dreams",
    "FEVER": "fever-infections",
    "GENERALITIES": "generals",
    "MODALITIES": "generals" 
};

let symptomIdCounter = 1;
const symptoms = [];

// Helper to extract modalities from text
function extractModalities(text) {
    let agg = "";
    let amel = "";

    // Regex to find "Worse" and "Better" clauses
    // Matches "Worse, [condition]" until semicolon or period
    // Case insensitive, handles newlines, handles *Worse*
    // (?:\*|)\s*Worse(?:\*|)\s*[:,]?\s*
    
    // Aggravation
    const aggMatch = text.match(/(?:^|\.|;)\s*(?:\*|)(?:Worse|Aggravation|Agg\.?)(?:\*|)\s*[:,]?\s*([^.;<]+)/i);
    if (aggMatch) agg = aggMatch[1].trim();

    // Amelioration
    const amelMatch = text.match(/(?:^|\.|;)\s*(?:\*|)(?:Better|Amelioration|Amel\.?)(?:\*|)\s*[:,]?\s*([^.;<]+)/i);
    if (amelMatch) amel = amelMatch[1].trim();

    // Also look for "<" and ">" symbols which sometimes denote modalities in MM
    if (!agg && text.includes('<')) {
         const match = text.match(/<\s*([^>.;]+)/);
         if (match) agg = match[1].trim();
    }
    if (!amel && text.includes('>')) {
         const match = text.match(/>\s*([^<.;]+)/);
         if (match) amel = match[1].trim();
    }

    return { agg, amel };
}

console.log(`Processing ${remedies.length} remedies...`);

remedies.forEach(rem => {
    if (!rem.materiaMedica) return;

    rem.materiaMedica.forEach(section => {
        if (!section.section) return;

        const sectionName = section.section.toUpperCase().trim();
        
        let targetBodyPartIds = [];
        
        // Exact match
        if (chapterMap[sectionName]) {
            const mapped = chapterMap[sectionName];
            if (Array.isArray(mapped)) targetBodyPartIds.push(...mapped);
            else targetBodyPartIds.push(mapped);
        } else {
            // Partial match (e.g. "NECK AND BACK")
            // Manually check keys that are substrings of sectionName
            for (const key in chapterMap) {
                if (sectionName.includes(key)) {
                     const mapped = chapterMap[key];
                     if (Array.isArray(mapped)) targetBodyPartIds.push(...mapped);
                     else targetBodyPartIds.push(mapped);
                }
            }
        }
        
        // Deduplicate
        targetBodyPartIds = [...new Set(targetBodyPartIds)];

        if (targetBodyPartIds.length > 0) {
            let text = section.text || "";
            if (text.length < 10) return; // Skip empty/short

            // Improved text cleanup
            text = text.replace(/\\n/g, ' ').replace(/\s+/g, ' ').trim();

            const indication = text.length > 250 ? text.substring(0, 250) + "..." : text;
            
            let { agg, amel } = extractModalities(text);
            
            // Normalize ID to match remediesFull.json
            // FIRST: Check if we can find it by name or abbrev in existing database
            let normalizedId = rem.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
            
            // Try to find an existing match in remediesFull to use that ID instead
            const existingId = Object.keys(remediesFull).find(key => {
                const r = remediesFull[key];
                return r.name.toLowerCase() === rem.name.toLowerCase() || 
                       (r.abbrev && r.abbrev.toLowerCase() === rem.abbrev?.toLowerCase());
            });

            if (existingId) {
                normalizedId = existingId;
            }

            // Fallback to General Modalities from enriched data if specific ones not found
            if (!agg || agg === "Not specified") {
                const fullRemedy = remediesFull[normalizedId];
                if (fullRemedy && fullRemedy.generalModalities && fullRemedy.generalModalities.agg.length > 0) {
                    agg = fullRemedy.generalModalities.agg.join(", ");
                }
            }

            if (!amel || amel === "Not specified") {
                const fullRemedy = remediesFull[normalizedId];
                if (fullRemedy && fullRemedy.generalModalities && fullRemedy.generalModalities.amel.length > 0) {
                    amel = fullRemedy.generalModalities.amel.join(", ");
                }
            }

            // Generate entries for all mapped body parts
            targetBodyPartIds.forEach(bpId => {
                 symptoms.push({
                    id: symptomIdCounter++,
                    bodyPartId: bpId,
                    remedyId: normalizedId,
                    remedyName: rem.name,
                    potency: "30C or 200C", 
                    dose: "3 pellets as needed", 
                    indication: indication,
                    agg: agg || "Not specified",
                    amel: amel || "Not specified"
                 });
            });
        }
    });
});


console.log(`Generated ${symptoms.length} symptom entries.`);

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(symptoms, null, 2));
console.log(`Saved to ${OUTPUT_FILE}`);
