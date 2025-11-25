import React, { useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import theme, { textStyles } from '../theme';
import TextInput from './ui/TextInput.tsx';
import { useScreenContext } from '../context/ScreenContext.tsx';
import IconButton from './ui/IconButton.tsx';
import NavigationService from '../navigation/NavigationService.ts';

interface SearchBarHeaderProps {
  title?: string;
  subtitle?: string;
  showMenuButton?: boolean;
  searchPlaceholder?: string;
  navigation: any;
  onSearch?: (query: string) => void;
}

export const SearchBarHeader: React.FC<SearchBarHeaderProps> = props => {
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState('');
  const { actions } = useScreenContext();

  const handleMenuPress = () => {
    props.navigation.openDrawer();
  };

  const toggleSearchMode = () => {
    setSearching(prev => !prev);
    setQuery('');
    actions.onSearch?.('');
  };

  const handleSearch = () => {
    actions.onSearch?.(query.trim());
  };

  const handleBackPress = () => {
    // Use NavigationService for proper back navigation
    NavigationService.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        {!props.showMenuButton ? (
          <TouchableOpacity style={styles.iconButton} onPress={handleBackPress} activeOpacity={0.7}>
            <Icon name="arrow-back" size={24} color={theme.colors.text.onPrimary} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.iconButton} onPress={handleMenuPress} activeOpacity={0.7}>
            <Icon name="menu" size={24} color={theme.colors.text.onPrimary} />
          </TouchableOpacity>
        )}
        )
      </View>

      {!searching && (
        <View style={styles.centerSection}>
          {props.title && <Text style={styles.parentMenuText}>{props.title}</Text>}
          {props.subtitle && <Text style={styles.titleText}>{props.subtitle}</Text>}
        </View>
      )}
      {searching && (
        <View style={{ flex: 1, paddingHorizontal: theme.spacing.sm }}>
          <TextInput
            focusable={true}
            autoFocus={true}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
            style={{ backgroundColor: theme.colors.surface, minHeight: 40 }}
            placeholder={props.searchPlaceholder || 'Search...'}
          />
        </View>
      )}

      <View style={styles.rightSection}>
        <IconButton
          iconName={searching ? 'close' : 'search'}
          size={'medium'}
          variant={'plain'}
          onPress={toggleSearchMode}
          iconColor={theme.colors.text.onPrimary}
        />

        {/*<IconButton*/}
        {/*  iconName="display-settings"*/}
        {/*  variant={'plain'}*/}
        {/*  onPress={handleSettingPress}*/}
        {/*  iconColor={theme.colors.text.onPrimary}*/}
        {/*/>*/}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: theme.colors.surface,
    paddingTop: Platform.OS === 'ios' ? 0 : theme.spacing.md,
    paddingBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...theme.shadows.md,
  },
  leftSection: {
    width: 36,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 1,
    alignItems: 'flex-start',
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
  },
  rightSection: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  iconButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.borderRadius.sm,
  },
  parentMenuText: {
    ...textStyles.h6,
    color: theme.colors.text.onPrimary,
  },
  titleText: {
    ...textStyles.body2,
    color: theme.colors.text.onSurface,
  },
});
