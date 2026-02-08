import React, { useState, useMemo } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { getSymptomsByBodyPart, getBodyPartById } from '../utils/dataLoader';
import { searchSymptomEntries } from '../utils/search';
import { useAppStore } from '../store/useAppStore';
import RemedyCard from '../components/RemedyCard';
import SearchBar from '../components/SearchBar';

type Props = NativeStackScreenProps<RootStackParamList, 'BodyPartDetail'>;

export default function BodyPartDetailScreen({ route, navigation }: Props) {
    const { bodyPartId } = route.params;
    const [searchQuery, setSearchQuery] = useState('');
    const bodyPart = getBodyPartById(bodyPartId);

    const symptomEntries = useMemo(() => {
        return getSymptomsByBodyPart(bodyPartId);
    }, [bodyPartId]);

    const filteredEntries = useMemo(() => {
        return searchSymptomEntries(symptomEntries, searchQuery);
    }, [symptomEntries, searchQuery]);

    return (
        <View style={styles.container}>
            {bodyPart && (
                <View style={[styles.headerCard, { borderLeftColor: bodyPart.color }]}>
                    <Text style={styles.headerTitle}>{bodyPart.name}</Text>
                    <Text style={styles.headerDescription}>{bodyPart.description}</Text>
                </View>
            )}

            <SearchBar
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search remedies in this body part..."
            />

            <View style={styles.countContainer}>
                <Text style={styles.countText}>
                    {filteredEntries.length} remedy {filteredEntries.length === 1 ? 'entry' : 'entries'}
                </Text>
            </View>

            <FlatList
                data={filteredEntries}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <RemedyCard
                        entry={item}
                        onPress={() => navigation.navigate('RemedyDetail', { remedyId: item.remedyId })}
                    />
                )}
                contentContainerStyle={styles.listContent}
                
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
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
    headerCard: {
        backgroundColor: '#ffffff',
        marginHorizontal: 16,
        marginTop: 16,
        padding: 16,
        borderRadius: 12,
        borderLeftWidth: 4,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#0f172a',
        marginBottom: 4,
    },
    headerDescription: {
        fontSize: 14,
        color: '#64748b',
        lineHeight: 20,
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
    listContent: {
        paddingBottom: 20,
    },
    emptyContainer: {
        padding: 40,
        alignItems: 'center',
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#334155',
        marginBottom: 4,
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#64748b',
    },
});
