/**
 * Detox Configuration
 * E2E Test Framework for React Native
 * https://detoxjs.io/docs/config/overview
 */

module.exports = {
  testRunner: 'jest',

  apps: {
    ios: {
      type: 'ios.app',
      binaryPath: 'ios/build/Build/Products/Release-iphonesimulator/Movemate.app',
      build: 'xcodebuild -workspace ios/Movemate.xcworkspace -scheme Movemate -configuration Release -sdk iphonesimulator -derivedDataPath ios/build',
    },
    android: {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/release/app-release.apk',
      build: 'cd android && ./gradlew assembleRelease assembleAndroidTest -DtestBuildType=release',
    },
  },

  configurations: {
    'ios.sim.debug': {
      device: {
        type: 'ios.simulator',
        device: {
          type: 'iPhone 14', // Can be customized
        },
      },
      app: 'ios',
    },
    'ios.sim.release': {
      device: {
        type: 'ios.simulator',
        device: {
          type: 'iPhone 14',
        },
      },
      app: 'ios',
    },
    'android.emu.debug': {
      device: {
        type: 'android.emulator',
        device: {
          avdName: 'Pixel_4_API_30', // Configure your emulator
        },
      },
      app: 'android',
    },
    'android.emu.release': {
      device: {
        type: 'android.emulator',
        device: {
          avdName: 'Pixel_4_API_30',
        },
      },
      app: 'android',
    },
  },

  testRunner: 'jest',

  bundle: {
    input: './',
    output: './e2e/config',
  },

  testRunner: 'jest',
  jestConfig: './__tests__/e2e/config.json',
};
