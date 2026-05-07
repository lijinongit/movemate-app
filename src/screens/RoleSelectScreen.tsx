import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Screen } from '../components/Screen';
import { Button } from '../components/Button';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { RoleSelectScreenProps } from '../types/navigation';

export default function RoleSelectScreen({
  navigation,
}: RoleSelectScreenProps): React.ReactElement {
  const { t } = useTranslation();
  const [selectedRole, setSelectedRole] = useState<'customer' | 'trainer' | null>(null);

  const handleContinue = (): void => {
    if (!selectedRole) {
      Alert.alert(t('common.error'), t('common.error'));
      return;
    }

    if (selectedRole === 'customer') {
      navigation.navigate('RegisterCustomer');
    } else if (selectedRole === 'trainer') {
      navigation.navigate('RegisterTrainer');
    }
  };

  const RoleButton = ({
    role,
    label,
  }: {
    role: 'customer' | 'trainer';
    label: string;
  }) => (
    <TouchableOpacity
      style={[
        styles.roleButton,
        selectedRole === role && styles.roleButtonSelected,
      ]}
      onPress={() => setSelectedRole(role)}
      accessible
      accessibilityRole="radio"
      accessibilityState={{ checked: selectedRole === role }}
      accessibilityLabel={label}
    >
      <View style={[styles.radio, selectedRole === role && styles.radioSelected]} />
      <Text style={styles.roleLabel}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <Screen contentContainerStyle={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        accessible
        accessibilityRole="button"
        accessibilityLabel={t('common.back')}
      >
        <Text style={styles.backButton}>{t('common.back')}</Text>
      </TouchableOpacity>

      <Text style={styles.title}>{t('roleSelect.title')}</Text>

      <View style={styles.optionsContainer}>
        <RoleButton role="customer" label={t('roleSelect.customer')} />
        <RoleButton role="trainer" label={t('roleSelect.trainer')} />
      </View>

      <Button
        title={t('common.continue')}
        onPress={handleContinue}
        disabled={!selectedRole}
        testID="continue-button"
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
  },
  backButton: {
    ...typography.label,
    color: colors.primary,
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.xl,
  },
  optionsContainer: {
    marginVertical: spacing.xl,
  },
  roleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  roleButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    marginRight: spacing.md,
  },
  radioSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  roleLabel: {
    ...typography.body,
    color: colors.textPrimary,
  },
});
