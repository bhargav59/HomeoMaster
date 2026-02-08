import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, SymptomEntry } from '../types';
import { bodyParts, symptomEntries, getBodyPartById } from '../utils/dataLoader';
import { repertorize, RepertoryResult } from '../utils/search';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function RepertoryToolScreen() {
    const navigation = useNavigation<NavigationProp>();
    const [selectedBodyPart, setSelectedBodyPart] = useState<string | null>(null);
    const [selectedSymptoms, setSelectedSymptoms] = useState<number[]>([]);
    const [showResults, setShowResults] = useState(false);

    const availableSymptoms = useMemo(() => {
        if (!selectedBodyPart) return [];
        return symptomEntries.filter(e => e.bodyPartId === selectedBodyPart);
    }, [selectedBodyPart]);

    const results = useMemo(() => {
        if (selectedSymptoms.length === 0) return [];
        return repertorize(selectedSymptoms, symptomEntries);
    }, [selectedSymptoms]);

    const toggleSymptom = (symptomId: number) => {
        setSelectedSymptoms(prev =>
            prev.includes(symptomId)
                ? prev.filter(id => id !== symptomId)
                : [...prev, symptomId]
        );
        setShowResults(false);
    };

    const clearSelection = () => {
        setSelectedSymptoms([]);
        setShowResults(false);
    };

    const analyzeRemedies = () => {
        setShowResults(true);
    };

    if (showResults && results.length > 0) {
        return (
            <View style={styles.container}>
                <View style={styles.resultsHeader}>
                    <TouchableOpacity onPress={() => setShowResults(false)} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#0ea5e9" />
                        <Text style={styles.backText}>Edit Symptoms</Text>
                    </TouchableOpacity>
                    <Text style={styles.resultsTitle}>Remedy Suggestions</Text>
                    <Text style={styles.resultsSubtitle}>
                        Based on {selectedSymptoms.length} selected symptoms
                    </Text>
                </View>

                <FlatList
                    data={results}
                    keyExtractor={(item) => item.remedyId}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity
                            style={styles.resultCard}
                            onPress={() => navigation.navigate('RemedyDetail', { remedyId: item.remedyId })}
                        >
                            <View style={styles.resultRank}>
                                <Text style={styles.rankNumber}>{index + 1}</Text>
                            </View>
                            <View style={styles.resultContent}>
                                <Text style={styles.resultName}>{item.remedyName}</Text>
                                <View style={styles.scoreContainer}>
                                    <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                                    <Text style={styles.scoreText}>{item.score} symptom matches</Text>
                                </View>
                                <Text style={styles.matchedText} numberOfLines={2}>
                                    {item.matchedSymptoms.slice(0, 2).join(' • ')}
                                </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
                        </TouchableOpacity>
                    )}
                    contentContainerStyle={styles.resultsListContent}
                />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} >
            <View style={styles.header}>
                <Text style={styles.title}>Repertory Tool</Text>
                <Text style={styles.subtitle}>
                    Select symptoms to find matching remedies
                </Text>
            </View>

            {/* Body Part Selector */}
            <Text style={styles.sectionTitle}>1. Choose Body Part</Text>
            <ScrollView
                
                
                style={styles.bodyPartScroll}
                contentContainerStyle={styles.bodyPartScrollContent}
            >
                {bodyParts.map((bp) => (
                    <TouchableOpacity
                        key={bp.id}
                        style={[
                            styles.bodyPartChip,
                            selectedBodyPart === bp.id && styles.bodyPartChipSelected,
                            { borderColor: bp.color }
                        ]}
                        onPress={() => setSelectedBodyPart(bp.id)}
                    >
                        <View style={[styles.chipDot, { backgroundColor: bp.color }]} />
                        <Text style={[
                            styles.chipText,
                            selectedBodyPart === bp.id && styles.chipTextSelected
                        ]}>
                            {bp.name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Symptom List */}
            {selectedBodyPart && (
                <>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>2. Select Symptoms</Text>
                        {selectedSymptoms.length > 0 && (
                            <TouchableOpacity onPress={clearSelection}>
                                <Text style={styles.clearText}>Clear ({selectedSymptoms.length})</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    <View style={styles.symptomList}>
                        {availableSymptoms.map((symptom) => {
                            const isSelected = selectedSymptoms.includes(symptom.id);
                            return (
                                <TouchableOpacity
                                    key={symptom.id}
                                    style={[styles.symptomItem, isSelected && styles.symptomItemSelected]}
                                    onPress={() => toggleSymptom(symptom.id)}
                                >
                                    <View style={styles.checkbox}>
                                        {isSelected && <Ionicons name="checkmark" size={16} color="#ffffff" />}
                                    </View>
                                    <View style={styles.symptomContent}>
                                        <Text style={[styles.symptomRemedy, isSelected && styles.textSelected]}>
                                            {symptom.remedyName}
                                        </Text>
                                        <Text style={styles.symptomIndication} numberOfLines={2}>
                                            {symptom.indication}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </>
            )}

            {/* Analyze Button */}
            {selectedSymptoms.length > 0 && (
                <TouchableOpacity style={styles.analyzeButton} onPress={analyzeRemedies}>
                    <Ionicons name="analytics" size={22} color="#ffffff" />
                    <Text style={styles.analyzeButtonText}>
                        Analyze {selectedSymptoms.length} Symptoms
                    </Text>
                </TouchableOpacity>
            )}

            <View style={styles.bottomSpacing} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f9ff',
    },
    header: {
        padding: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#0f172a',
    },
    subtitle: {
        fontSize: 15,
        color: '#64748b',
        marginTop: 4,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginTop: 16,
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0f172a',
        paddingHorizontal: 16,
        marginTop: 16,
        marginBottom: 10,
    },
    clearText: {
        fontSize: 14,
        color: '#ef4444',
        fontWeight: '500',
    },
    bodyPartScroll: {
        marginBottom: 8,
    },
    bodyPartScrollContent: {
        paddingHorizontal: 16,
        gap: 8,
    },
    bodyPartChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 2,
        gap: 8,
        marginRight: 8,
    },
    bodyPartChipSelected: {
        backgroundColor: '#0ea5e9',
        borderColor: '#0ea5e9',
    },
    chipDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    chipText: {
        fontSize: 14,
        color: '#334155',
        fontWeight: '500',
    },
    chipTextSelected: {
        color: '#ffffff',
    },
    symptomList: {
        paddingHorizontal: 16,
        gap: 8,
    },
    symptomItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#ffffff',
        padding: 14,
        borderRadius: 12,
        gap: 12,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    symptomItemSelected: {
        borderColor: '#0ea5e9',
        backgroundColor: '#f0f9ff',
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#0ea5e9',
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    symptomContent: {
        flex: 1,
    },
    symptomRemedy: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0f172a',
        marginBottom: 4,
    },
    textSelected: {
        color: '#0369a1',
    },
    symptomIndication: {
        fontSize: 14,
        color: '#64748b',
        lineHeight: 20,
    },
    analyzeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0ea5e9',
        marginHorizontal: 16,
        marginTop: 20,
        paddingVertical: 16,
        borderRadius: 12,
        gap: 10,
    },
    analyzeButtonText: {
        fontSize: 17,
        fontWeight: '600',
        color: '#ffffff',
    },
    bottomSpacing: {
        height: 40,
    },
    // Results styles
    resultsHeader: {
        padding: 20,
        backgroundColor: '#0ea5e9',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 12,
    },
    backText: {
        fontSize: 14,
        color: '#bae6fd',
        fontWeight: '500',
    },
    resultsTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    resultsSubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 4,
    },
    resultsListContent: {
        padding: 16,
        gap: 10,
    },
    resultCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 14,
    },
    resultRank: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#dbeafe',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    rankNumber: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1d4ed8',
    },
    resultContent: {
        flex: 1,
    },
    resultName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#0f172a',
        marginBottom: 4,
    },
    scoreContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 4,
    },
    scoreText: {
        fontSize: 13,
        color: '#10b981',
        fontWeight: '500',
    },
    matchedText: {
        fontSize: 12,
        color: '#64748b',
        lineHeight: 16,
    },
});
