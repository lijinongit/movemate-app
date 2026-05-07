import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../types/navigation';
import { Screen } from '../../components/Screen';
import { Button } from '../../components/Button';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

const DISCIPLINES = ['personalTraining', 'dance', 'swimming', 'football', 'cricket', 'yoga'];

interface Certification {
  discipline: string;
  documentPath?: string;
  expiryDate?: string;
}

type TrainerCertificationsScreenProps = NativeStackScreenProps<
  OnboardingStackParamList,
  'TrainerCertifications'
>;

export default function TrainerCertificationsScreen({
  navigation,
}: TrainerCertificationsScreenProps): React.ReactElement {
  const { t } = useTranslation();
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [expandedDiscipline, setExpandedDiscipline] = useState<string | null>(null);

  const toggleDiscipline = (discipline: string): void => {
    setExpandedDiscipline(expandedDiscipline === discipline ? null : discipline);
  };

  const DisciplineRow = ({ disciplineKey }: { disciplineKey: string }) => {
    const isSelected = certifications.some((c) => c.discipline === disciplineKey);
    const label = t(`trainer.certifications.${disciplineKey}`);

    return (
      <View key={disciplineKey}>
        <TouchableOpacity
          style={[styles.disciplineRow, isSelected && styles.disciplineRowSelected]}
          onPress={() => toggleDiscipline(disciplineKey)}
          accessible
          accessibilityRole="checkbox"
          accessibilityState={{ checked: isSelected }}
          accessibilityLabel={label}
        >
          <View style={[styles.checkbox, isSelected && styles.checkboxSelected]} >
            {isSelected && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.disciplineLabel}>{label}</Text>
        </TouchableOpacity>

        {isSelected && expandedDiscipline === disciplineKey && (
          <View style={styles.certInputContainer}>
            <Text style={styles.certInputLabel}>{t('trainer.certifications.uploadCert')}</Text>
            <Text style={styles.certInputHint}>File upload deferred to Phase 2</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <Screen scroll safeArea contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('trainer.certifications.title')}</Text>
        <Text style={styles.subtitle}>{t('trainer.certifications.subtitle')}</Text>
      </View>

      <View style={styles.disciplinesContainer}>
        {DISCIPLINES.map((discipline) => (
          <DisciplineRow key={discipline} disciplineKey={discipline} />
        ))}
      </View>

      <Button
        title={t('common.next')}
        onPress={() => {}}
        disabled={certifications.length === 0}
        testID="next-button"
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
  disciplinesContainer: {
    marginVertical: spacing.lg,
  },
  disciplineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    marginBottom: spacing.sm,
  },
  disciplineRowSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  checkboxSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  checkmark: {
    color: colors.textInverse,
    fontSize: 14,
    fontWeight: '600',
  },
  disciplineLabel: {
    ...typography.body,
    color: colors.textPrimary,
    flex: 1,
  },
  certInputContainer: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.md,
  },
  certInputLabel: {
    ...typography.label,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    fontWeight: '600',
  },
  certInputHint: {
    ...typography.small,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
});
