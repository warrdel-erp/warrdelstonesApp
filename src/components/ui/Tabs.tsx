import React, { useRef, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ViewStyle, TextStyle, ScrollView } from 'react-native';
import { theme } from '../../theme';

export interface TabItem {
  id: string;
  label: string;
  disabled?: boolean;
}

interface TabsProps {
  tabs: TabItem[];
  selectedIndex: number;
  onTabPress: (index: number, tab: TabItem) => void;
  variant?: 'default' | 'underline' | 'pill' | 'pill-outlined' | 'outlined';
  size?: 'small' | 'medium' | 'large';
  scrollable?: boolean;
  autoScroll?: boolean;
  style?: ViewStyle;
  tabStyle?: ViewStyle;
  activeTabStyle?: ViewStyle;
  textStyle?: TextStyle;
  activeTextStyle?: TextStyle;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  selectedIndex,
  onTabPress,
  variant = 'default',
  size = 'medium',
  scrollable = false,
  autoScroll = false,
  style,
  tabStyle,
  activeTabStyle,
  textStyle,
  activeTextStyle,
}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const tabRefs = useRef<(View | null)[]>([]);
  const isUserClickRef = useRef<boolean>(false);
  const [tabPositions, setTabPositions] = useState<{ x: number; width: number }[]>([]);

  useEffect(() => {
    if (
      autoScroll &&
      scrollable &&
      scrollViewRef.current &&
      !isUserClickRef.current &&
      tabPositions.length > 0
    ) {
      const selectedTabPosition = tabPositions[selectedIndex];
      if (selectedTabPosition && scrollViewRef.current) {
        const scrollViewWidth = 300; // Approximate scroll view width, you can make this dynamic
        const targetX = selectedTabPosition.x - scrollViewWidth / 2 + selectedTabPosition.width / 2;

        scrollViewRef.current.scrollTo({
          x: Math.max(0, targetX),
          animated: true,
        });
      }
    }

    // Reset the flag after handling the effect
    isUserClickRef.current = false;
  }, [selectedIndex, autoScroll, scrollable, tabPositions]);

  const handleTabLayout = (index: number, event: any) => {
    const { x, width } = event.nativeEvent.layout;
    setTabPositions(prev => {
      const newPositions = [...prev];
      newPositions[index] = { x, width };
      return newPositions;
    });
  };

  const getContainerStyle = (): ViewStyle => ({
    gap: variant === 'underline' ? 0 : theme.spacing.sm,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    paddingHorizontal: scrollable ? theme.spacing.sm : 0,
    borderRadius: variant === 'default' ? theme.borderRadius.md : 0,
    borderBottomWidth: variant === 'underline' ? 1 : 0,
    borderBottomColor: variant === 'underline' ? theme.colors.primary : theme.colors.primaryDark,
  });

  const getTabStyle = (_: number, isActive: boolean): ViewStyle => {
    const baseStyle: ViewStyle = {
      flex: scrollable ? 0 : 1,
      paddingHorizontal:
        size === 'small'
          ? theme.spacing.sm
          : size === 'large'
            ? theme.spacing.xl
            : theme.spacing.md,
      paddingVertical:
        size === 'small'
          ? theme.spacing.xs
          : size === 'large'
            ? theme.spacing.md
            : theme.spacing.sm,
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: scrollable ? 80 : undefined,
    };

    if (variant === 'default') {
      return {
        ...baseStyle,
        backgroundColor: isActive ? theme.colors.primaryDark : theme.colors.primaryLight,
        borderRadius: theme.borderRadius.sm,
      };
    }

    if (variant === 'underline') {
      return {
        ...baseStyle,
        borderBottomWidth: 2,
        backgroundColor: isActive ? theme.colors.primaryDark : theme.colors.primaryLight,
        borderBottomColor: isActive ? theme.colors.primary : theme.colors.primaryDark,
        marginBottom: -1,
      };
    }

    if (variant === 'pill') {
      return {
        ...baseStyle,
        backgroundColor: isActive ? theme.colors.primaryDark : theme.colors.primaryLight,
        borderRadius: theme.borderRadius.full,
        marginHorizontal: theme.spacing.xs,
      };
    }

    if (variant === 'pill-outlined') {
      return {
        ...baseStyle,
        backgroundColor: isActive ? theme.colors.primaryDark : 'transparent',
        borderRadius: theme.borderRadius.full,
        marginHorizontal: theme.spacing.xs,
        borderWidth: 1,
        borderColor: isActive ? theme.colors.primaryDark : theme.colors.primary,
      };
    }

    if (variant === 'outlined') {
      return {
        ...baseStyle,
        backgroundColor: isActive ? theme.colors.primaryDark : 'transparent',
        borderRadius: theme.borderRadius.sm,
        borderWidth: 1,
        borderColor: isActive ? theme.colors.primaryDark : theme.colors.primary,
      };
    }

    return baseStyle;
  };

  const getTextStyle = (isActive: boolean, isDisabled: boolean): TextStyle => {
    let color = theme.colors.text.secondary;

    if (isDisabled) {
      color = theme.colors.text.disabled;
    } else if (isActive) {
      color = theme.colors.text.onPrimary;
    } else if (variant === 'pill-outlined' || variant === 'outlined') {
      // For outlined variants, non-selected tabs should use primary color text
      color = theme.colors.primary;
    }

    return {
      fontSize:
        size === 'small'
          ? theme.typography.fontSize.sm
          : size === 'large'
            ? theme.typography.fontSize.lg
            : theme.typography.fontSize.base,
      fontFamily: isActive
        ? theme.typography.fontFamily.semiBold
        : theme.typography.fontFamily.medium,
      color,
      textAlign: 'center',
    };
  };

  const renderTab = (tab: TabItem, index: number) => {
    const isActive = index === selectedIndex;
    const isDisabled = tab.disabled || false;

    return (
      <TouchableOpacity
        key={tab.id}
        style={[getTabStyle(index, isActive), tabStyle, isActive && activeTabStyle]}
        onLayout={event => handleTabLayout(index, event)}
        onPress={() => {
          if (!isDisabled) {
            isUserClickRef.current = true; // Mark as user click
            onTabPress(index, tab);
          }
        }}
        disabled={isDisabled}
        activeOpacity={0.7}
        ref={ref => {
          tabRefs.current[index] = ref;
        }}>
        <Text style={[getTextStyle(isActive, isDisabled), textStyle, isActive && activeTextStyle]}>
          {tab.label}
        </Text>
      </TouchableOpacity>
    );
  };

  const TabContainer = scrollable ? ScrollView : View;
  const containerProps = scrollable
    ? {
        ref: scrollViewRef,
        horizontal: true,
        showsHorizontalScrollIndicator: false,
        contentContainerStyle: getContainerStyle(),
      }
    : {};

  return (
    <TabContainer {...containerProps} style={[!scrollable && getContainerStyle(), style]}>
      {tabs.map((tab, index) => renderTab(tab, index))}
    </TabContainer>
  );
};

export default Tabs;
