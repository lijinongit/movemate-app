import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Screen } from '../../components/Screen';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export default function DiscoveryStubScreen(): React.ReactElement {
  return (
    <Screen contentContainerStyle={styles.container}>
      <View style={styles.placeholder}>
        <Text style={styles.icon}>🔍</Text>
        <Text style={styles.title}>Discovery</Text>
        <Text style={styles.subtitle}>Discovery flow deferred to Sprint 3-4</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    alignItems: 'center',
  },
  icon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
});
