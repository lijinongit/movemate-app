import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Screen } from '../../components/Screen';
import { Button } from '../../components/Button';
import { AgeCheckScreenProps } from '../../types/navigation';
import { useCheckAgeMutation } from '../../api/queries';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export default function AgeCheckScreen({ navigation, route }: AgeCheckScreenProps): React.ReactElement {
  const { t } = useTranslation();
  const { userId } = route.params;

  const { mutate: checkAge } = useCheckAgeMutation();
  const [selectedAge, setSelectedAge] = useState<'adult' | 'minor' | null>(null);

  const handleContinue = (): void => {
    if (!selectedAge) return;

    if (selectedAge === 'adult') {
      navigation.navigate('VerificationPending', { userId, userType: 'customer' });
    } else {
      navigation.navigate('ParentalConsent', {
        userId,
        childName: '',
        childDob: '',
      });
    }
  };

  const RadioButton = ({ selected, onPress, label }: { selected: boolean; onPress: () => void; label: string }) => (
    <TouchableOpacity
      style={[styles.radioButton, selected && styles.radioButtonSelected]}
      onPress={onPress}
      accessible
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={label}
    >
      <View style={[styles.radio, selected && styles.radioSelected]} />
      <Text style={styles.radioLabel}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <Screen contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('ageCheck.title')}</Text>
        <Text style={styles.question}>{t('ageCheck.question')}</Text>
        <Text style={styles.explanation}>{t('ageCheck.explanation')}</Text>
      </View>

      <View style={styles.optionsContainer}>
        <RadioButton
          selected={selectedAge === 'adult'}
          onPress={() => setSelectedAge('adult')}
          label={t('ageCheck.yes')}
        />
        <RadioButton
          selected={selectedAge === 'minor'}
          onPress={() => setSelectedAge('minor')}
          label={t('ageCheck.no')}
        />
      </View>

      <Button
        title={t('common.continue')}
        onPress={handleContinue}
        disabled={!selectedAge}
        testID="age-continue-button"
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  header: {
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  question: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  explanation: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  optionsContainer: {
    marginVertical: spacing.xl,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  radioButtonSelected: {
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
  radioLabel: {
    ...typography.body,
    color: colors.textPrimary,
  },
});
