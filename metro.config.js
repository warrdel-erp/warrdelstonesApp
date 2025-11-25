const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    assetExts: [
      'bin',
      'txt',
      'jpg',
      'png',
      'json',
      'mp4',
      'mov',
      'mp3',
      'wav',
      'aac',
      'gif',
      'webp',
      'bmp',
      'tiff',
    ],
    sourceExts: ['js', 'jsx', 'ts', 'tsx', 'cjs', 'mjs', 'svg'],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
