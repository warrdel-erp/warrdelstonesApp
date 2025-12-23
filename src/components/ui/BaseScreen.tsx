import React from 'react';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import theme from '../../theme';

interface BaseScreenProps {
  children: React.ReactNode;
  backgroundColor?: string;
  scrollable?: boolean;
  style?: ViewStyle;
  keyboardAware?: boolean; // Optional prop to enable keyboard awareness
}

export const BaseScreen: React.FC<BaseScreenProps> = ({
  children,
  backgroundColor = theme.colors.background,
  style,
  scrollable = false,
  keyboardAware = true,
}) => {
  const insets = useSafeAreaInsets();
  return keyboardAware ? (
    <KeyboardAwareScrollView
      enableOnAndroid={true}
      // scrollEnabled={scrollable}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps={'handled'}
      style={{ flex: 1 }}
      contentContainerStyle={[
        styles.container,
        {
          backgroundColor,
        },
        style,
      ]}>
      {scrollable && <ScrollView showsVerticalScrollIndicator={false}>{children}</ScrollView>}
      {!scrollable && children}
    </KeyboardAwareScrollView>
  ) : (
    <View
      style={[
        styles.container,
        {
          backgroundColor,
        },
        style,
      ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default BaseScreen;
