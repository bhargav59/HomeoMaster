import bodyPartsData from '../data/bodyParts.json';
import remediesFullData from '../data/remediesFull.json';
import symptomEntriesData from '../data/symptomEntries.json';
import { BodyPart, Remedy, SymptomEntry } from '../types';

// Type the imported data
export const bodyParts: BodyPart[] = bodyPartsData as BodyPart[];
export const remediesFull: Record<string, Remedy> = remediesFullData as Record<string, Remedy>;
export const symptomEntries: SymptomEntry[] = symptomEntriesData as SymptomEntry[];

// Get all remedies as an array
export const getAllRemedies = (): Remedy[] => {
    return Object.values(remediesFull);
};

// Get remedy by ID
export const getRemedyById = (id: string): Remedy | undefined => {
    return remediesFull[id];
};

// Get body part by ID
export const getBodyPartById = (id: string): BodyPart | undefined => {
    return bodyParts.find(bp => bp.id === id);
};

// Get symptom entries for a specific body part
export const getSymptomsByBodyPart = (bodyPartId: string): SymptomEntry[] => {
    return symptomEntries.filter(entry => entry.bodyPartId === bodyPartId);
};

// Get all symptom entries for a specific remedy
export const getSymptomsByRemedy = (remedyId: string): SymptomEntry[] => {
    return symptomEntries.filter(entry => entry.remedyId === remedyId);
};

// Group symptom entries by body part for a specific remedy
export const getRemedySymptomsByBodyPart = (remedyId: string): Record<string, SymptomEntry[]> => {
    const symptoms = getSymptomsByRemedy(remedyId);
    return symptoms.reduce((acc, symptom) => {
        if (!acc[symptom.bodyPartId]) {
            acc[symptom.bodyPartId] = [];
        }
        acc[symptom.bodyPartId].push(symptom);
        return acc;
    }, {} as Record<string, SymptomEntry[]>);
};

// Get count of symptom entries per body part
export const getBodyPartSymptomCounts = (): Record<string, number> => {
    return symptomEntries.reduce((acc, entry) => {
        acc[entry.bodyPartId] = (acc[entry.bodyPartId] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
};

// Get a random remedy for daily tip
export const getRandomRemedy = (): Remedy => {
    const remedies = getAllRemedies();
    const randomIndex = Math.floor(Math.random() * remedies.length);
    return remedies[randomIndex];
};

// Get daily tip remedy based on index
export const getDailyTipRemedy = (dayIndex: number): Remedy => {
    const remedies = getAllRemedies();
    return remedies[dayIndex % remedies.length];
};
