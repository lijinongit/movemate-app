import { I18nManager } from 'react-native';
import { Language } from '../types/models';

export const initializeRTL = async (locale: Language): Promise<void> => {
  const isRTL = locale === 'ar';
  const currentlyRTL = I18nManager.isRTL;

  if (isRTL !== currentlyRTL) {
    I18nManager.forceRTL(isRTL);
  }
};

export const isRTL = (locale: Language): boolean => {
  return locale === 'ar';
};
