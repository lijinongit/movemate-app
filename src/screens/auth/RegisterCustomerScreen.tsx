import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Screen } from '../../components/Screen';
import { Button } from '../../components/Button';
import { TextField } from '../../components/TextField';
import { ErrorBanner } from '../../components/ErrorBanner';
import { LoadingOverlay } from '../../components/LoadingOverlay';
import { RegisterCustomerScreenProps } from '../../types/navigation';
import { useRegisterMutation } from '../../api/queries';
import { RegisterCustomerSchema } from '../../utils/validation';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export default function RegisterCustomerScreen({
  navigation,
}: RegisterCustomerScreenProps): React.ReactElement {
  const { t } = useTranslation();
  const { mutate: register, isPending, isError, error } = useRegisterMutation();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    language: 'en' as const,
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [signInMethod, setSignInMethod] = useState<'email' | 'phone'>('email');

  const validateForm = (): boolean => {
    try {
      const schema = RegisterCustomerSchema.pick({
        firstName: true,
        lastName: true,
        password: true,
        confirmPassword: true,
        agreeToTerms: true,
      });

      const dataToValidate: any = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        agreeToTerms: formData.agreeToTerms,
      };

      if (signInMethod === 'email') {
        dataToValidate.email = formData.email;
      } else {
        dataToValidate.phone = formData.phone;
      }

      schema.parse(dataToValidate);
      setErrors({});
      return true;
    } catch (err: any) {
      const newErrors: Record<string, string> = {};
      err.errors?.forEach((issue: any) => {
        newErrors[issue.path[0]] = issue.message;
      });
      setErrors(newErrors);
      return false;
    }
  };

  const handleContinue = (): void => {
    if (!validateForm()) {
      return;
    }

    register(
      {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: signInMethod === 'email' ? formData.email : undefined,
        phone: signInMethod === 'phone' ? formData.phone : undefined,
        password: formData.password,
        language: formData.language,
        userType: 'customer',
      },
      {
        onSuccess: (response) => {
          navigation.navigate('Otp', {
            userId: response.userId,
            method: signInMethod,
            identifier: signInMethod === 'email' ? formData.email : formData.phone,
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
          <Text style={styles.title}>{t('register.customer.title')}</Text>
          <Text style={styles.step}>
            {t('register.customer.step', { current: 1, total: 3 })}
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
          testID="first-name-input"
        />

        <TextField
          label={t('register.lastName')}
          placeholder={t('register.lastName')}
          value={formData.lastName}
          onChangeText={(text) => setFormData({ ...formData, lastName: text })}
          error={errors.lastName}
          testID="last-name-input"
        />

        <View style={styles.signInMethodContainer}>
          <Text style={styles.label}>{t('register.signInMethod')}</Text>
          <View style={styles.methodToggle}>
            {(['email', 'phone'] as const).map((method) => (
              <Button
                key={method}
                title={t(`register.${method}Option`)}
                variant={signInMethod === method ? 'primary' : 'outline'}
                size="sm"
                onPress={() => setSignInMethod(method)}
                style={{ flex: 1, marginHorizontal: spacing.sm }}
                testID={`method-${method}`}
              />
            ))}
          </View>
        </View>

        {signInMethod === 'email' ? (
          <TextField
            label={t('register.email')}
            placeholder="ali@example.com"
            keyboardType="email-address"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            error={errors.email}
            testID="email-input"
          />
        ) : (
          <TextField
            label={t('register.phone')}
            placeholder="+971501234567"
            keyboardType="phone-pad"
            value={formData.phone}
            onChangeText={(text) => setFormData({ ...formData, phone: text })}
            error={errors.phone}
            testID="phone-input"
          />
        )}

        <TextField
          label={t('register.password')}
          placeholder={t('register.password')}
          secureTextEntry
          showPasswordToggle
          value={formData.password}
          onChangeText={(text) => setFormData({ ...formData, password: text })}
          error={errors.password}
          hint={t('register.passwordRequirements')}
          testID="password-input"
        />

        <TextField
          label={t('register.confirmPassword')}
          placeholder={t('register.confirmPassword')}
          secureTextEntry
          value={formData.confirmPassword}
          onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
          error={errors.confirmPassword}
          testID="confirm-password-input"
        />

        <View style={styles.termsContainer}>
          <Text style={styles.termsText}>{t('register.agreeTerms')}</Text>
        </View>

        <Button
          title={t('common.continue')}
          onPress={handleContinue}
          loading={isPending}
          testID="register-button"
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
  signInMethodContainer: {
    marginVertical: spacing.md,
  },
  label: {
    ...typography.label,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    fontWeight: '600',
  },
  methodToggle: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  termsContainer: {
    paddingVertical: spacing.md,
  },
  termsText: {
    ...typography.body,
    color: colors.textPrimary,
  },
});
