import React, { useState, useMemo } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { bodyParts, getBodyPartSymptomCounts } from '../utils/dataLoader';
import { searchBodyParts } from '../utils/search';
import { useAppStore } from '../store/useAppStore';
import BodyPartCard from '../components/BodyPartCard';
import SearchBar from '../components/SearchBar';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function BodyPartsScreen() {
    const navigation = useNavigation<NavigationProp>();
    const [searchQuery, setSearchQuery] = useState('');
    const { isBodyPartMastered } = useAppStore();
    const symptomCounts = useMemo(() => getBodyPartSymptomCounts(), []);

    const filteredBodyParts = useMemo(() => {
        return searchBodyParts(bodyParts, searchQuery);
    }, [searchQuery]);

    return (
        <View style={styles.container}>
            <SearchBar
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search body parts..."
            />

            <View style={styles.headerInfo}>
                <Text style={styles.headerText}>
                    {bodyParts.length} Body Part Categories
                </Text>
            </View>

            <FlatList
                data={filteredBodyParts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <BodyPartCard
                        bodyPart={item}
                        symptomCount={symptomCounts[item.id] || 0}
                        isMastered={isBodyPartMastered(item.id)}
                        onPress={() => navigation.navigate('BodyPartDetail', {
                            bodyPartId: item.id,
                            bodyPartName: item.name,
                        })}
                    />
                )}
                contentContainerStyle={styles.listContent}
                
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No body parts found</Text>
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
    headerInfo: {
        paddingHorizontal: 16,
        paddingBottom: 8,
    },
    headerText: {
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
    emptyText: {
        fontSize: 16,
        color: '#64748b',
    },
});
