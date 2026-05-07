import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Screen } from '../../components/Screen';
import { Button } from '../../components/Button';
import { TextField } from '../../components/TextField';
import { ParentalConsentScreenProps } from '../../types/navigation';
import { useSubmitParentalConsentMutation } from '../../api/queries';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export default function ParentalConsentScreen({
  navigation,
  route,
}: ParentalConsentScreenProps): React.ReactElement {
  const { t } = useTranslation();
  const { userId } = route.params;

  const { mutate: submitConsent, isPending } = useSubmitParentalConsentMutation();
  const [parentEmail, setParentEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSendLink = (): void => {
    if (!parentEmail.includes('@')) {
      setError(t('parentalConsent.errors.invalidEmail'));
      return;
    }

    submitConsent(parentEmail, {
      onSuccess: () => {
        Alert.alert(
          t('common.ok'),
          t('parentalConsent.confirmSent'),
          [{ text: t('common.ok') }]
        );
      },
      onError: (err) => {
        setError(err.message);
      },
    });
  };

  const handleShare = async (): Promise<void> => {
    const shareLink = `https://movemate.app/guardian?ref=${userId}`;
    try {
      await Share.share({
        message: t('parentalConsent.shareLink') + '\n' + shareLink,
        title: t('parentalConsent.title'),
      });
    } catch (err) {
      Alert.alert(t('common.error'), 'Failed to share');
    }
  };

  return (
    <Screen scroll safeArea contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('parentalConsent.title')}</Text>
        <Text style={styles.headline}>{t('parentalConsent.headline')}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('parentalConsent.parentEmail')}</Text>
        <TextField
          label={t('parentalConsent.parentEmail')}
          placeholder="parent@example.com"
          keyboardType="email-address"
          value={parentEmail}
          onChangeText={(text) => {
            setParentEmail(text);
            setError(null);
          }}
          error={error}
          testID="parent-email-input"
        />
        <Button
          title={t('parentalConsent.sendLink')}
          onPress={handleSendLink}
          loading={isPending}
          testID="send-link-button"
        />
      </View>

      <View style={styles.divider}>
        <Text style={styles.dividerText}>{t('parentalConsent.or')}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('parentalConsent.shareLink')}</Text>
        <View style={styles.shareLink}>
          <Text style={styles.shareLinkText}>
            https://movemate.app/guardian?ref={userId}
          </Text>
        </View>

        <View style={styles.shareButtons}>
          <Button
            title={t('parentalConsent.whatsapp')}
            onPress={handleShare}
            size="sm"
            style={{ flex: 1 }}
            testID="share-whatsapp"
          />
          <Button
            title={t('parentalConsent.email')}
            onPress={handleShare}
            size="sm"
            style={{ flex: 1, marginLeft: spacing.md }}
            testID="share-email"
          />
        </View>
      </View>
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
    marginBottom: spacing.md,
  },
  headline: {
    ...typography.body,
    color: colors.textSecondary,
  },
  section: {
    marginVertical: spacing.lg,
  },
  sectionTitle: {
    ...typography.label,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    fontWeight: '600',
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
  shareLink: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  shareLinkText: {
    ...typography.small,
    color: colors.primary,
    fontFamily: 'monospace',
  },
  shareButtons: {
    flexDirection: 'row',
  },
});

declare module './ParentalConsentScreen' {
  interface ParentalConsentScreenProps {
    confirmSent?: string;
  }
}
