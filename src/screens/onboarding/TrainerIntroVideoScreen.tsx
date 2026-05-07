import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../types/navigation';
import { Screen } from '../../components/Screen';
import { Button } from '../../components/Button';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

type TrainerIntroVideoScreenProps = NativeStackScreenProps<
  OnboardingStackParamList,
  'TrainerIntroVideo'
>;

export default function TrainerIntroVideoScreen({
  navigation,
}: TrainerIntroVideoScreenProps): React.ReactElement {
  const { t } = useTranslation();

  return (
    <Screen scroll safeArea contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('trainer.introVideo.title')}</Text>
        <Text style={styles.subtitle}>{t('trainer.introVideo.subtitle')}</Text>
      </View>

      <View style={styles.motivationContainer}>
        <Text style={styles.motivationTitle}>{t('trainer.introVideo.motivation')}</Text>
        <Text style={styles.motivationItem}>• {t('trainer.introVideo.style')}</Text>
        <Text style={styles.motivationItem}>• {t('trainer.introVideo.background')}</Text>
        <Text style={styles.motivationItem}>• {t('trainer.introVideo.love')}</Text>
      </View>

      <View style={styles.videoPlaceholder}>
        <Text style={styles.videoIcon}>📹</Text>
        <Text style={styles.videoText}>{t('trainer.introVideo.startRecording')}</Text>
        <Text style={styles.videoHint}>Video recording deferred to Phase 2</Text>
      </View>

      <View style={styles.divider}>
        <Text style={styles.dividerText}>OR</Text>
      </View>

      <Button
        title={t('trainer.introVideo.uploadExisting')}
        onPress={() => {}}
        variant="outline"
        testID="upload-video-button"
      />

      <Button
        title={t('trainer.introVideo.submitApplication')}
        onPress={() => {}}
        testID="submit-app-button"
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
  motivationContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  motivationTitle: {
    ...typography.label,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    fontWeight: '600',
  },
  motivationItem: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  videoPlaceholder: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: 12,
    marginVertical: spacing.lg,
  },
  videoIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  videoText: {
    ...typography.body,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  videoHint: {
    ...typography.small,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  dividerText: {
    ...typography.body,
    color: colors.textSecondary,
    flex: 1,
    textAlign: 'center',
  },
});
