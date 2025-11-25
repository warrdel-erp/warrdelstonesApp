import React, { useEffect, useRef } from 'react';
import { BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

interface UseBackHandlerOptions {
  onBackPress?: () => boolean; // Return true to prevent default back behavior
  enabled?: boolean; // Whether the handler is active
}

/**
 * Custom hook to handle hardware back button and provide callback for custom back handling
 * This is useful for forms that need to show confirmation dialogs before navigating away
 */
export const useBackHandler = (options: UseBackHandlerOptions = {}) => {
  const { onBackPress, enabled = true } = options;
  const handlerRef = useRef<(() => boolean) | null>(null);

  // Update the handler reference when onBackPress changes
  useEffect(() => {
    handlerRef.current = onBackPress || null;
  }, [onBackPress]);

  // Set up hardware back button handler when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      if (!enabled) return;

      const backAction = () => {
        if (handlerRef.current) {
          return handlerRef.current();
        }
        return false; // Allow default back behavior
      };

      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

      return () => backHandler.remove();
    }, [enabled]),
  );

  // Return the current handler for use in header components
  return {
    handleBackPress: () => {
      if (handlerRef.current) {
        return handlerRef.current();
      }
      return false;
    },
  };
};

export default useBackHandler;
