import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SymptomEntry } from '../types';

interface RemedyCardProps {
    entry: SymptomEntry;
    onPress: () => void;
}

export default function RemedyCard({ entry, onPress }: RemedyCardProps) {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
            <View style={styles.header}>
                <Text style={styles.remedyName}>{entry.remedyName}</Text>
                <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
            </View>

            <View style={styles.dosageRow}>
                <View style={styles.potencyBadge}>
                    <Text style={styles.potencyText}>{entry.potency}</Text>
                </View>
                <Text style={styles.doseText}>{entry.dose}</Text>
            </View>

            <Text style={styles.indication} numberOfLines={3}>
                {entry.indication}
            </Text>

            <View style={styles.modalitiesContainer}>
                <View style={styles.modalityRow}>
                    <View style={styles.aggBadge}>
                        <Text style={styles.modalityLabel}>Agg ↓</Text>
                    </View>
                    <Text style={styles.modalityText} numberOfLines={2}>{entry.agg}</Text>
                </View>

                <View style={styles.modalityRow}>
                    <View style={styles.amelBadge}>
                        <Text style={styles.modalityLabel}>Amel ↑</Text>
                    </View>
                    <Text style={styles.modalityText} numberOfLines={2}>{entry.amel}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 16,
        marginHorizontal: 16,
        marginVertical: 8,
        borderLeftWidth: 4,
        borderLeftColor: '#0ea5e9',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    remedyName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#0f172a',
    },
    dosageRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        flexWrap: 'wrap',
        gap: 8,
    },
    potencyBadge: {
        backgroundColor: '#dbeafe',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    potencyText: {
        color: '#1d4ed8',
        fontSize: 13,
        fontWeight: '600',
    },
    doseText: {
        color: '#64748b',
        fontSize: 13,
        flex: 1,
    },
    indication: {
        fontSize: 15,
        color: '#334155',
        lineHeight: 22,
        marginBottom: 12,
    },
    modalitiesContainer: {
        gap: 8,
    },
    modalityRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
    },
    aggBadge: {
        backgroundColor: '#fee2e2',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
        minWidth: 55,
        alignItems: 'center',
    },
    amelBadge: {
        backgroundColor: '#dcfce7',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
        minWidth: 55,
        alignItems: 'center',
    },
    modalityLabel: {
        fontSize: 11,
        fontWeight: '600',
        color: '#374151',
    },
    modalityText: {
        fontSize: 13,
        color: '#64748b',
        flex: 1,
        lineHeight: 18,
    },
});
