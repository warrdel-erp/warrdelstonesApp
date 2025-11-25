import React, { useState } from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAppDispatch, useAppState, useAuthState } from '../store/hooks.ts';
import theme, { textStyles } from '../theme';
import TextInput from './ui/TextInput.tsx';
import { useScreenContext } from '../context/ScreenContext.tsx';
import IconButton from './ui/IconButton.tsx';
import { Caption } from './ui';

interface HomeScreenHeaderProps {
  navigation: any;
  onSearch?: (query: string) => void;
  onSettingsPress?: () => void;
}

export const HomeScreenHeader: React.FC<HomeScreenHeaderProps> = props => {
  const { loginUserDetail } = useAuthState();
  const { selectedLocation } = useAppState();
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState('');
  const { actions } = useScreenContext();
  const handleMenuPress = () => {
    props.navigation.openDrawer();
  };

  const handleSettingPress = () => {
    actions.homeScreenActions?.onSettingsPress?.();
  };

  const toggleSearchMode = () => {
    setSearching(prev => !prev);
    setQuery('');
  };

  const handleSearch = () => {
    if (query.trim() === '') {
      return;
    }
    // Implement search logic here
    console.log('Searching for:', query);
  };

  const getSubtitle = () => {
    return 'Admin';
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <TouchableOpacity style={styles.iconButton} onPress={handleMenuPress} activeOpacity={0.7}>
          <Icon name="menu" size={24} color={theme.colors.white} />
        </TouchableOpacity>
        )
      </View>

      {/*{!searching && (*/}
      {/*  <View style={styles.centerSection}>*/}
      {/*    <Heading5 color={theme.colors.text.onPrimary}>Hi, {userName ?? ''}</Heading5>*/}
      {/*    <Caption color={theme.colors.text.onPrimary}>Admin | {subTitle}</Caption>*/}
      {/*  </View>*/}
      {/*)}*/}
      {searching && (
        <View style={{ flex: 1, paddingHorizontal: theme.spacing.sm }}>
          <TextInput
            focusable={true}
            autoFocus={true}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
            style={{ minHeight: 40 }}
            placeholder={'Search...'}
          />
        </View>
      )}

      <View style={styles.rightSection}>
        <IconButton
          iconName={searching ? 'close' : 'search'}
          size={'medium'}
          variant={'plain'}
          iconColor={theme.colors.text.onPrimary}
          onPress={toggleSearchMode}
        />
        {!searching && (
          <IconButton
            iconName={'shopping-cart'}
            size={'medium'}
            variant={'plain'}
            iconColor={theme.colors.text.onPrimary}
            onPress={() => {}}
          />
        )}

        {!searching && (
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 1,
              maxWidth: 100,
              width: 100,
              borderColor: theme.colors.white,
              padding: theme.spacing.xs,
              borderRadius: theme.borderRadius.md,
            }}
            onPress={handleSettingPress}>
            <Caption
              style={{ flex: 1 }}
              color={theme.colors.text.onPrimary}
              ellipsizeMode={'tail'}
              numberOfLines={1}>
              {selectedLocation?.location}
            </Caption>
            <Icon name={'keyboard-arrow-down'} color={theme.colors.white} size={20} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: theme.colors.primaryDark,
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
    gap: theme.spacing.sm,
    alignItems: 'center',
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
