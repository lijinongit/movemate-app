import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Screen } from '../../components/Screen';
import { Button } from '../../components/Button';
import { TextField } from '../../components/TextField';
import { ErrorBanner } from '../../components/ErrorBanner';
import { LoadingOverlay } from '../../components/LoadingOverlay';
import { RegisterTrainerScreenProps } from '../../types/navigation';
import { useRegisterMutation } from '../../api/queries';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export default function RegisterTrainerScreen({
  navigation,
}: RegisterTrainerScreenProps): React.ReactElement {
  const { t } = useTranslation();
  const { mutate: register, isPending, isError, error } = useRegisterMutation();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    language: 'en' as const,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [signInMethod, setSignInMethod] = useState<'email' | 'phone'>('email');

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = t('register.errors.firstNameRequired');
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = t('register.errors.lastNameRequired');
    }
    if (signInMethod === 'email' && !formData.email.includes('@')) {
      newErrors.email = t('register.errors.invalidEmail');
    }
    if (formData.password.length < 8) {
      newErrors.password = t('register.errors.passwordTooWeak');
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('register.errors.passwordsMismatch');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = (): void => {
    if (!validateForm()) {
      return;
    }

    register(
      {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: signInMethod === 'email' ? formData.email : '',
        phone: signInMethod === 'phone' ? formData.email : '',
        password: formData.password,
        language: formData.language,
        userType: 'trainer',
      },
      {
        onSuccess: (response) => {
          navigation.navigate('Otp', {
            userId: response.userId,
            method: signInMethod,
            identifier: signInMethod === 'email' ? formData.email : formData.email,
          });
        },
        onError: (error) => {
          Alert.alert(t('common.error'), error.message);
        },
      }
    );
  };

  return (
    <>
      <Screen scroll safeArea contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('register.trainer.title')}</Text>
          <Text style={styles.step}>
            {t('register.trainer.step', { current: 1, total: 4 })}
          </Text>
        </View>

        {isError && (
          <ErrorBanner
            message={error?.message || t('common.error')}
            onRetry={handleContinue}
          />
        )}

        <TextField
          label={t('register.firstName')}
          placeholder={t('register.firstName')}
          value={formData.firstName}
          onChangeText={(text) => setFormData({ ...formData, firstName: text })}
          error={errors.firstName}
          testID="trainer-first-name"
        />

        <TextField
          label={t('register.lastName')}
          placeholder={t('register.lastName')}
          value={formData.lastName}
          onChangeText={(text) => setFormData({ ...formData, lastName: text })}
          error={errors.lastName}
          testID="trainer-last-name"
        />

        <TextField
          label={t('register.email')}
          placeholder="trainer@example.com"
          keyboardType="email-address"
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          error={errors.email}
          testID="trainer-email"
        />

        <TextField
          label={t('register.password')}
          placeholder={t('register.password')}
          secureTextEntry
          showPasswordToggle
          value={formData.password}
          onChangeText={(text) => setFormData({ ...formData, password: text })}
          error={errors.password}
          hint={t('register.passwordRequirements')}
          testID="trainer-password"
        />

        <TextField
          label={t('register.confirmPassword')}
          placeholder={t('register.confirmPassword')}
          secureTextEntry
          value={formData.confirmPassword}
          onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
          error={errors.confirmPassword}
          testID="trainer-confirm-password"
        />

        <Button
          title={t('common.continue')}
          onPress={handleContinue}
          loading={isPending}
          testID="trainer-register-button"
        />
      </Screen>

      <LoadingOverlay visible={isPending} />
    </>
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
  step: {
    ...typography.body,
    color: colors.textSecondary,
  },
});
