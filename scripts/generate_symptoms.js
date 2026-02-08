const fs = require('fs');
const path = require('path');

const OOREP_FILE = path.join(__dirname, '../src/data/oorepRemedies.json');
const BODY_PARTS_FILE = path.join(__dirname, '../src/data/bodyParts.json');
const OUTPUT_FILE = path.join(__dirname, '../src/data/symptomEntries.json');

// Load Data
const remedies = JSON.parse(fs.readFileSync(OOREP_FILE, 'utf8'));
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

    // Simple heuristic: look for "Worse" and "Better"
    const worseMatch = text.match(/Worse\s*([^\.]+)/i); // Capture until period
    if (worseMatch) agg = "Worse " + worseMatch[1].trim();

    const betterMatch = text.match(/Better\s*([^\.]+)/i);
    if (betterMatch) amel = "Better " + betterMatch[1].trim();

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
            
            const { agg, amel } = extractModalities(text);
            
            // Normalize ID to match remediesFull.json (from merge_oorep_data.js logic)
            // Logic: name -> lowercase -> replace non-alnum with hyphen -> trim hyphens
            // BUT we should ideally look it up if possible. For now, regenerating it consistently is safest.
            const normalizedId = rem.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

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
