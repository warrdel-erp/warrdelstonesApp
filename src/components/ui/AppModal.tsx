import React, { useEffect, useRef, ReactNode } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
  StatusBar,
  Platform,
  ViewStyle,
  TextStyle,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../../theme';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export interface AppModalProps {
  // Visibility
  visible: boolean;
  onClose: () => void;

  // Header content
  title?: string;
  subtitle?: string;
  showCloseButton?: boolean;

  // Behavior
  fullScreen?: boolean;
  useBottomSheet?: boolean; // New prop for bottom sheet
  animationType?: 'fade' | 'slide';
  dismissible?: boolean; // Control modal dismissibility
  dismissOnBackdropPress?: boolean; // Control backdrop dismiss
  dismissOnBackPress?: boolean; // Control Android back button dismiss
  renderInStatusBar?: boolean; // Control if modal should render in status bar area
  statusBarStyle?: 'light-content' | 'dark-content' | 'default'; // Status bar content style
  statusBarBackgroundColor?: string; // Status bar background color (Android)

  // Content
  children: ReactNode;

  // Styling
  containerStyle?: ViewStyle;
  headerStyle?: ViewStyle;
  contentStyle?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
  bottomSheetHeight?: number | string; // Height for bottom sheet

  // Callbacks
  onShow?: () => void;
  onDismiss?: () => void;

  // Accessibility
  testID?: string;
}

export const AppModal: React.FC<AppModalProps> = ({
  visible,
  onClose,
  title,
  subtitle,
  showCloseButton = true,
  fullScreen = false,
  useBottomSheet = false,
  animationType = 'fade',
  dismissible = true,
  dismissOnBackdropPress = true,
  dismissOnBackPress = true,
  renderInStatusBar = false,
  statusBarStyle = 'light-content',
  statusBarBackgroundColor = theme.colors.primaryDark,
  children,
  containerStyle,
  headerStyle,
  contentStyle,
  titleStyle,
  subtitleStyle,
  bottomSheetHeight = '60%',
  onShow,
  onDismiss,
  testID,
}) => {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  // Bottom sheet animation values
  const bottomSheetTranslateY = useRef(new Animated.Value(screenHeight)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  // Handle modal show
  useEffect(() => {
    if (visible) {
      // Handle status bar styling
      if (renderInStatusBar || fullScreen) {
        StatusBar.setBarStyle(statusBarStyle, true);
        if (Platform.OS === 'android' && statusBarBackgroundColor) {
          StatusBar.setBackgroundColor(statusBarBackgroundColor, true);
        }
      }

      // Start show animations
      if (useBottomSheet) {
        Animated.parallel([
          Animated.timing(backdropOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.spring(bottomSheetTranslateY, {
            toValue: 0,
            tension: 65,
            friction: 8,
            useNativeDriver: true,
          }),
        ]).start(() => {
          onShow?.();
        });
      } else if (animationType === 'fade') {
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
          }),
        ]).start(() => {
          onShow?.();
        });
      } else {
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.spring(slideAnim, {
            toValue: 0,
            tension: 65,
            friction: 8,
            useNativeDriver: true,
          }),
        ]).start(() => {
          onShow?.();
        });
      }
    }
  }, [
    visible,
    fadeAnim,
    slideAnim,
    scaleAnim,
    bottomSheetTranslateY,
    backdropOpacity,
    animationType,
    fullScreen,
    useBottomSheet,
    onShow,
    renderInStatusBar,
    statusBarStyle,
    statusBarBackgroundColor,
  ]);

  // Handle modal hide
  const handleClose = () => {
    // Restore status bar to default
    if (renderInStatusBar || fullScreen) {
      StatusBar.setBarStyle('light-content', true);
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor('transparent', true);
      }
    }

    // Start hide animations
    if (useBottomSheet) {
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(bottomSheetTranslateY, {
          toValue: screenHeight,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onClose();
        onDismiss?.();
      });
    } else if (animationType === 'fade') {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onClose();
        onDismiss?.();
      });
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: screenHeight,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onClose();
        onDismiss?.();
      });
    }
  };

  // Reset animation values when modal is closed
  useEffect(() => {
    if (!visible) {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.8);
      slideAnim.setValue(screenHeight);
      bottomSheetTranslateY.setValue(screenHeight);
      backdropOpacity.setValue(0);
    }
  }, [visible, fadeAnim, scaleAnim, slideAnim, bottomSheetTranslateY, backdropOpacity]);

  // Handle backdrop press
  const handleBackdropPress = () => {
    if (dismissOnBackdropPress) {
      handleClose();
    }
  };

  // Handle modal close (including Android back press)
  const handleRequestClose = () => {
    if (dismissible && dismissOnBackPress) {
      handleClose();
    }
    // If dismissOnBackPress is false, do nothing (modal won't close on back press)
  };

  // Get status bar height
  const getStatusBarHeight = () => {
    if (Platform.OS === 'ios') {
      return 44; // Standard iOS status bar height
    }
    return StatusBar.currentHeight || 24; // Android status bar height
  };

  // Calculate bottom sheet height
  const getBottomSheetHeight = () => {
    if (typeof bottomSheetHeight === 'string') {
      const percentage = parseInt(bottomSheetHeight.replace('%', ''));
      return (screenHeight * percentage) / 100;
    }
    return bottomSheetHeight;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleRequestClose}
      statusBarTranslucent={renderInStatusBar || fullScreen} // Enable translucent status bar
      testID={testID}>
      {/* Status Bar Area (when renderInStatusBar is true) */}
      {renderInStatusBar && (
        <Animated.View
          style={[
            styles.statusBarArea,
            {
              height: getStatusBarHeight(),
              backgroundColor: statusBarBackgroundColor || theme.colors.primary,
              opacity: useBottomSheet ? backdropOpacity : fadeAnim,
            },
          ]}>
          {/* You can add custom status bar content here */}
        </Animated.View>
      )}

      {useBottomSheet ? (
        // Bottom Sheet Layout
        <View style={styles.bottomSheetContainer}>
          <Animated.View style={[styles.bottomSheetBackdrop, { opacity: backdropOpacity }]} />
          <Pressable style={styles.bottomSheetBackdropTouchable} onPress={handleBackdropPress} />
          <Animated.View
            style={[
              styles.bottomSheetContent,
              {
                height: getBottomSheetHeight(),
                transform: [{ translateY: bottomSheetTranslateY }],
              },
              containerStyle,
            ]}>
            {/* Bottom Sheet Header */}
            {(title || subtitle || showCloseButton) && (
              <View style={[styles.bottomSheetHeader, headerStyle]}>
                <View style={styles.bottomSheetHandle} />
                <View style={styles.bottomSheetHeaderContent}>
                  <View style={styles.headerTextContainer}>
                    {title && (
                      <Text style={[styles.bottomSheetTitle, titleStyle]}>
                        {title}
                      </Text>
                    )}
                    {subtitle && (
                      <Text style={[styles.bottomSheetSubtitle, subtitleStyle]}>
                        {subtitle}
                      </Text>
                    )}
                  </View>
                  {showCloseButton && (
                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={handleClose}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      testID={`${testID}-close-button`}>
                      <Icon name="close" size={24} color={theme.colors.text.primary} />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}

            {/* Bottom Sheet Content */}
            <View style={[styles.bottomSheetBodyContent, contentStyle]}>
              {children}
            </View>
          </Animated.View>
        </View>
      ) : (
        // Regular Modal Layout
        <>
          {/* Backdrop */}
          <Animated.View
            style={[
              styles.backdrop,
              fullScreen && styles.fullScreenBackdrop,
              renderInStatusBar && styles.statusBarBackdrop,
              { opacity: fadeAnim },
            ]}>
            <TouchableOpacity
              style={StyleSheet.absoluteFillObject}
              activeOpacity={1}
              onPress={handleBackdropPress}
            />
          </Animated.View>

          {/* Modal Container */}
          <View
            style={[
              styles.container,
              fullScreen && styles.fullScreenContainer,
              renderInStatusBar && styles.statusBarContainer,
            ]}>
            <Animated.View
              style={[
                styles.modal,
                fullScreen ? styles.fullScreenModal : styles.centeredModal,
                renderInStatusBar && styles.statusBarModal,
                containerStyle,
                animationType === 'fade' && {
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }],
                },
                animationType === 'slide' && {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}>
              {/* Header */}
              {(title || subtitle || showCloseButton) && (
                <View style={[styles.header, fullScreen && styles.fullScreenHeader, headerStyle]}>
                  <View style={styles.headerContent}>
                    {title && (
                      <Text style={[styles.title, fullScreen && styles.fullScreenTitle, titleStyle]}>
                        {title}
                      </Text>
                    )}
                    {subtitle && (
                      <Text
                        style={[
                          styles.subtitle,
                          fullScreen && styles.fullScreenSubtitle,
                          subtitleStyle,
                        ]}>
                        {subtitle}
                      </Text>
                    )}
                  </View>

                  {showCloseButton && (
                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={handleClose}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      testID={`${testID}-close-button`}>
                      <Icon
                        name="close"
                        size={24}
                        color={fullScreen ? theme.colors.text.onPrimary : theme.colors.text.primary}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              )}

              {/* Content */}
              <View style={[styles.content, fullScreen && styles.fullScreenContent, contentStyle]}>
                {children}
              </View>
            </Animated.View>
          </View>
        </>
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  fullScreenBackdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  fullScreenContainer: {
    padding: 0,
  },
  modal: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.lg,
  },
  centeredModal: {
    maxWidth: screenWidth - theme.spacing.xl * 2,
    maxHeight: screenHeight * 0.9,
    width: '100%',
  },
  fullScreenModal: {
    width: screenWidth,
    height: screenHeight,
    borderRadius: 0,
    paddingTop: Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0, // Status bar height
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
    minHeight: 60,
  },
  fullScreenHeader: {
    backgroundColor: theme.colors.primaryDark,
    borderBottomColor: theme.colors.primaryDark,
    paddingTop: theme.spacing.md,
  },
  headerContent: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.semiBold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  fullScreenTitle: {
    color: theme.colors.text.onPrimary,
    fontSize: theme.typography.fontSize.xl,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.onSurface,
  },
  fullScreenSubtitle: {
    color: theme.colors.text.onPrimary,
    opacity: 0.9,
  },
  closeButton: {
    padding: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: 'transparent',
  },
  content: {
    padding: theme.spacing.lg,
  },
  fullScreenContent: {
    flex: 1,
    paddingTop: theme.spacing.md,
  },
  statusBarArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  statusBarBackdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  statusBarContainer: {
    paddingTop: 0,
  },
  statusBarModal: {
    marginTop: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  // Bottom Sheet Styles
  bottomSheetContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'stretch',
  },
  bottomSheetBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  bottomSheetBackdropTouchable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bottomSheetContent: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    width: '100%',
    maxHeight: '90%',
    ...theme.shadows.lg,
  },
  bottomSheetHeader: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
    alignItems: 'center',
  },
  bottomSheetHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  headerTextContainer: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  bottomSheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.border.medium,
    marginBottom: theme.spacing.sm,
  },
  bottomSheetTitle: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text.primary,
    fontFamily: theme.typography.fontFamily.semiBold,
    marginBottom: theme.spacing.xs,
  },
  bottomSheetSubtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.onSurface,
    fontFamily: theme.typography.fontFamily.regular,
  },
  bottomSheetBodyContent: {
    flex: 1,
    padding: theme.spacing.md,
  },
});

export default AppModal;
