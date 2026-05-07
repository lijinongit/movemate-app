import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Screen } from '../../components/Screen';
import { Button } from '../../components/Button';
import { ErrorBanner } from '../../components/ErrorBanner';
import { LoadingOverlay } from '../../components/LoadingOverlay';
import { OtpScreenProps } from '../../types/navigation';
import { useVerifyOtpMutation, useResendOtpMutation } from '../../api/queries';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60;

export default function OtpScreen({ navigation, route }: OtpScreenProps): React.ReactElement {
  const { t } = useTranslation();
  const { userId, method, identifier } = route.params;

  const { mutate: verifyOtp, isPending: isVerifying, isError, error } = useVerifyOtpMutation();
  const { mutate: resendOtp, isPending: isResending } = useResendOtpMutation();

  const [otp, setOtp] = useState('');
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleOtpChange = (value: string): void => {
    const cleaned = value.replace(/\D/g, '').slice(0, OTP_LENGTH);
    setOtp(cleaned);

    if (cleaned.length === OTP_LENGTH) {
      handleVerify(cleaned);
    }
  };

  const handleVerify = (code: string = otp): void => {
    if (code.length !== OTP_LENGTH) {
      return;
    }

    verifyOtp(
      { userId, otp: code },
      {
        onSuccess: () => {
          navigation.navigate('EmiratesIdUpload', {
            userId,
            userType: method === 'email' ? 'customer' : 'trainer',
          });
        },
        onError: (error) => {
          setOtp('');
        },
      }
    );
  };

  const handleResend = (): void => {
    resendOtp(userId, {
      onSuccess: () => {
        setCooldown(RESEND_COOLDOWN);
      },
    });
  };

  const maskIdentifier = (id: string): string => {
    if (method === 'email') {
      const [local, domain] = id.split('@');
      return `${local.slice(0, 2)}***@${domain}`;
    }
    return `+971***${id.slice(-4)}`;
  };

  return (
    <>
      <Screen contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('otp.title', { method: method.toUpperCase() })}</Text>
          <Text style={styles.subtitle}>{t('otp.subtitle')}</Text>
          <Text style={styles.identifier}>{maskIdentifier(identifier)}</Text>
        </View>

        {isError && (
          <ErrorBanner
            message={error?.message || t('otp.errors.invalidCode')}
            onRetry={() => handleVerify()}
          />
        )}

        <View style={styles.otpContainer}>
          <Text style={styles.label}>{t('otp.enterCode')}</Text>
          <TextInput
            style={styles.otpInput}
            value={otp}
            onChangeText={handleOtpChange}
            placeholder="000000"
            placeholderTextColor={colors.placeholder}
            keyboardType="number-pad"
            maxLength={OTP_LENGTH}
            editable={!isVerifying}
            testID="otp-input"
            accessible
            accessibilityLabel={t('otp.enterCode')}
          />
        </View>

        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>{t('otp.didNotReceive')}</Text>
          <TouchableOpacity
            onPress={handleResend}
            disabled={cooldown > 0 || isResending}
            accessible
            accessibilityRole="button"
            accessibilityLabel={t('otp.resend')}
          >
            <Text
              style={[
                styles.resendLink,
                (cooldown > 0 || isResending) && styles.resendLinkDisabled,
              ]}
            >
              {cooldown > 0 ? `${t('otp.resend')} (${cooldown}s)` : t('otp.resend')}
            </Text>
          </TouchableOpacity>
        </View>

        <Button
          title={t('otp.verifyButton')}
          onPress={() => handleVerify()}
          loading={isVerifying}
          disabled={otp.length !== OTP_LENGTH}
          testID="verify-button"
        />
      </Screen>

      <LoadingOverlay visible={isVerifying} />
    </>
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
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  identifier: {
    ...typography.bodySemibold,
    color: colors.textPrimary,
  },
  otpContainer: {
    marginVertical: spacing.xl,
    alignItems: 'center',
  },
  label: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  otpInput: {
    fontSize: 32,
    fontWeight: '600',
    letterSpacing: 8,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    textAlign: 'center',
    minWidth: 200,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  resendText: {
    ...typography.body,
    color: colors.textSecondary,
    marginRight: spacing.sm,
  },
  resendLink: {
    ...typography.bodySemibold,
    color: colors.primary,
  },
  resendLinkDisabled: {
    color: colors.textTertiary,
  },
});
