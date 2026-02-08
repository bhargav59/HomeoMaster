import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { getRemedyById, getRemedySymptomsByBodyPart, getBodyPartById } from '../utils/dataLoader';
import { useAppStore } from '../store/useAppStore';
import FormattedText from '../components/FormattedText';

type Props = NativeStackScreenProps<RootStackParamList, 'RemedyDetail'>;

export default function RemedyDetailScreen({ route }: Props) {
    const { remedyId } = route.params;
    const remedy = getRemedyById(remedyId);
    const { isFavorite, addFavorite, removeFavorite, getNote, addNote } = useAppStore();

    const symptomsByBodyPart = useMemo(() => {
        return getRemedySymptomsByBodyPart(remedyId);
    }, [remedyId]);

    const favorite = isFavorite(remedyId);

    if (!remedy) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Remedy not found</Text>
            </View>
        );
    }

    const toggleFavorite = () => {
        if (favorite) {
            removeFavorite(remedyId);
        } else {
            addFavorite(remedyId);
        }
    };

    return (
        <ScrollView style={styles.container} >
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <Text style={styles.remedyName}>{remedy.name}</Text>
                    <Text style={styles.remedyAbbrev}>{remedy.abbrev}</Text>
                </View>
                <TouchableOpacity onPress={toggleFavorite} style={styles.favoriteButton}>
                    <Ionicons
                        name={favorite ? 'heart' : 'heart-outline'}
                        size={28}
                        color={favorite ? '#ef4444' : '#64748b'}
                    />
                </TouchableOpacity>
            </View>

            {/* Source */}
            <View style={styles.sourceCard}>
                <Ionicons name="leaf" size={20} color="#16a34a" />
                <Text style={styles.sourceText}>Source: {remedy.source}</Text>
            </View>

            {/* Essence */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Essence</Text>
                <View style={styles.essenceCard}>
                    <Text style={styles.essenceText}>{remedy.essence}</Text>
                </View>
            </View>

            {/* Keynotes */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Keynotes</Text>
                <View style={styles.keynotesContainer}>
                    {remedy.keynotes.map((keynote, index) => (
                        <View key={index} style={styles.keynoteItem}>
                            <View style={styles.keynoteBullet} />
                            <Text style={styles.keynoteText}>{keynote}</Text>
                        </View>
                    ))}
                </View>
            </View>

            {/* Modalities */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>General Modalities</Text>

                <View style={styles.modalityCard}>
                    <View style={styles.modalityHeader}>
                        <Ionicons name="arrow-down-circle" size={20} color="#ef4444" />
                        <Text style={styles.aggTitle}>Aggravation (Worse)</Text>
                    </View>
                    <View style={styles.modalityTags}>
                        {remedy.generalModalities.agg.map((item, index) => (
                            <View key={index} style={styles.aggTag}>
                                <Text style={styles.tagText}>{item}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                <View style={styles.modalityCard}>
                    <View style={styles.modalityHeader}>
                        <Ionicons name="arrow-up-circle" size={20} color="#10b981" />
                        <Text style={styles.amelTitle}>Amelioration (Better)</Text>
                    </View>
                    <View style={styles.modalityTags}>
                        {remedy.generalModalities.amel.map((item, index) => (
                            <View key={index} style={styles.amelTag}>
                                <Text style={styles.tagText}>{item}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </View>

            {/* Clinical Indications */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Clinical Indications</Text>
                <View style={styles.indicationsContainer}>
                    {remedy.clinicalIndications.map((indication, index) => (
                        <View key={index} style={styles.indicationTag}>
                            <Text style={styles.indicationText}>{indication}</Text>
                        </View>
                    ))}
                </View>
            </View>

            {/* Relationships */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Remedy Relationships</Text>

                <View style={styles.relationCard}>
                    <Text style={styles.relationLabel}>Complementary:</Text>
                    <Text style={styles.relationValue}>{remedy.relationships.complementary.join(', ')}</Text>
                </View>

                <View style={styles.relationCard}>
                    <Text style={styles.relationLabel}>Antidotes:</Text>
                    <Text style={styles.relationValue}>{remedy.relationships.antidotes.join(', ')}</Text>
                </View>

                <View style={styles.relationCard}>
                    <Text style={styles.relationLabel}>Follows Well:</Text>
                    <Text style={styles.relationValue}>{remedy.relationships.followsWell.join(', ')}</Text>
                </View>
            </View>

            {/* Potencies & Dosing */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Potencies & Dosing</Text>
                <View style={styles.dosingCard}>
                    <View style={styles.potenciesRow}>
                        {remedy.potencies.map((potency, index) => (
                            <View key={index} style={styles.potencyBadge}>
                                <Text style={styles.potencyText}>{potency}</Text>
                            </View>
                        ))}
                    </View>
                    <Text style={styles.dosingText}>{remedy.dosing}</Text>
                </View>
            </View>

            {/* OOREP Materia Medica Content */}
            {remedy.materiaMedica && remedy.materiaMedica.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Materia Medica (Original Text)</Text>
                    {remedy.materiaMedica.map((entry, index) => (
                        <View key={index} style={styles.mmCard}>
                            <View style={styles.mmHeader}>
                                <Ionicons name="book" size={16} color="#475569" />
                                <Text style={styles.mmSource}>{entry.source}</Text>
                            </View>
                            <Text style={styles.mmChapter}>{entry.chapter} - {entry.section}</Text>
                            <FormattedText style={styles.mmText} text={entry.text} />
                        </View>
                    ))}
                </View>
            )}

            {/* Symptom Picture by Body Part */}
            {Object.keys(symptomsByBodyPart).length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Symptom Picture by Body Part</Text>
                    {Object.entries(symptomsByBodyPart).map(([bodyPartId, symptoms]) => {
                        const bodyPart = getBodyPartById(bodyPartId);
                        return (
                            <View key={bodyPartId} style={styles.symptomBodyPartCard}>
                                <Text style={[styles.bodyPartName, { color: bodyPart?.color || '#0ea5e9' }]}>
                                    {bodyPart?.name || bodyPartId}
                                </Text>
                                {symptoms.map((symptom, index) => (
                                    <View key={index} style={styles.symptomItem}>
                                        <Text style={styles.symptomIndication}>{symptom.indication}</Text>
                                        <View style={styles.symptomModalities}>
                                            <Text style={styles.symptomAgg}>↓ {symptom.agg}</Text>
                                            <Text style={styles.symptomAmel}>↑ {symptom.amel}</Text>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        );
                    })}
                </View>
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
    errorText: {
        fontSize: 18,
        color: '#ef4444',
        textAlign: 'center',
        marginTop: 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: 20,
        backgroundColor: '#0ea5e9',
    },
    headerContent: {
        flex: 1,
    },
    remedyName: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    remedyAbbrev: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 4,
    },
    favoriteButton: {
        padding: 8,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 12,
    },
    sourceCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#dcfce7',
        marginHorizontal: 16,
        marginTop: 16,
        padding: 12,
        borderRadius: 10,
        gap: 8,
    },
    sourceText: {
        fontSize: 14,
        color: '#166534',
        fontWeight: '500',
    },
    section: {
        marginTop: 20,
        paddingHorizontal: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: 12,
    },
    essenceCard: {
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#0ea5e9',
    },
    essenceText: {
        fontSize: 15,
        color: '#334155',
        lineHeight: 24,
        fontStyle: 'italic',
    },
    keynotesContainer: {
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 12,
        gap: 10,
    },
    keynoteItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
    },
    keynoteBullet: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#0ea5e9',
        marginTop: 6,
    },
    keynoteText: {
        fontSize: 15,
        color: '#334155',
        flex: 1,
        lineHeight: 22,
    },
    modalityCard: {
        backgroundColor: '#ffffff',
        padding: 14,
        borderRadius: 12,
        marginBottom: 10,
    },
    modalityHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 10,
    },
    aggTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#ef4444',
    },
    amelTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#10b981',
    },
    modalityTags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    aggTag: {
        backgroundColor: '#fee2e2',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
    },
    amelTag: {
        backgroundColor: '#dcfce7',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
    },
    tagText: {
        fontSize: 13,
        color: '#374151',
    },
    indicationsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    indicationTag: {
        backgroundColor: '#dbeafe',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    indicationText: {
        fontSize: 13,
        color: '#1e40af',
        fontWeight: '500',
    },
    relationCard: {
        backgroundColor: '#ffffff',
        padding: 12,
        borderRadius: 10,
        marginBottom: 8,
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
    },
    relationLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748b',
        minWidth: 100,
    },
    relationValue: {
        fontSize: 14,
        color: '#0f172a',
        flex: 1,
    },
    dosingCard: {
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 12,
    },
    potenciesRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 12,
    },
    potencyBadge: {
        backgroundColor: '#dbeafe',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    potencyText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1d4ed8',
    },
    dosingText: {
        fontSize: 14,
        color: '#334155',
        lineHeight: 22,
    },
    symptomBodyPartCard: {
        backgroundColor: '#ffffff',
        padding: 14,
        borderRadius: 12,
        marginBottom: 10,
    },
    bodyPartName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
    },
    symptomItem: {
        paddingVertical: 8,
        borderTopWidth: 1,
        borderTopColor: '#e2e8f0',
    },
    symptomIndication: {
        fontSize: 14,
        color: '#334155',
        lineHeight: 20,
        marginBottom: 6,
    },
    symptomModalities: {
        gap: 4,
    },
    symptomAgg: {
        fontSize: 12,
        color: '#dc2626',
    },
    symptomAmel: {
        fontSize: 12,
        color: '#16a34a',
    },
    bottomSpacing: {
        height: 40,
    },
    mmCard: {
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderLeftWidth: 3,
        borderLeftColor: '#64748b',
    },
    mmHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 6,
    },
    mmSource: {
        fontSize: 12,
        fontWeight: '600',
        color: '#475569',
        textTransform: 'uppercase',
    },
    mmChapter: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1e293b',
        marginBottom: 8,
    },
    mmText: {
        fontSize: 15,
        color: '#334155',
        lineHeight: 24,
    },
});
