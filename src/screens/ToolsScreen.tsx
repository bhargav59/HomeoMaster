import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function ToolsScreen() {
    const navigation = useNavigation<NavigationProp>();

    const tools = [
        {
            id: 'repertory',
            title: 'Repertory Tool',
            description: 'Select symptoms and find matching remedies ranked by relevance',
            icon: 'git-merge' as const,
            color: '#2563eb',
            bgColor: '#dbeafe',
            onPress: () => navigation.navigate('RepertoryTool'),
        },
        {
            id: 'case',
            title: 'Case Simulator',
            description: 'Practice with virtual patient cases and test your prescribing skills',
            icon: 'people' as const,
            color: '#16a34a',
            bgColor: '#dcfce7',
            onPress: () => { }, // navigation.navigate('CaseSimulator'),
        },
        {
            id: 'compare',
            title: 'Remedy Comparison',
            description: 'Compare two or more remedies side by side',
            icon: 'git-compare' as const,
            color: '#9333ea',
            bgColor: '#f3e8ff',
            onPress: () => { },
        },
        {
            id: 'modality',
            title: 'Modality Finder',
            description: 'Search remedies by their aggravations and ameliorations',
            icon: 'options' as const,
            color: '#ea580c',
            bgColor: '#ffedd5',
            onPress: () => { },
        },
    ];

    return (
        <ScrollView style={styles.container} >
            <View style={styles.header}>
                <Text style={styles.title}>Clinical Tools</Text>
                <Text style={styles.subtitle}>
                    Practical tools to help you find and select the right remedy
                </Text>
            </View>

            <View style={styles.toolsGrid}>
                {tools.map((tool) => (
                    <TouchableOpacity
                        key={tool.id}
                        style={styles.toolCard}
                        onPress={tool.onPress}
                        activeOpacity={0.7}
                    >
                        <View style={[styles.iconContainer, { backgroundColor: tool.bgColor }]}>
                            <Ionicons name={tool.icon} size={32} color={tool.color} />
                        </View>
                        <Text style={styles.toolTitle}>{tool.title}</Text>
                        <Text style={styles.toolDescription}>{tool.description}</Text>
                        <View style={styles.toolFooter}>
                            <Text style={[styles.openText, { color: tool.color }]}>Open</Text>
                            <Ionicons name="arrow-forward" size={16} color={tool.color} />
                        </View>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.comingSoon}>
                <Ionicons name="hammer" size={24} color="#64748b" />
                <Text style={styles.comingSoonText}>More tools coming soon!</Text>
            </View>
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
    toolsGrid: {
        paddingHorizontal: 16,
        gap: 12,
    },
    toolCard: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 20,
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 14,
    },
    toolTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: 6,
    },
    toolDescription: {
        fontSize: 14,
        color: '#64748b',
        lineHeight: 20,
        marginBottom: 12,
    },
    toolFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    openText: {
        fontSize: 14,
        fontWeight: '600',
    },
    comingSoon: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 30,
    },
    comingSoonText: {
        fontSize: 15,
        color: '#64748b',
        fontWeight: '500',
    },
});
