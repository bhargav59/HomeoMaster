import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProgress } from '../types';

interface AppState {
    // User progress
    progress: UserProgress;

    // Actions
    addFavorite: (remedyId: string) => void;
    removeFavorite: (remedyId: string) => void;
    isFavorite: (remedyId: string) => boolean;

    addNote: (remedyId: string, note: string) => void;
    getNote: (remedyId: string) => string;

    markBodyPartMastered: (bodyPartId: string) => void;
    isBodyPartMastered: (bodyPartId: string) => boolean;

    updateQuizScore: (quizId: string, score: number) => void;

    setLastAccessedRemedy: (remedyId: string) => void;
    incrementDailyTip: () => void;

    // Search history
    searchHistory: string[];
    addToSearchHistory: (query: string) => void;
    clearSearchHistory: () => void;
}

const initialProgress: UserProgress = {
    masteredBodyParts: [],
    favorites: [],
    notes: {},
    quizScores: {},
    dailyTipIndex: 0,
};

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            progress: initialProgress,
            searchHistory: [],

            addFavorite: (remedyId: string) =>
                set((state) => ({
                    progress: {
                        ...state.progress,
                        favorites: [...new Set([...state.progress.favorites, remedyId])],
                    },
                })),

            removeFavorite: (remedyId: string) =>
                set((state) => ({
                    progress: {
                        ...state.progress,
                        favorites: state.progress.favorites.filter((id) => id !== remedyId),
                    },
                })),

            isFavorite: (remedyId: string) =>
                get().progress.favorites.includes(remedyId),

            addNote: (remedyId: string, note: string) =>
                set((state) => ({
                    progress: {
                        ...state.progress,
                        notes: { ...state.progress.notes, [remedyId]: note },
                    },
                })),

            getNote: (remedyId: string) =>
                get().progress.notes[remedyId] || '',

            markBodyPartMastered: (bodyPartId: string) =>
                set((state) => ({
                    progress: {
                        ...state.progress,
                        masteredBodyParts: [...new Set([...state.progress.masteredBodyParts, bodyPartId])],
                    },
                })),

            isBodyPartMastered: (bodyPartId: string) =>
                get().progress.masteredBodyParts.includes(bodyPartId),

            updateQuizScore: (quizId: string, score: number) =>
                set((state) => ({
                    progress: {
                        ...state.progress,
                        quizScores: { ...state.progress.quizScores, [quizId]: score },
                    },
                })),

            setLastAccessedRemedy: (remedyId: string) =>
                set((state) => ({
                    progress: { ...state.progress, lastAccessedRemedy: remedyId },
                })),

            incrementDailyTip: () =>
                set((state) => ({
                    progress: {
                        ...state.progress,
                        dailyTipIndex: state.progress.dailyTipIndex + 1,
                    },
                })),

            addToSearchHistory: (query: string) =>
                set((state) => ({
                    searchHistory: [query, ...state.searchHistory.filter(q => q !== query)].slice(0, 10),
                })),

            clearSearchHistory: () => set({ searchHistory: [] }),
        }),
        {
            name: 'homeomaster-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
