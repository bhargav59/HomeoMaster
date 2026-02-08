import { Remedy, SymptomEntry, BodyPart } from '../types';

// Debounce function for search
export const debounce = <T extends (...args: any[]) => any>(
    func: T,
    wait: number
): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout | null = null;
    return (...args: Parameters<T>) => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};

// Search remedies by name or abbreviation
export const searchRemedies = (
    remedies: Remedy[],
    query: string
): Remedy[] => {
    const lowerQuery = query.toLowerCase().trim();
    if (!lowerQuery) return remedies;

    return remedies.filter(remedy =>
        remedy.name.toLowerCase().includes(lowerQuery) ||
        remedy.abbrev.toLowerCase().includes(lowerQuery) ||
        remedy.keynotes.some(k => k.toLowerCase().includes(lowerQuery)) ||
        remedy.clinicalIndications.some(c => c.toLowerCase().includes(lowerQuery))
    );
};

// Search symptom entries
export const searchSymptomEntries = (
    entries: SymptomEntry[],
    query: string
): SymptomEntry[] => {
    const lowerQuery = query.toLowerCase().trim();
    if (!lowerQuery) return entries;

    return entries.filter(entry =>
        entry.remedyName.toLowerCase().includes(lowerQuery) ||
        entry.indication.toLowerCase().includes(lowerQuery) ||
        entry.agg.toLowerCase().includes(lowerQuery) ||
        entry.amel.toLowerCase().includes(lowerQuery)
    );
};

// Search body parts
export const searchBodyParts = (
    bodyParts: BodyPart[],
    query: string
): BodyPart[] => {
    const lowerQuery = query.toLowerCase().trim();
    if (!lowerQuery) return bodyParts;

    return bodyParts.filter(bp =>
        bp.name.toLowerCase().includes(lowerQuery) ||
        bp.description.toLowerCase().includes(lowerQuery)
    );
};

// Sort remedies alphabetically
export const sortRemediesAlphabetically = (remedies: Remedy[]): Remedy[] => {
    return [...remedies].sort((a, b) => a.name.localeCompare(b.name));
};

// Group remedies by first letter for section list
export const groupRemediesByLetter = (remedies: Remedy[]): { title: string; data: Remedy[] }[] => {
    const sorted = sortRemediesAlphabetically(remedies);
    const grouped: Record<string, Remedy[]> = {};

    sorted.forEach(remedy => {
        const letter = remedy.name.charAt(0).toUpperCase();
        if (!grouped[letter]) {
            grouped[letter] = [];
        }
        grouped[letter].push(remedy);
    });

    return Object.entries(grouped).map(([title, data]) => ({ title, data }));
};

// Simple repertorization scoring
export interface RepertoryResult {
    remedyId: string;
    remedyName: string;
    score: number;
    matchedSymptoms: string[];
}

export const repertorize = (
    selectedSymptomIds: number[],
    symptomEntries: SymptomEntry[]
): RepertoryResult[] => {
    const selectedSymptoms = symptomEntries.filter(e => selectedSymptomIds.includes(e.id));
    const remedyScores: Record<string, RepertoryResult> = {};

    selectedSymptoms.forEach(symptom => {
        const remedyId = symptom.remedyId;
        if (!remedyScores[remedyId]) {
            remedyScores[remedyId] = {
                remedyId,
                remedyName: symptom.remedyName,
                score: 0,
                matchedSymptoms: [],
            };
        }
        remedyScores[remedyId].score += 1;
        remedyScores[remedyId].matchedSymptoms.push(symptom.indication.substring(0, 50) + '...');
    });

    return Object.values(remedyScores).sort((a, b) => b.score - a.score);
};

// Highlight search query in text
export const highlightText = (text: string, query: string): { text: string; highlight: boolean }[] => {
    if (!query.trim()) return [{ text, highlight: false }];

    const parts: { text: string; highlight: boolean }[] = [];
    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    let lastIndex = 0;

    let index = lowerText.indexOf(lowerQuery);
    while (index !== -1) {
        if (index > lastIndex) {
            parts.push({ text: text.slice(lastIndex, index), highlight: false });
        }
        parts.push({ text: text.slice(index, index + query.length), highlight: true });
        lastIndex = index + query.length;
        index = lowerText.indexOf(lowerQuery, lastIndex);
    }

    if (lastIndex < text.length) {
        parts.push({ text: text.slice(lastIndex), highlight: false });
    }

    return parts;
};
