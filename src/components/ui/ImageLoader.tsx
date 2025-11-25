import React, { useState, useRef } from 'react';
import {
  View,
  Image,
  ActivityIndicator,
  ViewStyle,
  ImageStyle,
  ImageProps,
  StyleSheet,
  Text,
} from 'react-native';
import { theme } from '../../theme';

interface ImageLoaderProps extends Omit<ImageProps, 'source'> {
  source: string | { uri: string } | number;
  width?: number;
  height?: number;
  borderRadius?: number;
  placeholder?: React.ReactNode;
  placeholderColor?: string;
  placeholderText?: string;
  showLoadingIndicator?: boolean;
  loadingIndicatorColor?: string;
  loadingIndicatorSize?: 'small' | 'large';
  containerStyle?: ViewStyle;
  imageStyle?: ImageStyle;
  onLoadStart?: () => void;
  onLoadEnd?: () => void;
  onError?: (error: any) => void;
  fallbackSource?: string | { uri: string } | number;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
}

export const ImageLoader: React.FC<ImageLoaderProps> = ({
  source,
  width = 100,
  height = 100,
  borderRadius = theme.borderRadius.md,
  placeholder,
  placeholderColor = theme.colors.surface,
  placeholderText = '',
  showLoadingIndicator = true,
  loadingIndicatorColor = theme.colors.primary,
  loadingIndicatorSize = 'small',
  containerStyle,
  imageStyle,
  onLoadStart,
  onLoadEnd,
  onError,
  fallbackSource,
  resizeMode = 'cover',
  ...imageProps
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [imageSource, setImageSource] = useState(source);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleLoadStart = () => {
    setIsLoading(true);
    setHasError(false);

    // Clear any existing timeout
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }

    onLoadStart?.();
  };

  const handleLoadEnd = () => {
    setIsLoading(false);

    // Clear timeout when image loads
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = null;
    }

    onLoadEnd?.();
  };

  const handleError = (error: any) => {
    setIsLoading(false);
    setHasError(true);

    // Clear timeout on error
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = null;
    }

    onError?.(error);

    // Try fallback source if available
    if (fallbackSource && imageSource !== fallbackSource) {
      setImageSource(fallbackSource);
      setHasError(false);
    }
  };

  const getImageSource = () => {
    if (typeof imageSource === 'string') {
      return { uri: imageSource };
    }
    return imageSource;
  };

  const renderPlaceholder = () => {
    if (placeholder) {
      return placeholder;
    }

    return (
      <View style={[styles.placeholder, { backgroundColor: placeholderColor }]}>
        {placeholderText ? <Text style={styles.placeholderText}>{placeholderText}</Text> : null}
      </View>
    );
  };

  const renderLoadingIndicator = () => {
    if (!showLoadingIndicator) return null;

    // Only show loading indicator if we've been loading for more than 100ms
    if (isLoading) {
      if (!loadingTimeoutRef.current) {
        loadingTimeoutRef.current = setTimeout(() => {
          // Force re-render to show loading indicator
          setIsLoading(prev => prev);
        }, 100);
        return null; // Don't show initially
      }
    }

    if (!isLoading) return null;

    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={loadingIndicatorSize} color={loadingIndicatorColor} />
      </View>
    );
  };

  const containerStyles: ViewStyle = [
    styles.container,
    {
      width,
      height,
      borderRadius,
    },
    containerStyle,
  ];

  const imageStyles: ImageStyle = [
    styles.image,
    {
      width,
      height,
      borderRadius,
    },
    imageStyle,
  ];

  return (
    <View style={containerStyles}>
      {hasError ? (
        renderPlaceholder()
      ) : (
        <>
          <Image
            {...imageProps}
            source={getImageSource()}
            style={imageStyles}
            resizeMode={resizeMode}
            onLoadStart={handleLoadStart}
            onLoadEnd={handleLoadEnd}
            onError={handleError}
          />
          {renderLoadingIndicator()}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
  },
  placeholderText: {
    color: theme.colors.text.muted,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.regular,
    textAlign: 'center',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
});
