import { useTranslation as useI18nTranslation } from 'react-i18next';
import { useLocaleStore } from '../state/localeStore';

export const useTranslation = (): ReturnType<typeof useI18nTranslation> => {
  const { locale } = useLocaleStore();
  const translation = useI18nTranslation();

  return translation;
};
