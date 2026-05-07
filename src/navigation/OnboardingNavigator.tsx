import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../types/navigation';
import EmiratesIdUploadScreen from '../screens/onboarding/EmiratesIdUploadScreen';
import AgeCheckScreen from '../screens/onboarding/AgeCheckScreen';
import ParentalConsentScreen from '../screens/onboarding/ParentalConsentScreen';
import VerificationPendingScreen from '../screens/onboarding/VerificationPendingScreen';
import TrainerCertificationsScreen from '../screens/onboarding/TrainerCertificationsScreen';
import TrainerReferencesScreen from '../screens/onboarding/TrainerReferencesScreen';
import TrainerIntroVideoScreen from '../screens/onboarding/TrainerIntroVideoScreen';

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export default function OnboardingNavigator(): React.ReactElement {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
      }}
    >
      <Stack.Screen name="EmiratesIdUpload" component={EmiratesIdUploadScreen} />
      <Stack.Screen name="AgeCheck" component={AgeCheckScreen} />
      <Stack.Screen name="ParentalConsent" component={ParentalConsentScreen} />
      <Stack.Screen name="TrainerCertifications" component={TrainerCertificationsScreen} />
      <Stack.Screen name="TrainerReferences" component={TrainerReferencesScreen} />
      <Stack.Screen name="TrainerIntroVideo" component={TrainerIntroVideoScreen} />
      <Stack.Screen name="VerificationPending" component={VerificationPendingScreen} />
    </Stack.Navigator>
  );
}
