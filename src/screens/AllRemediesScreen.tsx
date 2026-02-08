import React, { useState, useMemo } from 'react';
import { View, Text, SectionList, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types';
import { getAllRemedies } from '../utils/dataLoader';
import { searchRemedies, groupRemediesByLetter } from '../utils/search';
import { useAppStore } from '../store/useAppStore';
import SearchBar from '../components/SearchBar';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function AllRemediesScreen() {
    const navigation = useNavigation<NavigationProp>();
    const [searchQuery, setSearchQuery] = useState('');
    const { isFavorite } = useAppStore();

    const allRemedies = useMemo(() => getAllRemedies(), []);

    const filteredRemedies = useMemo(() => {
        return searchRemedies(allRemedies, searchQuery);
    }, [allRemedies, searchQuery]);

    const groupedRemedies = useMemo(() => {
        return groupRemediesByLetter(filteredRemedies);
    }, [filteredRemedies]);

    return (
        <View style={styles.container}>
            <SearchBar
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search by name, keynotes, or indications..."
            />

            <View style={styles.countContainer}>
                <Text style={styles.countText}>
                    {filteredRemedies.length} of {allRemedies.length} remedies
                </Text>
            </View>

            <SectionList
                sections={groupedRemedies}
                keyExtractor={(item) => item.id}
                renderSectionHeader={({ section }) => (
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionHeaderText}>{section.title}</Text>
                    </View>
                )}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.remedyItem}
                        onPress={() => navigation.navigate('RemedyDetail', { remedyId: item.id })}
                        activeOpacity={0.7}
                    >
                        <View style={styles.remedyInfo}>
                            <Text style={styles.remedyName}>{item.name}</Text>
                            <Text style={styles.remedyAbbrev}>{item.abbrev}</Text>
                            <Text style={styles.remedyEssence} numberOfLines={1}>
                                {item.essence}
                            </Text>
                        </View>
                        <View style={styles.remedyRight}>
                            {isFavorite(item.id) && (
                                <Ionicons name="heart" size={18} color="#ef4444" />
                            )}
                            <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
                        </View>
                    </TouchableOpacity>
                )}
                
                
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="flask-outline" size={48} color="#94a3b8" />
                        <Text style={styles.emptyTitle}>No remedies found</Text>
                        <Text style={styles.emptySubtitle}>Try a different search term</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f9ff',
    },
    countContainer: {
        paddingHorizontal: 16,
        paddingBottom: 8,
    },
    countText: {
        fontSize: 13,
        color: '#64748b',
        fontWeight: '500',
    },
    sectionHeader: {
        backgroundColor: '#e0f2fe',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    sectionHeaderText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0369a1',
    },
    remedyItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    remedyInfo: {
        flex: 1,
    },
    remedyName: {
        fontSize: 17,
        fontWeight: '600',
        color: '#0f172a',
    },
    remedyAbbrev: {
        fontSize: 13,
        color: '#0ea5e9',
        marginTop: 2,
    },
    remedyEssence: {
        fontSize: 13,
        color: '#64748b',
        marginTop: 4,
    },
    remedyRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    listContent: {
        paddingBottom: 20,
    },
    emptyContainer: {
        padding: 60,
        alignItems: 'center',
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#334155',
        marginTop: 12,
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#64748b',
        marginTop: 4,
    },
});
