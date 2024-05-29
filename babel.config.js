module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          'moti/skeleton': 'moti/skeleton/react-native-linear-gradient',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
