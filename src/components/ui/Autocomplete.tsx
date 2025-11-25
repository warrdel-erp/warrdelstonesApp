import React, { useState } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet, Text, ViewStyle } from 'react-native';
import { TextInput, TextInputProps } from './TextInput';
import { theme } from '../../theme';

export interface AutocompleteProps {
  items: { id: string | number; label: string; value?: any }[];
  onTextChange: (text: string) => void;
  onSelected: (item: { id: string | number; label: string; value?: any }) => void;
  inputProps?: TextInputProps;
  containerStyle?: ViewStyle;
}

export const Autocomplete: React.FC<AutocompleteProps> = ({
  items,
  onTextChange,
  onSelected,
  inputProps,
  containerStyle,
}) => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleChange = (text: string) => {
    setQuery(text);
    onTextChange(text);
    setShowSuggestions(!!text);
  };

  const handleSelect = (item: { id: string | number; label: string; value?: any }) => {
    setQuery(item.label);
    setShowSuggestions(false);
    onSelected(item);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <TextInput
        {...inputProps}
        value={query}
        onChangeText={handleChange}
        onFocus={() => setShowSuggestions(!!query)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
      />
      {showSuggestions && items.length > 0 && (
        <View style={styles.suggestionList}>
          <FlatList
            data={items}
            keyExtractor={item => String(item.id)}
            ItemSeparatorComponent={() => (
              <View style={{ height: 1, backgroundColor: theme.colors.border.medium }} />
            )}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.suggestionItem} onPress={() => handleSelect(item)}>
                <Text style={styles.suggestionText}>{item.label}</Text>
              </TouchableOpacity>
            )}
            keyboardShouldPersistTaps="handled"
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  suggestionList: {
    position: 'absolute',
    top: 56, // adjust based on TextInput height
    left: 0,
    right: 0,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 10,
    maxHeight: 200,
  },
  suggestionItem: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  suggestionText: {
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.base,
  },
});
