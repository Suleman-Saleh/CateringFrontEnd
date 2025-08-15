// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'], // Works for both Expo & React Native CLI with Expo preset
    plugins: [
      'react-native-reanimated/plugin', // Needed for animations like Reanimated
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@components': './src/components',
            '@assets': './src/assets',
            '@screens': './src/screens',
            '@styles': './src/styles',
          },
        },
      ],
    ],
  };
};
