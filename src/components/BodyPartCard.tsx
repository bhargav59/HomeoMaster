import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BodyPart } from '../types';

interface BodyPartCardProps {
    bodyPart: BodyPart;
    symptomCount: number;
    isMastered: boolean;
    onPress: () => void;
}

const iconMapping: Record<string, keyof typeof Ionicons.glyphMap> = {
    'brain': 'happy',
    'head-side': 'help-circle',
    'eye': 'eye',
    'ear': 'ear',
    'nose': 'water',
    'teeth': 'medical',
    'lungs': 'cloud',
    'stomach': 'nutrition',
    'heart': 'heart',
    'spine': 'git-merge',
    'hand': 'hand-left',
    'foot': 'footsteps',
    'skin': 'sparkles',
    'kidney': 'water-outline',
    'female': 'female',
    'baby': 'happy-outline',
    'thermometer': 'thermometer',
    'moon': 'moon',
    'person': 'person',
};

export default function BodyPartCard({
    bodyPart,
    symptomCount,
    isMastered,
    onPress
}: BodyPartCardProps) {
    const iconName = iconMapping[bodyPart.icon] || 'body';

    return (
        <TouchableOpacity
            style={[styles.card, { borderLeftColor: bodyPart.color }]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={[styles.iconContainer, { backgroundColor: bodyPart.color + '20' }]}>
                <Ionicons name={iconName} size={28} color={bodyPart.color} />
                {isMastered && (
                    <View style={styles.masteredBadge}>
                        <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                    </View>
                )}
            </View>

            <View style={styles.content}>
                <Text style={styles.name}>{bodyPart.name}</Text>
                <Text style={styles.description} numberOfLines={2}>
                    {bodyPart.description}
                </Text>
                <View style={styles.footer}>
                    <View style={styles.countBadge}>
                        <Ionicons name="flask" size={12} color="#64748b" />
                        <Text style={styles.countText}>{symptomCount} remedies</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 14,
        marginHorizontal: 16,
        marginVertical: 6,
        borderLeftWidth: 4,
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
        position: 'relative',
    },
    masteredBadge: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: '#ffffff',
        borderRadius: 10,
    },
    content: {
        flex: 1,
    },
    name: {
        fontSize: 17,
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: 4,
    },
    description: {
        fontSize: 13,
        color: '#64748b',
        lineHeight: 18,
        marginBottom: 8,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    countBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#f1f5f9',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    countText: {
        fontSize: 12,
        color: '#64748b',
        fontWeight: '500',
    },
});
