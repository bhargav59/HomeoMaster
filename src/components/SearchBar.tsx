import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchBarProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    onClear?: () => void;
}

export default function SearchBar({
    value,
    onChangeText,
    placeholder = 'Search...',
    onClear
}: SearchBarProps) {
    return (
        <View style={styles.container}>
            <Ionicons name="search" size={20} color="#64748b" style={styles.icon} />
            <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor="#94a3b8"
                autoCapitalize="none"
                autoCorrect={false}
            />
            {value.length > 0 && (
                <TouchableOpacity
                    onPress={() => {
                        onChangeText('');
                        onClear?.();
                    }}
                    style={styles.clearButton}
                >
                    <Ionicons name="close-circle" size={20} color="#94a3b8" />
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 12,
        marginHorizontal: 16,
        marginVertical: 12,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    icon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        height: 48,
        fontSize: 16,
        color: '#0f172a',
    },
    clearButton: {
        padding: 4,
    },
});
