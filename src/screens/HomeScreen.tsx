import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { bodyParts, getDailyTipRemedy, getAllRemedies } from '../utils/dataLoader';
import { useAppStore } from '../store/useAppStore';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
    const navigation = useNavigation<NavigationProp>();
    const [searchQuery, setSearchQuery] = useState('');
    const { progress } = useAppStore();

    const dailyRemedy = useMemo(() => getDailyTipRemedy(progress.dailyTipIndex), [progress.dailyTipIndex]);
    const totalRemedies = getAllRemedies().length;
    const masteredCount = progress.masteredBodyParts.length;
    const totalBodyParts = bodyParts.length;

    return (
        <ScrollView style={styles.container} >
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.greeting}>Welcome to</Text>
                <Text style={styles.title}>HomeoMaster</Text>
                <Text style={styles.subtitle}>BodyWise Homeopathy Learning</Text>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#64748b" />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search remedies, symptoms, body parts..."
                    placeholderTextColor="#94a3b8"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            {/* Progress Card */}
            <View style={styles.progressCard}>
                <View style={styles.progressHeader}>
                    <Ionicons name="trophy" size={24} color="#f59e0b" />
                    <Text style={styles.progressTitle}>Your Progress</Text>
                </View>
                <View style={styles.progressStats}>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{masteredCount}</Text>
                        <Text style={styles.statLabel}>/ {totalBodyParts} Body Parts</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{progress.favorites.length}</Text>
                        <Text style={styles.statLabel}>Favorites</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{totalRemedies}</Text>
                        <Text style={styles.statLabel}>Remedies</Text>
                    </View>
                </View>
                <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${(masteredCount / totalBodyParts) * 100}%` }]} />
                </View>
            </View>

            {/* Daily Remedy Tip */}
            <TouchableOpacity
                style={styles.dailyTipCard}
                onPress={() => navigation.navigate('RemedyDetail', { remedyId: dailyRemedy.id })}
            >
                <View style={styles.dailyTipBadge}>
                    <Ionicons name="bulb" size={16} color="#ffffff" />
                    <Text style={styles.dailyTipBadgeText}>Daily Remedy</Text>
                </View>
                <Text style={styles.dailyRemedyName}>{dailyRemedy.name}</Text>
                <Text style={styles.dailyRemedyAbbrev}>{dailyRemedy.abbrev}</Text>
                <Text style={styles.dailyRemedyEssence} numberOfLines={2}>
                    {dailyRemedy.essence}
                </Text>
                <View style={styles.dailyTipKeynotes}>
                    {dailyRemedy.keynotes.slice(0, 3).map((keynote, index) => (
                        <View key={index} style={styles.keynoteTag}>
                            <Text style={styles.keynoteText}>{keynote}</Text>
                        </View>
                    ))}
                </View>
                <View style={styles.tapHint}>
                    <Text style={styles.tapHintText}>Tap to learn more</Text>
                    <Ionicons name="chevron-forward" size={16} color="#0ea5e9" />
                </View>
            </TouchableOpacity>

            {/* Quick Access Cards */}
            <Text style={styles.sectionTitle}>Quick Access</Text>
            <View style={styles.quickAccessGrid}>
                <TouchableOpacity
                    style={[styles.quickCard, { backgroundColor: '#dbeafe' }]}
                    onPress={() => navigation.navigate('RepertoryTool')}
                >
                    <Ionicons name="git-merge" size={32} color="#2563eb" />
                    <Text style={styles.quickCardTitle}>Repertory</Text>
                    <Text style={styles.quickCardSubtitle}>Find remedies</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.quickCard, { backgroundColor: '#dcfce7' }]}
                    onPress={() => navigation.navigate('CaseSimulator')}
                >
                    <Ionicons name="people" size={32} color="#16a34a" />
                    <Text style={styles.quickCardTitle}>Case Study</Text>
                    <Text style={styles.quickCardSubtitle}>Practice cases</Text>
                </TouchableOpacity>
            </View>

            {/* Popular Body Parts */}
            <Text style={styles.sectionTitle}>Popular Body Parts</Text>
            <ScrollView   style={styles.horizontalScroll}>
                {bodyParts.slice(0, 6).map((bp) => (
                    <TouchableOpacity
                        key={bp.id}
                        style={[styles.bodyPartChip, { borderColor: bp.color }]}
                        onPress={() => navigation.navigate('BodyPartDetail', {
                            bodyPartId: bp.id,
                            bodyPartName: bp.name
                        })}
                    >
                        <View style={[styles.chipDot, { backgroundColor: bp.color }]} />
                        <Text style={styles.chipText}>{bp.name}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

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
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
    },
    greeting: {
        fontSize: 14,
        color: '#64748b',
        marginBottom: 4,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#0ea5e9',
    },
    subtitle: {
        fontSize: 16,
        color: '#475569',
        marginTop: 4,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        marginHorizontal: 16,
        marginVertical: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
        color: '#0f172a',
    },
    progressCard: {
        backgroundColor: '#ffffff',
        marginHorizontal: 16,
        borderRadius: 16,
        padding: 16,
    },
    progressHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 8,
    },
    progressTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0f172a',
    },
    progressStats: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 12,
    },
    statItem: {
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0ea5e9',
    },
    statLabel: {
        fontSize: 12,
        color: '#64748b',
        marginTop: 2,
    },
    statDivider: {
        width: 1,
        backgroundColor: '#e2e8f0',
    },
    progressBar: {
        height: 8,
        backgroundColor: '#e2e8f0',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#10b981',
        borderRadius: 4,
    },
    dailyTipCard: {
        backgroundColor: '#0ea5e9',
        marginHorizontal: 16,
        marginTop: 16,
        borderRadius: 16,
        padding: 20,
    },
    dailyTipBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        gap: 6,
        marginBottom: 12,
    },
    dailyTipBadgeText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: '600',
    },
    dailyRemedyName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    dailyRemedyAbbrev: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        marginBottom: 8,
    },
    dailyRemedyEssence: {
        fontSize: 15,
        color: 'rgba(255,255,255,0.95)',
        lineHeight: 22,
        marginBottom: 12,
    },
    dailyTipKeynotes: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
        marginBottom: 12,
    },
    keynoteTag: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    keynoteText: {
        color: '#ffffff',
        fontSize: 12,
    },
    tapHint: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 4,
    },
    tapHintText: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 13,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#0f172a',
        marginHorizontal: 16,
        marginTop: 24,
        marginBottom: 12,
    },
    quickAccessGrid: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        gap: 12,
    },
    quickCard: {
        flex: 1,
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
    },
    quickCardTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0f172a',
        marginTop: 8,
    },
    quickCardSubtitle: {
        fontSize: 12,
        color: '#64748b',
        marginTop: 2,
    },
    horizontalScroll: {
        paddingLeft: 16,
    },
    bodyPartChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 20,
        marginRight: 10,
        borderWidth: 1.5,
        gap: 8,
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
    bottomSpacing: {
        height: 30,
    },
});
