import React, { useRef, useState } from 'react';
import {
  Animated,
  Platform,
  Text,
  TextStyle,
  TouchableOpacity,
  UIManager,
  View,
  ViewStyle
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { textStyles, theme } from '../../theme';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface AccordionProps {
  title?: string;
  header?: React.ReactNode;
  children: React.ReactNode;
  expanded?: boolean;
  onToggle?: (expanded: boolean) => void;
  style?: ViewStyle;
  headerStyle?: ViewStyle;
  contentStyle?: ViewStyle;
  titleStyle?: TextStyle;
  disabled?: boolean;
  icon?: React.ReactNode;
  showArrow?: boolean;
  animationDuration?: number;
}

/**
 * @deprecated
 */
export const Accordion: React.FC<AccordionProps> = ({
  title,
  header,
  children,
  expanded = false,
  onToggle,
  style,
  headerStyle,
  contentStyle,
  titleStyle,
  disabled = false,
  icon,
  showArrow = true,
  animationDuration = 300,
}) => {
  const [isExpanded, setIsExpanded] = useState(expanded);
  const animatedHeight = useRef(new Animated.Value(expanded ? 1 : 0)).current;
  const rotateAnimation = useRef(new Animated.Value(expanded ? 1 : 0)).current;
  const [contentHeight, setContentHeight] = useState(0);
  const [measurementComplete, setMeasurementComplete] = useState(false);

  // Update expanded state when prop changes
  React.useEffect(() => {
    if (expanded !== isExpanded) {
      setIsExpanded(expanded);
      animateToState(expanded);
    }
  }, [expanded]);

  const animateToState = (newExpandedState: boolean) => {
    // Animate height
    Animated.timing(animatedHeight, {
      toValue: newExpandedState ? 1 : 0,
      duration: animationDuration,
      useNativeDriver: false,
    }).start();

    // Animate arrow rotation
    Animated.timing(rotateAnimation, {
      toValue: newExpandedState ? 1 : 0,
      duration: animationDuration,
      useNativeDriver: true,
    }).start();
  };

  const toggleAccordion = () => {
    if (disabled) return;

    const newExpandedState = !isExpanded;
    setIsExpanded(newExpandedState);
    onToggle?.(newExpandedState);

    animateToState(newExpandedState);
  };

  const onContentLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    if (height > 0 && !measurementComplete) {
      setContentHeight(height);
      setMeasurementComplete(true);

      // If initially expanded, set the height immediately
      if (isExpanded) {
        animatedHeight.setValue(1);
      }
    }
  };

  const rotateInterpolate = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const heightInterpolate = animatedHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [0, contentHeight],
  });

  const accordionStyles = {
    container: [
      {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.medium,
        borderWidth: 1,
        borderColor: theme.colors.border.light,
        overflow: 'hidden',
      },
      style,
    ] as ViewStyle,
    header: [
      {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        justifyContent: 'space-between' as const,
        // padding: theme.spacing.md,
        backgroundColor: theme.colors.surface,
      },
      disabled && {
        opacity: 0.6,
      },
      headerStyle,
    ] as ViewStyle,
    title: [
      textStyles.body1,
      {
        flex: 1,
        color: theme.colors.text.primary,
        fontWeight: '500' as const,
      },
      titleStyle,
    ] as TextStyle,
    headerContent: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      flex: 1,
      gap: theme.spacing.sm,
    } as ViewStyle,
    customHeader: {
      flex: 1,
    } as ViewStyle,
    arrow: {
      marginLeft: theme.spacing.sm,
    } as ViewStyle,
    contentContainer: [
      {
        overflow: 'hidden' as const,
      },
    ] as ViewStyle,
    content: [
      {
        // padding: theme.spacing.md,
        paddingTop: 0,
        backgroundColor: theme.colors.surface,
      },
      contentStyle,
    ] as ViewStyle,
  };

  const ArrowIcon = () => (
    <Animated.View
      style={[
        accordionStyles.arrow,
        {
          transform: [{ rotate: rotateInterpolate }],
        },
      ]}>
      <Icon name={'keyboard-arrow-down'} size={24} />
    </Animated.View>
  );

  const renderHeader = () => {
    if (header) {
      return (
        <View style={accordionStyles.customHeader}>
          {header}
        </View>
      );
    }

    return (
      <View style={accordionStyles.headerContent}>
        {icon && icon}
        <Text style={accordionStyles.title}>{title}</Text>
      </View>
    );
  };

  return (
    <View style={accordionStyles.container}>
      <TouchableOpacity
        style={accordionStyles.header}
        onPress={toggleAccordion}
        disabled={disabled}
        activeOpacity={0.7}>
        {renderHeader()}
        {showArrow && <ArrowIcon />}
      </TouchableOpacity>

      <Animated.View
        style={[
          accordionStyles.contentContainer,
          {
            height: measurementComplete ? heightInterpolate : 'auto',
            opacity: measurementComplete ? 1 : 0,
          },
        ]}>
        <View onLayout={onContentLayout} style={accordionStyles.content}>
          {children}
        </View>
      </Animated.View>
    </View>
  );
};

// Accordion Group Component for managing multiple accordions
interface AccordionGroupProps {
  children: React.ReactNode;
  allowMultiple?: boolean;
  style?: ViewStyle;
  gap?: number;
}


/**
 * @deprecated
 */
export const AccordionGroup: React.FC<AccordionGroupProps> = ({
  children,
  allowMultiple = false,
  style,
  gap = theme.spacing.md,
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  const handleToggle = (index: number, expanded: boolean) => {
    const newExpandedItems = new Set(expandedItems);

    if (expanded) {
      if (!allowMultiple) {
        newExpandedItems.clear();
      }
      newExpandedItems.add(index);
    } else {
      newExpandedItems.delete(index);
    }

    setExpandedItems(newExpandedItems);
  };

  const groupStyles = {
    container: [
      {
        gap: gap,
      },
      style,
    ] as ViewStyle,
  };

  return (
    <View style={groupStyles.container}>
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child) && child.type === Accordion) {
          return React.cloneElement(child, {
            expanded: expandedItems.has(index),
            onToggle: (expanded: boolean) => {
              handleToggle(index, expanded);
              child.props.onToggle?.(expanded);
            },
          });
        }
        return child;
      })}
    </View>
  );
};
