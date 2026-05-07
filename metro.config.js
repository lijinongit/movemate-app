const { getDefaultConfig } = require('@react-native/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Configure Metro for monorepo (if using workspaces)
config.projectRoot = __dirname;
config.watchFolders = [
  path.resolve(__dirname),
];

// Enable CSS modules support for web
config.resolver.sourceExts = ['jsx', 'js', 'json', 'ts', 'tsx', 'cjs'];

// Polyfills for Node modules
config.resolver.extraNodeModules = {
  crypto: require.resolve('react-native-crypto'),
  stream: require.resolve('stream-browserify'),
  buffer: require.resolve('buffer'),
};

// Optimize for production builds
config.transformer.minifierPath = 'metro-minify-terser';
config.transformer.minifierConfig = {
  compress: {
    drop_debugger: true,
    drop_console: process.env.NODE_ENV === 'production',
  },
};

module.exports = config;
