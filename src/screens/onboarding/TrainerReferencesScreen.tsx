import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../types/navigation';
import { Screen } from '../../components/Screen';
import { Button } from '../../components/Button';
import { TextField } from '../../components/TextField';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

type TrainerReferencesScreenProps = NativeStackScreenProps<
  OnboardingStackParamList,
  'TrainerReferences'
>;

export default function TrainerReferencesScreen({
  navigation,
}: TrainerReferencesScreenProps): React.ReactElement {
  const { t } = useTranslation();

  const ReferenceForm = ({ number }: { number: 1 | 2 }) => (
    <View style={styles.referenceCard}>
      <Text style={styles.referenceTitle}>
        {t('trainer.references.reference', { number })}
      </Text>
      <TextField
        label={t('trainer.references.fullName')}
        placeholder="John Doe"
        testID={`ref-${number}-name`}
      />
      <TextField
        label={t('trainer.references.email')}
        placeholder="john@example.com"
        keyboardType="email-address"
        testID={`ref-${number}-email`}
      />
      <Text style={styles.relationshipLabel}>{t('trainer.references.relationship')}</Text>
      <Text style={styles.relationshipHint}>Dropdown deferred to Phase 2</Text>
    </View>
  );

  return (
    <Screen scroll safeArea contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('trainer.references.title')}</Text>
        <Text style={styles.subtitle}>{t('trainer.references.subtitle')}</Text>
      </View>

      <ReferenceForm number={1} />
      <ReferenceForm number={2} />

      <Button
        title={t('trainer.references.nextButton')}
        onPress={() => {}}
        testID="next-references-button"
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing.xl,
  },
  header: {
    marginBottom: spacing.xl,
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
  referenceCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  referenceTitle: {
    ...typography.label,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    fontWeight: '600',
  },
  relationshipLabel: {
    ...typography.label,
    color: colors.textPrimary,
    marginTop: spacing.md,
    fontWeight: '600',
  },
  relationshipHint: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    fontStyle: 'italic',
  },
});
