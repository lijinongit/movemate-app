import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  StyleSheet,
  ViewStyle,
  ScrollViewProps,
} from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

interface ScreenProps extends ScrollViewProps {
  children: React.ReactNode;
  safeArea?: boolean;
  scroll?: boolean;
  contentContainerStyle?: ViewStyle;
  testID?: string;
}

export const Screen: React.FC<ScreenProps> = ({
  children,
  safeArea = true,
  scroll = false,
  contentContainerStyle,
  testID,
  ...scrollProps
}) => {
  const content = (
    <View
      style={[
        styles.container,
        contentContainerStyle,
      ]}
      testID={testID}
    >
      {children}
    </View>
  );

  if (scroll) {
    return (
      <SafeAreaView style={styles.safeArea} edges={safeArea ? ['top', 'bottom'] : undefined}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          {...scrollProps}
        >
          {content}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return safeArea ? (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {content}
    </SafeAreaView>
  ) : (
    content
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  scroll: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.lg,
  },
});
