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

// Name alias map for remedies that use different names in OOREP vs remediesFull
const NAME_ALIASES = {
    'Apis Mellifera': 'Apis Mellifica',
    'Hepar Sulphur': 'Hepar Sulphuris Calcareum',
    'Kalium Bichromicum': 'Kali Bichromicum',
    'Kalium Carbonicum': 'Kali Carbonicum',
    'Magnesium Phosphoricum': 'Magnesia Phosphorica',
    'Natrium Muriaticum': 'Natrum Muriaticum',
    'Pulsatilla Pratensis': 'Pulsatilla Nigricans'
};

// Map OOREP Chapters (uppercase usually) to Body Part IDs
const CHAPTER_TO_BODYPART_MAP = {
    'MIND': 'mind',
    'HEAD': 'head',
    'EYES': 'eyes',
    'EARS': 'ears',
    'NOSE': 'nose',
    'FACE': 'head',
    'MOUTH': 'mouth-throat',
    'THROAT': 'mouth-throat',
    'STOMACH': 'digestive',
    'ABDOMEN': 'digestive',
    'RECTUM': 'digestive',
    'STOOL': 'digestive',
    'URINARY ORGANS': 'urinary-male',
    'MALE': 'urinary-male',
    'GENITALIA': 'female',
    'FEMALE': 'female',
    'LARYNX': 'respiratory',
    'RESPIRATION': 'respiratory',
    'COUGH': 'respiratory',
    'CHEST': 'respiratory',
    'HEART': 'heart-circulatory',
    'BACK': 'back-spine',
    'EXTREMITIES': 'upper-limbs',
    'UPPER LIMBS': 'upper-limbs',
    'LOWER LIMBS': 'lower-limbs',
    'SLEEP': 'sleep-dreams',
    'DREAMS': 'sleep-dreams',
    'CHILL': 'fever-infections',
    'FEVER': 'fever-infections',
    'PERSPIRATION': 'fever-infections',
    'SKIN': 'skin',
    'GENERALITIES': 'generals',
    'GENERALS': 'generals'
};

function extractModalities(text) {
    let agg = '';
    let amel = '';
    
    // Regex to find "Worse" and "Better" clauses
    // Matches "Worse, [condition]" until semicolon or period
    // Case insensitive, handles newlines, handles *Worse*
    // (?:\*|)\s*Worse(?:\*|)\s*[:,]?\s*
    
    // Aggravation
    const aggMatch = text.match(/(?:^|\.| ;)\s*(?:\*|)(?:Worse|Aggravation|Agg\.?)(?:\*|)\s*[:,]?\s*([^.;<]+)/i);
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

// Process symptoms
const symptoms = [];
let symptomIdCounter = 1;

console.log(`Processing ${remedies.length} remedies...`);

remedies.forEach(rem => {
    if (!rem.materiaMedica || !Array.isArray(rem.materiaMedica)) return;
    
    rem.materiaMedica.forEach(entry => {
        // CRITICAL FIX: Use 'section' field which contains body part names like "Head", "Stomach"
        // NOT 'chapter' which contains the full remedy name
        const sectionKey = entry.section?.toUpperCase() || '';
        const bodyPartIds = [];
        
        // Try to map section to body part
        for (const [key, value] of Object.entries(CHAPTER_TO_BODYPART_MAP)) {
            if (sectionKey.includes(key)) {
                if (!bodyPartIds.includes(value)) {
                    bodyPartIds.push(value);
                }
            }
        }
        
        // If no mapping found, skip this entry
        if (bodyPartIds.length === 0) return;
        
        const targetBodyPartIds = bodyPartIds;
        if (targetBodyPartIds.length === 0) return;
        
        const text = entry.text || '';
        if (!text) return;
        
        const indication = text.length > 250 ? text.substring(0, 250) + "..." : text;
        
        let { agg, amel } = extractModalities(text);
        
        // Normalize remedy name - check for alias first
        let remedyName = rem.name;
        if (NAME_ALIASES[rem.name]) {
            remedyName = NAME_ALIASES[rem.name];
        }
        
        // Normalize ID to match remediesFull.json
        // FIRST: Check if we can find it by name or abbrev in existing database
        let normalizedId = remedyName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
        
        // Try to find an existing match in remediesFull to use that ID instead
        const existingId = Object.keys(remediesFull).find(key => {
            const r = remediesFull[key];
            return r.name.toLowerCase() === remedyName.toLowerCase() || 
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
                remedyName: remedyName,  // Use the aliased name
                potency: "30C or 200C", 
                dose: "3 pellets as needed", 
                indication: indication,
                agg: agg || "Not specified",
                amel: amel || "Not specified"
             });
        });
    });
});

console.log(`Generated ${symptoms.length} symptom entries.`);

// Save to file
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(symptoms, null, 2), 'utf8');
console.log(`Saved to ${OUTPUT_FILE}`);
