import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { getRemedyById } from '../utils/dataLoader';

interface Case {
    id: string;
    title: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    patient: {
        age: number;
        gender: 'Male' | 'Female' | 'Child';
        chiefComplaint: string;
    };
    description: string;
    rubrics: string[];
    correctRemedyId: string;
    explanation: string;
}

const cases: Case[] = [
    {
        id: '1',
        title: 'The Anxious Accountant',
        difficulty: 'Easy',
        patient: { age: 35, gender: 'Male', chiefComplaint: 'Panic Attacks' },
        description: 'A 35-year-old accountant presents with sudden panic attacks. He says they come on suddenly, especially after exposure to cold dry wind. He has an intense fear of death during the attacks and is extremely restless.',
        rubrics: [
            'Mind - Fear of death',
            'Mind - Restlessness',
            'Generalities - Aggravation from cold dry wind',
            'Generalities - Sudden onset'
        ],
        correctRemedyId: 'aconitum',
        explanation: 'Aconite is characterized by sudden, intense onset, fear of death, restlessness, and aggravation from cold dry wind.'
    },
    {
        id: '2',
        title: 'The Irritable CEO',
        difficulty: 'Medium',
        patient: { age: 45, gender: 'Male', chiefComplaint: 'Indigestion & Insomnia' },
        description: 'A driven executive complains of heartburn and constipation. He is very irritable and impatient. He relies on coffee and alcohol to keep going. He wakes up at 3 AM thinking about work and cannot fall back asleep.',
        rubrics: [
            'Mind - Irritability',
            'Stomach - Indigestion from stimulants',
            'Sleep - Waking 3 AM',
            'Rectum - Constipation with ineffectual urging'
        ],
        correctRemedyId: 'nux-vomica',
        explanation: 'Nux Vomica corresponds to the "Type A" workaholic: irritable, using stimulants, with digestive issues and 3 AM waking.'
    },
    {
        id: '3',
        title: 'The Weepy Child',
        difficulty: 'Easy',
        patient: { age: 6, gender: 'Child', chiefComplaint: 'Earache' },
        description: 'A 6-year-old child has an earache. She is clingy and weepy, wanting to be held but not rocked. She feels better in open air and worse in a warm room. She is thirstless.',
        rubrics: [
            'Mind - Weeping easily',
            'Mind - Amelioration from consolation',
            'Ear - Pain worse in warm room',
            'Generalities - Thirstless'
        ],
        correctRemedyId: 'pulsatilla',
        explanation: 'Pulsatilla children are typically weepy, clingy, thirstless, and better in open air/worse in warm rooms.'
    },
    {
        id: '4',
        title: 'The Burning Arthritic',
        difficulty: 'Hard',
        patient: { age: 60, gender: 'Female', chiefComplaint: 'Joint Pain' },
        description: 'A 60-year-old woman complains of burning joint pains that are better with heat. She is very anxious about her health, fastidious, and restless. Her pains are worse at night, especially after midnight.',
        rubrics: [
            'Extremities - Burning pains',
            'Generalities - Amelioration from heat',
            'Mind - Anxiety about health',
            'Mind - Restlessness',
            'Generalities - Aggravation after midnight'
        ],
        correctRemedyId: 'arsenicum',
        explanation: 'Arsenicum covers burning pains relieved by heat, with characteristic anxiety, restlessness, and midnight aggravation.'
    },
    {
        id: '5',
        title: 'The Injury',
        difficulty: 'Easy',
        patient: { age: 25, gender: 'Male', chiefComplaint: 'Bruising' },
        description: 'After a fall, the patient feels bruised and sore all over. He says he is fine and sends the doctor away. The bed feels too hard.',
        rubrics: [
            'Generalities - Bruised sensation',
            'Mind - Says he is well',
            'Generalities - Bed feels too hard',
            'Mind - Fear of touch'
        ],
        correctRemedyId: 'arnica',
        explanation: 'Arnica is the premier remedy for trauma where the patient feels bruised, the bed feels hard, and they deny injury.'
    }
];

export default function CaseSimulatorScreen() {
    const navigation = useNavigation();
    const [selectedCase, setSelectedCase] = useState<Case | null>(null);
    const [showAnswer, setShowAnswer] = useState(false);
    const [feedback, setFeedback] = useState<'Correct' | 'Incorrect' | null>(null);

    const handleSelectRemedy = (remedyId: string) => {
        if (!selectedCase) return;

        if (remedyId === selectedCase.correctRemedyId) {
            setFeedback('Correct');
            setShowAnswer(true);
        } else {
            setFeedback('Incorrect');
            Alert.alert('Incorrect', 'That is not the curative remedy. Try reviewing the rubrics again.');
        }
    };

    const renderCaseList = () => (
        <ScrollView style={styles.container} contentContainerStyle={styles.listContent}>
            <Text style={styles.headerTitle}>Case Studies</Text>
            <Text style={styles.headerSubtitle}>Practice your prescribing skills</Text>

            {cases.map((c) => (
                <TouchableOpacity
                    key={c.id}
                    style={styles.caseCard}
                    onPress={() => {
                        setSelectedCase(c);
                        setShowAnswer(false);
                        setFeedback(null);
                    }}
                >
                    <View style={styles.caseHeader}>
                        <View style={styles.caseIconContainer}>
                            <Ionicons name="person" size={24} color="#0ea5e9" />
                        </View>
                        <View style={styles.caseTitleContainer}>
                            <Text style={styles.caseTitle}>{c.title}</Text>
                            <Text style={styles.caseDetails}>{c.patient.age}y • {c.patient.gender} • {c.patient.chiefComplaint}</Text>
                        </View>
                        <View style={[
                            styles.difficultyBadge,
                            c.difficulty === 'Easy' ? styles.bgGreen :
                                c.difficulty === 'Medium' ? styles.bgYellow : styles.bgRed
                        ]}>
                            <Text style={[
                                styles.difficultyText,
                                c.difficulty === 'Easy' ? styles.textGreen :
                                    c.difficulty === 'Medium' ? styles.textYellow : styles.textRed
                            ]}>{c.difficulty}</Text>
                        </View>

                    </View>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );

    const renderCaseDetail = () => {
        if (!selectedCase) return null;

        const correctRemedy = getRemedyById(selectedCase.correctRemedyId);

        return (
            <Modal
                animationType="slide"
                presentationStyle="pageSheet"
                visible={!!selectedCase}
                onRequestClose={() => setSelectedCase(null)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <TouchableOpacity onPress={() => setSelectedCase(null)} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color="#334155" />
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>Case #{selectedCase.id}</Text>
                        <View style={{ width: 24 }} />
                    </View>

                    <ScrollView contentContainerStyle={styles.modalContent}>
                        <Text style={styles.caseTitleLarge}>{selectedCase.title}</Text>

                        <View style={styles.patientProfile}>
                            <Ionicons name="person-circle" size={40} color="#64748b" />
                            <View>
                                <Text style={styles.patientInfo}>{selectedCase.patient.age} year old {selectedCase.patient.gender}</Text>
                                <Text style={styles.complaint}>CC: {selectedCase.patient.chiefComplaint}</Text>
                            </View>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionHeader}>Case Description</Text>
                            <Text style={styles.descriptionText}>{selectedCase.description}</Text>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionHeader}>Key Rubrics</Text>
                            {selectedCase.rubrics.map((rubric, index) => (
                                <View key={index} style={styles.rubricItem}>
                                    <Ionicons name="list" size={16} color="#0ea5e9" />
                                    <Text style={styles.rubricText}>{rubric}</Text>
                                </View>
                            ))}
                        </View>

                        {!showAnswer ? (
                            <View style={styles.actionSection}>
                                <Text style={styles.sectionHeader}>Select Remedy</Text>
                                <Text style={styles.instructionText}>Based on the rubrics, which remedy is indicated?</Text>

                                <View style={styles.optionsGrid}>
                                    {['aconitum', 'belladonna', 'nux-vomica', 'pulsatilla', 'arsenicum', 'arnica', 'rhus-tox', 'bryonia'].map((remId) => {
                                        const rem = getRemedyById(remId);
                                        if (!rem) return null;
                                        return (
                                            <TouchableOpacity
                                                key={remId}
                                                style={styles.optionButton}
                                                onPress={() => handleSelectRemedy(remId)}
                                            >
                                                <Text style={styles.optionText}>{rem.name}</Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            </View>
                        ) : (
                            <View style={[styles.resultSection, styles.bgGreenLight]}>
                                <View style={styles.resultHeader}>
                                    <Ionicons name="checkmark-circle" size={32} color="#16a34a" />
                                    <Text style={styles.resultTitle}>Correct!</Text>
                                </View>
                                <Text style={styles.resultRemedy}>{correctRemedy?.name}</Text>
                                <Text style={styles.explanation}>{selectedCase.explanation}</Text>

                                <TouchableOpacity
                                    style={styles.nextButton}
                                    onPress={() => setSelectedCase(null)}
                                >
                                    <Text style={styles.nextButtonText}>Back to Cases</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </ScrollView>
                </View>
            </Modal>
        );
    };

    return (
        <View style={styles.mainContainer}>
            {renderCaseList()}
            {renderCaseDetail()}
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#f1f5f9',
    },
    container: {
        flex: 1,
    },
    listContent: {
        padding: 16,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#0f172a',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#64748b',
        marginBottom: 24,
    },
    caseCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    caseHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    caseIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#e0f2fe',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    caseTitleContainer: {
        flex: 1,
    },
    caseTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#0f172a',
        marginBottom: 2,
    },
    caseDetails: {
        fontSize: 14,
        color: '#64748b',
    },
    difficultyBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    difficultyText: {
        fontSize: 12,
        fontWeight: '600',
    },
    bgGreen: { backgroundColor: '#dcfce7' },
    textGreen: { color: '#16a34a' },
    bgYellow: { backgroundColor: '#fef9c3' },
    textYellow: { color: '#ca8a04' },
    bgRed: { backgroundColor: '#fee2e2' },
    textRed: { color: '#dc2626' },

    // Modal Styles
    modalContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    closeButton: {
        padding: 8,
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#334155',
    },
    modalContent: {
        padding: 20,
    },
    caseTitleLarge: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0f172a',
        marginBottom: 16,
    },
    patientProfile: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
    },
    patientInfo: {
        fontSize: 16,
        fontWeight: '600',
        color: '#334155',
        marginLeft: 12,
    },
    complaint: {
        fontSize: 14,
        color: '#64748b',
        marginLeft: 12,
        marginTop: 2,
    },
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: 12,
    },
    descriptionText: {
        fontSize: 16,
        color: '#334155',
        lineHeight: 24,
    },
    rubricItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        backgroundColor: '#f0f9ff',
        padding: 10,
        borderRadius: 8,
    },
    rubricText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#0369a1',
        fontWeight: '500',
    },
    actionSection: {
        marginTop: 8,
    },
    instructionText: {
        fontSize: 14,
        color: '#64748b',
        marginBottom: 16,
    },
    optionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    optionButton: {
        flexBasis: '48%',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderRadius: 10,
        alignItems: 'center',
    },
    optionText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#334155',
        padding: 4
    },
    resultSection: {
        padding: 24,
        borderRadius: 16,
        alignItems: 'center',
        marginTop: 10,
    },
    bgGreenLight: {
        backgroundColor: '#ecfdf5',
    },
    resultHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    resultTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#16a34a',
        marginLeft: 8,
    },
    resultRemedy: {
        fontSize: 20,
        fontWeight: '600',
        color: '#15803d',
        marginBottom: 12,
    },
    explanation: {
        fontSize: 15,
        color: '#166534',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 20,
    },
    nextButton: {
        backgroundColor: '#16a34a',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 24,
    },
    nextButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    }
});
