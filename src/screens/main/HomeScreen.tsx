import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Screen } from '../../components/Screen';
import { Button } from '../../components/Button';
import { HomeScreenProps } from '../../types/navigation';
import { useAuthStore } from '../../state/authStore';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export default function HomeScreen({ navigation }: HomeScreenProps): React.ReactElement {
  const { t } = useTranslation();
  const { user } = useAuthStore();

  const firstName = user?.firstName || 'User';

  return (
    <Screen contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.icon}>✓</Text>
        <Text style={styles.greeting}>{t('home.greeting', { name: firstName })}</Text>
        <Text style={styles.verified}>{t('home.verified')}</Text>
      </View>

      <Button
        title={t('home.startExploring')}
        onPress={() => {}}
        testID="explore-button"
      />

      <View style={styles.stepsContainer}>
        <Text style={styles.stepsTitle}>{t('home.whatHappensNext')}</Text>
        <View style={styles.step}>
          <Text style={styles.stepNumber}>1</Text>
          <Text style={styles.stepText}>{t('home.step1')}</Text>
        </View>
        <View style={styles.step}>
          <Text style={styles.stepNumber}>2</Text>
          <Text style={styles.stepText}>{t('home.step2')}</Text>
        </View>
        <View style={styles.step}>
          <Text style={styles.stepNumber}>3</Text>
          <Text style={styles.stepText}>{t('home.step3')}</Text>
        </View>
      </View>

      <Button
        title={t('home.viewProfile')}
        variant="outline"
        onPress={() => {}}
        testID="profile-button"
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  icon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  greeting: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  verified: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  stepsContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    marginVertical: spacing.xl,
  },
  stepsTitle: {
    ...typography.label,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    fontWeight: '600',
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  stepNumber: {
    ...typography.bodySemibold,
    color: colors.primary,
    fontSize: 18,
    marginRight: spacing.md,
    minWidth: 24,
  },
  stepText: {
    ...typography.body,
    color: colors.textSecondary,
    flex: 1,
  },
});
