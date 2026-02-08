const fs = require('fs');
const path = require('path');

const remediesPath = path.join(__dirname, '../src/data/remediesFull.json');
let existingData = {};

try {
    existingData = JSON.parse(fs.readFileSync(remediesPath, 'utf8'));
} catch (e) {
    console.log("No existing data found or error reading, starting fresh/merging.");
}

// Collection of authentic remedies from standard Materia Medica (Kent, Boericke, Allen)
const authenticRemedies = {
    "aurum-met": {
        "id": "aurum-met",
        "name": "Aurum Metallicum",
        "abbrev": "Aur.",
        "source": "Gold",
        "keynotes": ["Deep depression", "Suicidal ideation", "Bone pains at night", "Heart conditions"],
        "essence": "Profound syphilitic remedy. Loathing of life, self-condemnation, and vascular congestion.",
        "generalModalities": {
            "agg": ["Night", "Winter", "Mental exertion", "Depression"],
            "amel": ["Cool open air", "Walking", "Music"]
        },
        "relationships": {
            "complementary": ["Syph."],
            "antidotes": ["Bell.", "Chin.", "Merc."],
            "followsWell": ["Syph.", "Lyc."]
        },
        "clinicalIndications": ["Depression", "Hypertension", "Bone necrosis", "Angina pectoris"],
        "potencies": ["30C", "200C", "1M"],
        "dosing": "200C for deep emotional states. Monitor carefully."
    },
    "baryta-carb": {
        "id": "baryta-carb",
        "name": "Baryta Carbonica",
        "abbrev": "Bar-c.",
        "source": "Barium Carbonate",
        "keynotes": ["Delayed development (childish)", "Swollen tonsils", "Shyness/Bashful", "Premature senility"],
        "essence": "Arrested development - physical, mental, or emotional. Dependency and lack of confidence.",
        "generalModalities": {
            "agg": ["Cold", "Dampness", "Thinking of symptoms", "Company"],
            "amel": ["Walking in open air", "Warmth"]
        },
        "relationships": {
            "complementary": ["Dulc.", "Sil.", "Psor."],
            "antidotes": ["Ant-t.", "Bell.", "Camph."],
            "followsWell": ["Ant-t.", "Calc.", "Lyc.", "Phos."]
        },
        "clinicalIndications": ["Tonsillitis", "Developmental delay", "Dementia", "Glandular swellings"],
        "potencies": ["6C", "30C", "200C"],
        "dosing": "30C for recurrent tonsillitis or developmental support."
    },
    "causticum": {
        "id": "causticum",
        "name": "Causticum",
        "abbrev": "Caust.",
        "source": "Potassium Hydrate (Hahnemann's unique preparation)",
        "keynotes": ["Sympathy for others", "Injustice intolerance", "Paralysis/Weakness", "Urinary retention/incontinence"],
        "essence": "Gradual paralysis and stiffness. Deeply sympathetic and sensitive to social injustice.",
        "generalModalities": {
            "agg": ["Dry cold winds", "Clear fine weather", "3-4 AM", "Coffee"],
            "amel": ["Damp wet weather", "Warmth of bed", "Gentle motion"]
        },
        "relationships": {
            "complementary": ["Carb-v.", "Petr."],
            "antidotes": ["Asafl.", "Coff.", "Coloc.", "Nux-v."],
            "followsWell": ["Carb-v.", "Kali-i.", "Lach.", "Sep."]
        },
        "clinicalIndications": ["Incontinence", "Bell's Palsy", "Burns", "Warts", "Rheumatism"],
        "potencies": ["30C", "200C"],
        "dosing": "30C for paralysis or urinary issues. 200C for chronic ailments."
    },
    "staphysagria": {
        "id": "staphysagria",
        "name": "Staphysagria",
        "abbrev": "Staph.",
        "source": "Stavesacre",
        "keynotes": ["Suppressed anger/indignation", "Honeymoon cystitis", "Styes", "Sensitive to huge insults"],
        "essence": "Effects of suppressed anger and humiliation. Trembling from emotions. Cuts/surgical wounds.",
        "generalModalities": {
            "agg": ["Anger/Indignation", "Touch", "Sexual excesses", "Tobacco"],
            "amel": ["Warmth", "Rest", "Breakfast"]
        },
        "relationships": {
            "complementary": ["Caust.", "Coloc."],
            "antidotes": ["Camph."],
            "followsWell": ["Caust.", "Coloc.", "Ign.", "Lyc."]
        },
        "clinicalIndications": ["Cystitis", "Styes", "Surgical wounds", "PTSD", "Headache"],
        "potencies": ["30C", "200C", "1M"],
        "dosing": "200C for ailments from suppressed anger. 30C for post-surgical pain."
    },
    "ferrum-phos": {
        "id": "ferrum-phos",
        "name": "Ferrum Phosphoricum",
        "abbrev": "Ferr-p.",
        "source": "Phosphate of Iron",
        "keynotes": ["First stage of inflammation", "High fever with few other symptoms", "Rosy cheeks", "Right-sided"],
        "essence": "The first stage of all inflammatory conditions before exudation sets in. Oxygenation issues.",
        "generalModalities": {
            "agg": ["Night (4-6 AM)", "Touch", "Motion", "Noise"],
            "amel": ["Cold applications", "Lying down"]
        },
        "relationships": {
            "complementary": ["Kali-m."],
            "antidotes": ["Ars.", "Chin."],
            "followsWell": ["Kali-m.", "Kali-s.", "Sil."]
        },
        "clinicalIndications": ["Fever", "Earache", "Bronchitis", "Anemia", "Nosebleeds"],
        "potencies": ["6X", "12X", "30C", "200C"],
        "dosing": "6X or 12X frequently (every 30 mins) for acute fever."
    },
    "magnesia-phos": {
        "id": "magnesia-phos",
        "name": "Magnesia Phosphorica",
        "abbrev": "Mag-p.",
        "source": "Phosphate of Magnesia",
        "keynotes": ["Cramping pains", "Better with heat and pressure", "Neuralgia", "Writer's cramp"],
        "essence": "The great anti-spasmodic remedy. Neuralgic pains relieved by warmth and pressure.",
        "generalModalities": {
            "agg": ["Cold air/water", "Touch", "Night", "Right side"],
            "amel": ["Heat", "Pressure", "Bending double"]
        },
        "relationships": {
            "complementary": ["Cham.", "Coloc."],
            "antidotes": ["Bell.", "Gels.", "Lach."],
            "followsWell": ["Calc.", "Lyc.", "Sep."]
        },
        "clinicalIndications": ["Menstrual cramps", "Colic", "Sciatica", "Toothache", "Neuralgia"],
        "potencies": ["6X", "12X", "30C", "200C"],
        "dosing": "6X in hot water, sipped frequently for cramps/colic (The 'Homeopathic Aspirin')."
    },
    // DR. RECKEWEG R-SERIES COMBINATIONS (Representative Sample)
    "reckeweg-r1": {
        "id": "reckeweg-r1",
        "name": "R1 - Inflammation Drops",
        "abbrev": "R1",
        "source": "Dr. Reckeweg Patent",
        "keynotes": ["Acute inflammation", "High fever", "Infections", "Throat pain"],
        "essence": "Combination for local inflammations, acute and chronic, of catarrhal and purulent nature.",
        "generalModalities": {
            "agg": ["Infection", "Cold", "Motion"],
            "amel": ["Rest", "Antibosis"]
        },
        "relationships": {
            "complementary": ["R6", "R89"],
            "antidotes": [],
            "followsWell": []
        },
        "clinicalIndications": ["Tonsillitis", "Otitis Media", "Conjunctivitis", "Meningitis support", "Dental infection"],
        "potencies": ["Drops"],
        "dosing": "10-15 drops in water every 1-2 hours in acute fever. 3 times daily for chronic."
    },
    "reckeweg-r2": {
        "id": "reckeweg-r2",
        "name": "R2 - Gold Drops (Heart)",
        "abbrev": "R2",
        "source": "Dr. Reckeweg Patent",
        "keynotes": ["Heart palpitations", "Arrhythmia", "Angina pectoris", "Nervous heart"],
        "essence": "Myocardial weakness, insufficiency, dilatation, and nervous heart disorders.",
        "generalModalities": {
            "agg": ["Exertion", "Anxiety", "Lying on left side"],
            "amel": ["Rest", "Fresh air"]
        },
        "relationships": {
            "complementary": ["R3", "R22"],
            "antidotes": [],
            "followsWell": []
        },
        "clinicalIndications": ["Cardiac insufficiency", "Angina", "Palpitations", "Coronary artery disease"],
        "potencies": ["Drops"],
        "dosing": "10-15 drops in water 3 times daily. Consult physician."
    },
    "reckeweg-r3": {
        "id": "reckeweg-r3",
        "name": "R3 - Heart Drops (Insufficiency)",
        "abbrev": "R3",
        "source": "Dr. Reckeweg Patent",
        "keynotes": ["Heart failure", "Endocarditis", "Valvular disease"],
        "essence": "Insufficiency of the heart muscles, endocarditis, and valvular affections.",
        "generalModalities": {
            "agg": ["Exertion"],
            "amel": ["Rest"]
        },
        "relationships": {
            "complementary": ["R2"],
            "antidotes": [],
            "followsWell": []
        },
        "clinicalIndications": ["Cardiac weakness", "Post-infectious heart issues"],
        "potencies": ["Drops"],
        "dosing": "10-15 drops 3 times daily."
    },
    "reckeweg-r4": {
        "id": "reckeweg-r4",
        "name": "R4 - Diarrhea Drops",
        "abbrev": "R4",
        "source": "Dr. Reckeweg Patent",
        "keynotes": ["Acute Gastroenteritis", "Diarrhea", "Vomiting", "Summer complaint"],
        "essence": "For acute and chronic gastroenteritis, diarrhea, and intestinal catarrh.",
        "generalModalities": {
            "agg": ["Eating", "Hot weather"],
            "amel": ["Warmth", "Empty movements"]
        },
        "relationships": {
            "complementary": ["R5"],
            "antidotes": [],
            "followsWell": []
        },
        "clinicalIndications": ["Diarrhea", "Colitis", "Food poisoning"],
        "potencies": ["Drops"],
        "dosing": "10-15 drops every 1-2 hours until improvement."
    },
    "reckeweg-r5": {
        "id": "reckeweg-r5",
        "name": "R5 - Stomach Drops",
        "abbrev": "R5",
        "source": "Dr. Reckeweg Patent",
        "keynotes": ["Gastritis", "Heartburn", "Ulcers", "Bloating"],
        "essence": "Gastritis, acute and chronic, heartburn, bad taste in mouth, frequent belching.",
        "generalModalities": {
            "agg": ["Acidic food", "Alcohol", "Stress"],
            "amel": ["Simple food"]
        },
        "relationships": {
            "complementary": ["R7"],
            "antidotes": [],
            "followsWell": []
        },
        "clinicalIndications": ["Gastritis", "Ulcers", "GERD", "Dyspepsia"],
        "potencies": ["Drops"],
        "dosing": "10-15 drops before meals 3 times daily."
    },
    // MORE POLYCHRESTS
    "spongia": {
        "id": "spongia",
        "name": "Spongia Tosta",
        "abbrev": "Spong.",
        "source": "Roasted Sponge",
        "keynotes": ["Dry, barking cough (seal bark)", "Croup", "Awakens with suffocation", "Heart palpitations"],
        "essence": "Dryness of mucous membranes, especially respiratory. Cough sounds like a saw driven through a pine board.",
        "generalModalities": {
            "agg": ["Before midnight", "Lying down", "Cold drinks", "Dry cold wind"],
            "amel": ["Warm food/drink", "Sitting up", "Looking forward"]
        },
        "relationships": {
            "complementary": ["Acon.", "Hep."],
            "antidotes": ["Camph.", "Kali-i."],
            "followsWell": ["Brom.", "Hep.", "Lach."]
        },
        "clinicalIndications": ["Croup", "Asthma", "Goiter", "Heart valve disorders"],
        "potencies": ["30C", "200C"],
        "dosing": "30C every 30 mins for croup (Acon -> Spong -> Hep sequence)."
    },
    "drosera": {
        "id": "drosera",
        "name": "Drosera Rotundifolia",
        "abbrev": "Dros.",
        "source": "Sundew",
        "keynotes": ["Violent paroxysmal cough", "Whooping cough", "Holding chest when coughing", "Worse lying down"],
        "essence": "Spasmodic coughs that end in retching or vomiting. Specific for Pertussis.",
        "generalModalities": {
            "agg": ["After midnight", "Lying down", "Warmth of bed", "Talking"],
            "amel": ["Walking", "Open air"]
        },
        "relationships": {
            "complementary": ["Nux-v."],
            "antidotes": ["Camph."],
            "followsWell": ["Calc.", "Puls.", "Verat."]
        },
        "clinicalIndications": ["Whooping cough", "Bronchitis", "Laryngitis", "Tuberculosis support"],
        "potencies": ["30C", "200C"],
        "dosing": "30C for spasmodic cough. Hahnemann warned against frequent repetition."
    }
};

const finalData = { ...existingData, ...authenticRemedies };

fs.writeFileSync(remediesPath, JSON.stringify(finalData, null, 4));
console.log(`Added/Updated ${Object.keys(authenticRemedies).length} authentic remedies. Total count: ${Object.keys(finalData).length}`);
