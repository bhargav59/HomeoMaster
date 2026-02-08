// Type definitions for HomeoMaster app

export interface BodyPart {
    id: string;
    name: string;
    icon: string;
    description: string;
    color: string;
}

export interface RemedyModalities {
    agg: string[];
    amel: string[];
}

export interface RemedyRelationships {
    complementary: string[];
    antidotes: string[];
    followsWell: string[];
}

export interface Remedy {
    id: string;
    name: string;
    abbrev: string;
    source: string;
    keynotes: string[];
    essence: string;
    generalModalities: RemedyModalities;
    relationships: RemedyRelationships;
    clinicalIndications: string[];
    potencies: string[];
    dosing: string;
    materiaMedica?: {
        source: string;
        chapter: string;
        section: string;
        text: string;
    }[];
}

export interface SymptomEntry {
    id: number;
    bodyPartId: string;
    remedyId: string;
    remedyName: string;
    potency: string;
    dose: string;
    indication: string;
    agg: string;
    amel: string;
}

export interface UserProgress {
    masteredBodyParts: string[];
    favorites: string[];
    notes: Record<string, string>;
    quizScores: Record<string, number>;
    lastAccessedRemedy?: string;
    dailyTipIndex: number;
}

export type RootStackParamList = {
    MainTabs: undefined;
    BodyPartDetail: { bodyPartId: string; bodyPartName: string };
    RemedyDetail: { remedyId: string };
    RepertoryTool: undefined;
    CaseSimulator: undefined;
    Quiz: undefined;
};

export type TabParamList = {
    Home: undefined;
    BodyParts: undefined;
    AllRemedies: undefined;
    Tools: undefined;
    Learn: undefined;
};
