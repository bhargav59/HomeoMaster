import React from 'react';
import { Text, TextStyle, StyleSheet, TextProps } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { getAllRemedies } from '../utils/dataLoader';

// Initialize lookup map once
const remedyMap = new Map<string, string>();
const remedies = getAllRemedies();

remedies.forEach(r => {
    if (r.name) remedyMap.set(r.name.toLowerCase(), r.id);
    if (r.abbrev) remedyMap.set(r.abbrev.toLowerCase(), r.id);
});

interface Props extends TextProps {
    text: string;
    style?: TextStyle;
}

export default function FormattedText({ text, style, ...props }: Props) {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    if (!text) return null;

    // Split by asterisks for bolding
    const parts = text.split('*');

    return (
        <Text style={style} {...props}>
            {parts.map((part, index) => {
                // Odd indices are the content between asterisks (bold candidates)
                if (index % 2 === 1) {
                    const cleanPart = part.trim();
                    const lowerPart = cleanPart.toLowerCase();

                    // Check if it's a remedy link
                    // Remove potential punctuation for matching (e.g. "Acon.")
                    const cleanName = lowerPart.replace('.', '');

                    // Try exact match, match without dot, or match with added dot (common abbrev style)
                    const remedyId = remedyMap.get(lowerPart) ||
                        remedyMap.get(cleanName) ||
                        remedyMap.get(lowerPart + '.');

                    if (remedyId) {
                        return (
                            <Text
                                key={index}
                                style={[styles.bold, styles.link]}
                                onPress={() => navigation.push('RemedyDetail', { remedyId })}
                            >
                                {part}
                            </Text>
                        );
                    }
                    return <Text key={index} style={styles.bold}>{part}</Text>;
                }

                // Even indices are normal text
                return <Text key={index}>{part}</Text>;
            })}
        </Text>
    );
}

const styles = StyleSheet.create({
    bold: {
        fontWeight: 'bold',
        color: '#1e293b',
    },
    link: {
        color: '#0369a1', // Darker blue for better visibility
        textDecorationLine: 'underline',
    }
});
