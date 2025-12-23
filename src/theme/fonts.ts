import { createFont } from 'tamagui';

export const outfitFont = createFont({
  family: 'Outfit-Regular',
  size: {
    1: 11,
    2: 12,
    3: 13,
    4: 14,
    5: 16,
    6: 18,
    7: 20,
    8: 22,
    9: 30,
    10: 42,
    11: 52,
    12: 62,
    13: 72,
    14: 92,
    15: 114,
    16: 124,
    true: 16,
  },
  lineHeight: {
    1: 16,
    2: 18,
    3: 20,
    4: 22,
    5: 24,
    6: 26,
    7: 28,
    8: 30,
    9: 38,
    10: 50,
    11: 60,
    12: 70,
    13: 80,
    14: 100,
    15: 122,
    16: 132,
    true: 24,
  },
  weight: {
    1: '100', // Thin
    2: '200', // ExtraLight
    3: '300', // Light
    4: '400', // Regular
    5: '500', // Medium
    6: '600', // SemiBold
    7: '700', // Bold
    8: '800', // ExtraBold
    9: '900', // Black
    true: '400',
  },
  face: {
    100: { normal: 'Outfit-Thin' },
    200: { normal: 'Outfit-ExtraLight' },
    300: { normal: 'Outfit-Light' },
    400: { normal: 'Outfit-Regular' },
    500: { normal: 'Outfit-Medium' },
    600: { normal: 'Outfit-SemiBold' },
    700: { normal: 'Outfit-Bold' },
    800: { normal: 'Outfit-ExtraBold' },
    900: { normal: 'Outfit-Black' },
  },
});
