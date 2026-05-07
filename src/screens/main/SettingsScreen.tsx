import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Screen } from '../../components/Screen';
import { Button } from '../../components/Button';
import { SettingsScreenProps } from '../../types/navigation';
import { useAuthStore } from '../../state/authStore';
import { useLocaleStore } from '../../state/localeStore';
import { useLogoutMutation } from '../../api/queries';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { initializeRTL } from '../../utils/rtl';

export default function SettingsScreen(): React.ReactElement {
  const { t, i18n } = useTranslation();
  const { locale, setLocale } = useLocaleStore();
  const { mutate: logout } = useLogoutMutation();

  const handleLanguageChange = async (): Promise<void> => {
    const newLocale = locale === 'en' ? 'ar' : 'en';

    Alert.alert(
      t('settings.rtlChangeWarning'),
      t('settings.rtlChangeWarning'),
      [
        {
          text: t('common.cancel'),
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: t('settings.reload'),
          onPress: async () => {
            await setLocale(newLocale);
            await i18n.changeLanguage(newLocale);
            await initializeRTL(newLocale);
          },
        },
      ]
    );
  };

  const handleLogout = (): void => {
    Alert.alert(
      t('settings.logoutTitle'),
      t('settings.logoutConfirm'),
      [
        {
          text: t('common.cancel'),
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: t('settings.logout'),
          onPress: () => {
            logout();
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <Screen contentContainerStyle={styles.container}>
      <Text style={styles.title}>{t('settings.title')}</Text>

      <View style={styles.settingCard}>
        <View style={styles.settingHeader}>
          <Text style={styles.settingLabel}>{t('settings.language')}</Text>
          <Text style={styles.settingValue}>
            {locale === 'en' ? 'English' : 'العربية'}
          </Text>
        </View>
        <Button
          title={locale === 'en' ? 'Switch to العربية' : 'Switch to English'}
          onPress={handleLanguageChange}
          size="sm"
          variant="outline"
          testID="language-toggle"
        />
      </View>

      <View style={styles.divider} />

      <Button
        title={t('settings.logout')}
        onPress={handleLogout}
        variant="danger"
        testID="logout-button"
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing.xl,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.xl,
  },
  settingCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  settingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  settingLabel: {
    ...typography.label,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  settingValue: {
    ...typography.body,
    color: colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.xl,
  },
});
