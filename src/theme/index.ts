import { FontConfig } from './FontConfig.ts';

export interface Theme {
  colors: {
    primary: string;
    primaryDark: string;
    primaryLight: string;
    secondary: string;
    secondaryDark: string;
    secondaryLight: string;
    background: string;
    surface: string;
    surfaceVariant: string;
    white: string;
    button: string;
    yellow: string;
    link: string;
    transparent: string;
    black: string;
    text: {
      primary: string;
      secondary: string;
      highlight: string;
      disabled: string;
      onPrimary: string;
      caption: string;
      green: string;
      onSurface: string;
      muted: string;
    };
    border: {
      light: string;
      medium: string;
      dark: string;
    };
    status: {
      success: string;
      warning: string;
      error: string;
      info: string;
      disabled: string;
    };
    shadow: string;
  };
  typography: {
    fontFamily: {
      thin: string;
      extraLight: string;
      light: string;
      regular: string;
      medium: string;
      semiBold: string;
      bold: string;
      extraBold: string;
      black: string;
    };
    fontSize: {
      xs: number;
      sm: number;
      base: number;
      lg: number;
      xl: number;
      '2xl': number;
      '3xl': number;
      '4xl': number;
    };
    lineHeight: {
      tight: number;
      normal: number;
      relaxed: number;
    };
    fontWeight: {
      thin: '100';
      extraLight: '200';
      light: '300';
      normal: '400';
      medium: '500';
      semiBold: '600';
      bold: '700';
      extraBold: '800';
      black: '900';
    };
  };
  spacing: {
    none: number;
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    '2xl': number;
    '3xl': number;
  };
  borderRadius: {
    none: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    full: number;
  };
  shadows: {
    sm: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
    md: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
    lg: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
  };
}

export const theme: Theme = {
  colors: {
    primary: '#0891B2',
    primaryDark: '#1F2937',
    primaryLight: '#06B6D4',
    secondary: '#14B8A6',
    secondaryDark: '#0D9488',
    secondaryLight: '#2DD4BF',
    transparent: 'transparent',
    black: '#000',
    button: '#0891B2',
    yellow: '#F59E0B',

    // Background colors
    background: '#FAFBFC',
    surface: '#FFFFFF',
    surfaceVariant: '#F8F9FA',
    white: '#FFFFFF',
    link: '#0891B2',
    // Text colors
    text: {
      primary: '#1F2937',
      secondary: '#6B7280',
      highlight: '#0891B2',
      disabled: '#9CA3AF',
      onPrimary: '#FFFFFF',
      caption: '#9CA3AF',
      green: '#059669',
      onSurface: '#1F2937',
      muted: '#F9FAFB',
    },

    // Border colors
    border: {
      light: '#F3F4F6',
      medium: '#E5E7EB',
      dark: '#D1D5DB',
    },

    // Status colors
    status: {
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#06B6D4',
      disabled: '#D1D5DB',
    },

    // Shadow color
    shadow: '#000000',
  },

  typography: {
    fontFamily: {
      thin: FontConfig.Thin,
      extraLight: FontConfig.ExtraLight,
      light: FontConfig.Light,
      regular: FontConfig.Regular,
      medium: FontConfig.Medium,
      semiBold: FontConfig.SemiBold,
      bold: FontConfig.Bold,
      extraBold: FontConfig.ExtraBold,
      black: FontConfig.Black,
    },

    fontSize: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30,
      '4xl': 36,
    },

    // FIXED: LineHeight values now in pixels instead of multipliers
    lineHeight: {
      tight: 20, // For headings - tighter spacing
      normal: 24, // For body text - comfortable reading
      relaxed: 28, // For larger text - more breathing room
    },

    fontWeight: {
      thin: '100',
      extraLight: '200',
      light: '300',
      normal: '400',
      medium: '500',
      semiBold: '600',
      bold: '700',
      extraBold: '800',
      black: '900',
    },
  },

  spacing: {
    none: 0,
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
    '3xl': 64,
  },

  borderRadius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },

  shadows: {
    sm: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    lg: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
  },
};

// Typography styles for common text elements - Updated to use Lato fonts
export const textStyles = {
  h1: {
    fontSize: theme.typography.fontSize['4xl'],
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
  },
  h2: {
    fontSize: theme.typography.fontSize['3xl'],
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
  },
  h3: {
    fontSize: theme.typography.fontSize['2xl'],
    fontFamily: theme.typography.fontFamily.semiBold,
    color: theme.colors.text.primary,
  },
  h4: {
    fontSize: theme.typography.fontSize.xl,
    fontFamily: theme.typography.fontFamily.semiBold,
    color: theme.colors.text.primary,
  },
  h5: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.primary,
  },
  h6: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.primary,
  },
  body1: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.primary,
  },
  body2: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.secondary,
  },
  caption: {
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.secondary,
  },
  button: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.onPrimary,
  },
  overline: {
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.secondary,
    textTransform: 'uppercase' as const,
    letterSpacing: 1.5,
  },
};

// Common component styles
export const componentStyles = {
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    ...theme.shadows.sm,
  },
  cardElevated: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    ...theme.shadows.md,
  },
  button: {
    disabled: {
      backgroundColor: theme.colors.status.disabled,
      borderRadius: theme.borderRadius.md,
      paddingVertical: theme.spacing.lg,
      paddingHorizontal: theme.spacing.lg,
      ...theme.shadows.sm,
    },
    primary: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.md,
      paddingVertical: theme.spacing.lg,
      paddingHorizontal: theme.spacing.lg,
      ...theme.shadows.sm,
    },
    secondary: {
      backgroundColor: theme.colors.secondary,
      borderRadius: theme.borderRadius.md,
      paddingVertical: theme.spacing.lg,
      paddingHorizontal: theme.spacing.lg,
      ...theme.shadows.sm,
    },
    text: {
      backgroundColor: theme.colors.transparent,
      borderRadius: theme.borderRadius.md,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: theme.colors.primary,
      borderRadius: theme.borderRadius.md,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.lg,
    },
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.sm + 4,
    paddingHorizontal: theme.spacing.md,
    fontSize: theme.typography.fontSize.base,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.primary,
  },
};

export default theme;
