import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getAllRemedies, bodyParts } from '../utils/dataLoader';
import { Remedy } from '../types';

interface Question {
    id: number;
    text: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
}

export default function LearnScreen() {
    const [activeQuiz, setActiveQuiz] = useState<{ title: string, questions: Question[] } | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    const modules = [
        {
            id: 'foundations',
            title: 'Foundations of Homeopathy',
            lessons: 8,
            duration: '45 min',
            icon: 'book' as const,
            color: '#2563eb',
            progress: 15,
        },
        {
            id: 'polychrests',
            title: 'Major Polychrest Remedies',
            lessons: 12,
            duration: '1.5 hrs',
            icon: 'flask' as const,
            color: '#16a34a',
            progress: 0,
        },
        {
            id: 'prescribing',
            title: 'The Art of Prescribing',
            lessons: 6,
            duration: '40 min',
            icon: 'medical' as const,
            color: '#9333ea',
            progress: 0,
        },
        {
            id: 'modalities',
            title: 'Understanding Modalities',
            lessons: 5,
            duration: '30 min',
            icon: 'options' as const,
            color: '#ea580c',
            progress: 0,
        },
    ];

    const generateQuestions = (type: 'remedy' | 'modality' | 'clinical'): Question[] => {
        const remedies = getAllRemedies();
        const questions: Question[] = [];

        // Ensure we have enough data
        if (remedies.length < 4) {
            Alert.alert("Insufficient Data", "Need more remedies to generate quiz.");
            return [];
        }

        for (let i = 0; i < 5; i++) {
            const targetRemedy = remedies[Math.floor(Math.random() * remedies.length)];
            const distractor1 = remedies[Math.floor(Math.random() * remedies.length)];
            const distractor2 = remedies[Math.floor(Math.random() * remedies.length)];
            const distractor3 = remedies[Math.floor(Math.random() * remedies.length)];

            // Unique options
            const options = Array.from(new Set([targetRemedy.name, distractor1.name, distractor2.name, distractor3.name]));
            while (options.length < 4) {
                options.push(remedies[Math.floor(Math.random() * remedies.length)].name);
            }
            // Shuffle
            options.sort(() => Math.random() - 0.5);

            let q: Question;

            if (type === 'remedy') {
                const keynote = targetRemedy.keynotes[Math.floor(Math.random() * targetRemedy.keynotes.length)];
                q = {
                    id: i,
                    text: `Which remedy covers the symptom: "${keynote}"?`,
                    options: options,
                    correctAnswer: targetRemedy.name,
                    explanation: `${targetRemedy.name} is well known for: ${keynote}`
                };
            } else if (type === 'modality') {
                const agg = targetRemedy.generalModalities.agg[0];
                q = {
                    id: i,
                    text: `Which remedy is aggravated by: "${agg}"?`,
                    options: options,
                    correctAnswer: targetRemedy.name,
                    explanation: `${targetRemedy.name} has a strong aggravation from ${agg}.`
                };
            } else {
                const indication = targetRemedy.clinicalIndications[0];
                q = {
                    id: i,
                    text: `Which remedy is indicated for: "${indication}"?`,
                    options: options,
                    correctAnswer: targetRemedy.name,
                    explanation: `${targetRemedy.name} is frequently used for ${indication}.`
                };
            }
            questions.push(q);
        }
        return questions;
    };

    const startQuiz = (type: 'remedy' | 'modality' | 'clinical', title: string) => {
        const qs = generateQuestions(type);
        if (qs.length > 0) {
            setActiveQuiz({ title, questions: qs });
            setCurrentQuestionIndex(0);
            setScore(0);
            setShowResult(false);
            setSelectedOption(null);
            setIsCorrect(null);
        }
    };

    const handleAnswer = (option: string) => {
        if (selectedOption) return; // Prevent multiple clicks

        setSelectedOption(option);
        const correct = activeQuiz!.questions[currentQuestionIndex].correctAnswer === option;
        setIsCorrect(correct);

        if (correct) setScore(s => s + 1);

        // Auto advance
        setTimeout(() => {
            if (currentQuestionIndex < activeQuiz!.questions.length - 1) {
                setCurrentQuestionIndex(i => i + 1);
                setSelectedOption(null);
                setIsCorrect(null);
            } else {
                setShowResult(true);
            }
        }, 1500);
    };

    const closeQuiz = () => {
        setActiveQuiz(null);
    };

    return (
        <ScrollView style={styles.container} >
            <View style={styles.header}>
                <Text style={styles.title}>Learn Homeopathy</Text>
                <Text style={styles.subtitle}>
                    Structured modules and quizzes to master homeopathic prescribing
                </Text>
            </View>

            {/* Learning Modules */}
            <Text style={styles.sectionTitle}>Learning Modules</Text>
            <View style={styles.modulesList}>
                {modules.map((module) => (
                    <TouchableOpacity key={module.id} style={styles.moduleCard} activeOpacity={0.7}>
                        <View style={[styles.moduleIcon, { backgroundColor: module.color + '20' }]}>
                            <Ionicons name={module.icon} size={28} color={module.color} />
                        </View>
                        <View style={styles.moduleContent}>
                            <Text style={styles.moduleTitle}>{module.title}</Text>
                            <View style={styles.moduleStats}>
                                <View style={styles.statBadge}>
                                    <Ionicons name="document-text" size={12} color="#64748b" />
                                    <Text style={styles.statText}>{module.lessons} lessons</Text>
                                </View>
                                <View style={styles.statBadge}>
                                    <Ionicons name="time" size={12} color="#64748b" />
                                    <Text style={styles.statText}>{module.duration}</Text>
                                </View>
                            </View>
                            <View style={styles.progressBar}>
                                <View style={[styles.progressFill, { width: `${module.progress}%`, backgroundColor: module.color }]} />
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
                    </TouchableOpacity>
                ))}
            </View>

            {/* Quizzes */}
            <Text style={styles.sectionTitle}>Practice Quizzes</Text>
            <View style={styles.quizzesGrid}>
                <TouchableOpacity
                    style={styles.quizCard}
                    onPress={() => startQuiz('remedy', 'Remedy Recognition')}
                >
                    <Ionicons name="help-circle" size={32} color="#0ea5e9" />
                    <Text style={styles.quizTitle}>Remedy Recognition</Text>
                    <Text style={styles.quizQuestions}>Identifying Keynotes</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.quizCard}
                    onPress={() => startQuiz('modality', 'Modality Master')}
                >
                    <Ionicons name="shuffle" size={32} color="#f59e0b" />
                    <Text style={styles.quizTitle}>Modality Master</Text>
                    <Text style={styles.quizQuestions}>Aggravations & Ameliorations</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.quizCard}
                    onPress={() => startQuiz('clinical', 'Clinical Indications')}
                >
                    <Ionicons name="medkit" size={32} color="#ec4899" />
                    <Text style={styles.quizTitle}>Clinical Indications</Text>
                    <Text style={styles.quizQuestions}>Pathology Matching</Text>
                </TouchableOpacity>
            </View>

            {/* Daily Challenge */}
            <View style={styles.challengeCard}>
                <View style={styles.challengeHeader}>
                    <Ionicons name="trophy" size={24} color="#f59e0b" />
                    <Text style={styles.challengeTitle}>Daily Challenge</Text>
                </View>
                <Text style={styles.challengeDescription}>
                    Test your knowledge with today's remedy identification challenge
                </Text>
                <TouchableOpacity style={styles.challengeButton} onPress={() => startQuiz('remedy', 'Daily Challenge')}>
                    <Text style={styles.challengeButtonText}>Start Challenge</Text>
                    <Ionicons name="play" size={18} color="#ffffff" />
                </TouchableOpacity>
            </View>

            <View style={styles.bottomSpacing} />

            {/* Quiz Modal */}
            <Modal
                animationType="slide"
                visible={!!activeQuiz}
                onRequestClose={closeQuiz}
                presentationStyle="pageSheet"
            >
                {activeQuiz && (
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <TouchableOpacity onPress={closeQuiz} style={styles.closeButton}>
                                <Ionicons name="close" size={24} color="#334155" />
                            </TouchableOpacity>
                            <Text style={styles.modalTitle}>{activeQuiz.title}</Text>
                            <View style={{ width: 24 }} />
                        </View>

                        {!showResult ? (
                            <View style={styles.quizContent}>
                                <View style={styles.progressContainer}>
                                    <Text style={styles.questionCounter}>
                                        Question {currentQuestionIndex + 1} / {activeQuiz.questions.length}
                                    </Text>
                                    <View style={styles.quizProgressBar}>
                                        <View style={[
                                            styles.quizProgressFill,
                                            { width: `${((currentQuestionIndex + 1) / activeQuiz.questions.length) * 100}%` }
                                        ]} />
                                    </View>
                                </View>

                                <Text style={styles.questionText}>
                                    {activeQuiz.questions[currentQuestionIndex].text}
                                </Text>

                                <View style={styles.optionsContainer}>
                                    {activeQuiz.questions[currentQuestionIndex].options.map((option, idx) => {
                                        let btnStyle = styles.optionButton;
                                        let textStyle = styles.optionText;

                                        if (selectedOption) {
                                            if (option === activeQuiz.questions[currentQuestionIndex].correctAnswer) {
                                                btnStyle = styles.correctOption;
                                                textStyle = styles.whiteText;
                                            } else if (option === selectedOption) {
                                                btnStyle = styles.wrongOption;
                                                textStyle = styles.whiteText;
                                            }
                                        }

                                        return (
                                            <TouchableOpacity
                                                key={idx}
                                                style={btnStyle}
                                                onPress={() => handleAnswer(option)}
                                                disabled={!!selectedOption}
                                            >
                                                <Text style={textStyle}>{option}</Text>
                                                {selectedOption && option === activeQuiz.questions[currentQuestionIndex].correctAnswer && (
                                                    <Ionicons name="checkmark-circle" size={20} color="#fff" />
                                                )}
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>

                                {selectedOption && (
                                    <View style={styles.feedbackContainer}>
                                        <Text style={styles.feedbackTitle}>
                                            {isCorrect ? 'Correct!' : 'Incorrect'}
                                        </Text>
                                        <Text style={styles.feedbackText}>
                                            {activeQuiz.questions[currentQuestionIndex].explanation}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        ) : (
                            <View style={styles.resultContainer}>
                                <Ionicons name="ribbon" size={80} color="#f59e0b" />
                                <Text style={styles.resultTitle}>Quiz Complete!</Text>
                                <Text style={styles.resultScore}>
                                    You scored {score} out of {activeQuiz.questions.length}
                                </Text>
                                <Text style={styles.resultMessage}>
                                    {score === activeQuiz.questions.length ? 'Perfect Score! You are a master!' :
                                        score > activeQuiz.questions.length / 2 ? 'Good job! Keep practicing.' : 'Keep studying!'}
                                </Text>

                                <TouchableOpacity style={styles.restartButton} onPress={() => startQuiz('remedy', activeQuiz.title)}>
                                    <Text style={styles.restartButtonText}>Try Again</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                )}
            </Modal>
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
        fontSize: 28,
        fontWeight: 'bold',
        color: '#0f172a',
    },
    subtitle: {
        fontSize: 15,
        color: '#64748b',
        marginTop: 6,
        lineHeight: 22,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#0f172a',
        marginHorizontal: 16,
        marginTop: 8,
        marginBottom: 12,
    },
    modulesList: {
        paddingHorizontal: 16,
        gap: 10,
    },
    moduleCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 14,
    },
    moduleIcon: {
        width: 56,
        height: 56,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    moduleContent: {
        flex: 1,
    },
    moduleTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0f172a',
        marginBottom: 6,
    },
    moduleStats: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 8,
    },
    statBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    statText: {
        fontSize: 12,
        color: '#64748b',
    },
    progressBar: {
        height: 4,
        backgroundColor: '#e2e8f0',
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 2,
    },
    quizzesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 16,
        gap: 10,
    },
    quizCard: {
        width: '48%',
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
    },
    quizTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#0f172a',
        textAlign: 'center',
        marginTop: 10,
    },
    quizQuestions: {
        fontSize: 12,
        color: '#64748b',
        marginTop: 4,
    },
    challengeCard: {
        backgroundColor: '#fef3c7',
        marginHorizontal: 16,
        marginTop: 24,
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: '#fcd34d',
    },
    challengeHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    challengeTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#92400e',
    },
    challengeDescription: {
        fontSize: 14,
        color: '#78350f',
        lineHeight: 20,
        marginBottom: 14,
    },
    challengeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f59e0b',
        paddingVertical: 12,
        borderRadius: 10,
        gap: 8,
    },
    challengeButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#ffffff',
    },
    bottomSpacing: {
        height: 30,
    },
    // Quiz Styles
    modalContainer: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 10,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
        justifyContent: 'space-between'
    },
    closeButton: {
        padding: 8,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1e293b',
    },
    quizContent: {
        padding: 20,
        flex: 1,
    },
    progressContainer: {
        marginBottom: 24,
    },
    questionCounter: {
        fontSize: 14,
        color: '#64748b',
        fontWeight: '600',
        marginBottom: 8,
    },
    quizProgressBar: {
        height: 6,
        backgroundColor: '#e2e8f0',
        borderRadius: 3,
        overflow: 'hidden',
    },
    quizProgressFill: {
        height: '100%',
        backgroundColor: '#0ea5e9',
        borderRadius: 3,
    },
    questionText: {
        fontSize: 22,
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: 32,
        lineHeight: 32,
    },
    optionsContainer: {
        gap: 12,
    },
    optionButton: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    correctOption: {
        backgroundColor: '#22c55e',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#16a34a',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    wrongOption: {
        backgroundColor: '#ef4444',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#dc2626',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    optionText: {
        fontSize: 16,
        color: '#334155',
        fontWeight: '500',
        flex: 1,
    },
    whiteText: {
        fontSize: 16,
        color: '#ffffff',
        fontWeight: '600',
        flex: 1,
    },
    feedbackContainer: {
        marginTop: 24,
        backgroundColor: '#f1f5f9',
        padding: 16,
        borderRadius: 12,
    },
    feedbackTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 4,
        color: '#0f172a',
    },
    feedbackText: {
        fontSize: 14,
        color: '#475569',
        lineHeight: 20,
    },
    resultContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
    },
    resultTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#0f172a',
        marginTop: 24,
        marginBottom: 8,
    },
    resultScore: {
        fontSize: 20,
        color: '#0ea5e9',
        fontWeight: '600',
        marginBottom: 16,
    },
    resultMessage: {
        fontSize: 16,
        color: '#64748b',
        textAlign: 'center',
        marginBottom: 32,
    },
    restartButton: {
        backgroundColor: '#0ea5e9',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 30,
    },
    restartButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    }
});
