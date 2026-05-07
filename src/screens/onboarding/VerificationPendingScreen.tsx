import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Screen } from '../../components/Screen';
import { Button } from '../../components/Button';
import { VerificationPendingScreenProps } from '../../types/navigation';
import { useGetTrainerApplicationStatusQuery } from '../../api/queries';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export default function VerificationPendingScreen({
  route,
}: VerificationPendingScreenProps): React.ReactElement {
  const { t } = useTranslation();
  const { userId, userType } = route.params;
  const { data: status, refetch } = useGetTrainerApplicationStatusQuery(userType === 'trainer');

  const [currentStep, setCurrentStep] = useState<'received' | 'reviewing' | 'decided'>('received');

  useEffect(() => {
    if (status?.status === 'approved') {
      setCurrentStep('decided');
    } else if (status?.status === 'pending_review') {
      setCurrentStep('reviewing');
    }
  }, [status]);

  const Step = ({ status, label, isActive }: { status: string; label: string; isActive: boolean }) => (
    <View style={styles.stepContainer}>
      <View
        style={[
          styles.stepCircle,
          isActive && styles.stepCircleActive,
          status === 'completed' && styles.stepCircleCompleted,
        ]}
      >
        {status === 'completed' ? (
          <Text style={styles.stepIcon}>✓</Text>
        ) : status === 'active' ? (
          <Text style={styles.stepIcon}>⧖</Text>
        ) : (
          <Text style={styles.stepIcon}>◯</Text>
        )}
      </View>
      <Text style={[styles.stepLabel, isActive && styles.stepLabelActive]}>{label}</Text>
    </View>
  );

  return (
    <Screen contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.icon}>✉️</Text>
        <Text style={styles.title}>{t('verificationPending.title')}</Text>
        <Text style={styles.message}>{t('verificationPending.message')}</Text>
      </View>

      <View style={styles.timelineContainer}>
        <Text style={styles.timelineTitle}>{t('verificationPending.timeline')}</Text>

        <View style={styles.stepsContainer}>
          <Step
            status="completed"
            label={t('verificationPending.documentsReceived')}
            isActive={false}
          />
          <Step
            status={currentStep === 'reviewing' ? 'active' : currentStep === 'received' ? 'pending' : 'completed'}
            label={t('verificationPending.underReview')}
            isActive={currentStep === 'reviewing'}
          />
          <Step
            status={currentStep === 'decided' ? 'completed' : 'pending'}
            label={t('verificationPending.decisionSent')}
            isActive={false}
          />
        </View>
      </View>

      <Button
        title={t('verificationPending.checkStatus')}
        onPress={() => refetch()}
        variant="outline"
        testID="check-status-button"
      />

      <View style={styles.supportSection}>
        <Text style={styles.supportText}>{t('verificationPending.support')}</Text>
      </View>
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
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  message: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  timelineContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    marginVertical: spacing.xl,
  },
  timelineTitle: {
    ...typography.label,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    fontWeight: '600',
  },
  stepsContainer: {
    gap: spacing.md,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  stepCircleActive: {
    backgroundColor: colors.primary,
  },
  stepCircleCompleted: {
    backgroundColor: colors.success,
  },
  stepIcon: {
    fontSize: 16,
    color: colors.textInverse,
    fontWeight: '600',
  },
  stepLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  stepLabelActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  supportSection: {
    marginTop: spacing.xl,
  },
  supportText: {
    ...typography.small,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
