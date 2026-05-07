import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Screen } from '../components/Screen';
import { Button } from '../components/Button';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { WelcomeScreenProps } from '../types/navigation';

export default function WelcomeScreen({ navigation }: WelcomeScreenProps): React.ReactElement {
  const { t } = useTranslation();

  const RoleCard = ({
    icon,
    title,
    description,
    onPress,
    testID,
  }: {
    icon: string;
    title: string;
    description: string;
    onPress: () => void;
    testID: string;
  }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      accessible
      accessibilityRole="button"
      accessibilityLabel={title}
      testID={testID}
    >
      <Text style={styles.cardIcon}>{icon}</Text>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardDescription}>{description}</Text>
    </TouchableOpacity>
  );

  return (
    <Screen scroll contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>🏃</Text>
        <Text style={styles.headline}>{t('welcome.headline')}</Text>
        <Text style={styles.subheading}>{t('welcome.subheading')}</Text>
      </View>

      <View style={styles.cardsContainer}>
        <RoleCard
          icon="👤"
          title={t('welcome.customerCard')}
          description={t('welcome.customerDescription')}
          onPress={() => navigation.navigate('RoleSelect')}
          testID="customer-card"
        />

        <RoleCard
          icon="🏋️"
          title={t('welcome.trainerCard')}
          description={t('welcome.trainerDescription')}
          onPress={() => navigation.navigate('RoleSelect')}
          testID="trainer-card"
        />

        <RoleCard
          icon="🏢"
          title={t('welcome.studioCard')}
          description={t('welcome.studioDescription')}
          onPress={() => {}}
          testID="studio-card"
        />
        <Text style={styles.comingSoon}>{t('welcome.studioComingSoon')}</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>{t('welcome.loginLink')}</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          accessibilityLabel={t('welcome.login')}
          accessibilityRole="button"
        >
          <Text style={styles.loginLink}>{t('welcome.login')}</Text>
        </TouchableOpacity>
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
  logo: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  headline: {
    ...typography.h1,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subheading: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  cardsContainer: {
    marginVertical: spacing.xl,
  },
  card: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginBottom: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardIcon: {
    fontSize: 32,
    marginBottom: spacing.md,
  },
  cardTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  cardDescription: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  comingSoon: {
    ...typography.small,
    color: colors.primary,
    textAlign: 'center',
    marginTop: spacing.sm,
    fontStyle: 'italic',
  },
  footer: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  footerText: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  loginLink: {
    ...typography.bodySemibold,
    color: colors.primary,
  },
});
