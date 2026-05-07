import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language } from '../types/models';

interface LocaleStoreState {
  locale: Language;
  setLocale: (locale: Language) => Promise<void>;
}

export const useLocaleStore = create<LocaleStoreState>()(
  persist(
    (set) => ({
      locale: 'en',

      setLocale: async (locale: Language) => {
        try {
          await AsyncStorage.setItem('locale', locale);
          set({ locale });
        } catch (error) {
          console.error('Error setting locale:', error);
        }
      },
    }),
    {
      name: 'locale-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
