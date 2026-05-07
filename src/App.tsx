import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { I18nextProvider } from 'react-i18next';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import i18n from './i18n';
import { useAuthStore } from './state/authStore';
import { useLocaleStore } from './state/localeStore';
import RootNavigator from './navigation/RootNavigator';
import { initializeRTL } from './utils/rtl';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
    },
  },
});

export default function App(): React.ReactElement {
  const { initialize: initAuth } = useAuthStore();
  const { locale } = useLocaleStore();

  useEffect(() => {
    const init = async (): Promise<void> => {
      try {
        await initAuth();
        await initializeRTL(locale);
      } catch (error) {
        console.error('App initialization error:', error);
      }
    };
    init();
  }, [initAuth, locale]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18n}>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </I18nextProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
