import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';

export type RootStackParamList = {
  Auth: undefined;
  Onboarding: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Welcome: undefined;
  RoleSelect: undefined;
  RegisterCustomer: undefined;
  RegisterTrainer: undefined;
  Otp: { userId: string; method: 'email' | 'sms'; identifier: string };
  Login: undefined;
};

export type OnboardingStackParamList = {
  EmiratesIdUpload: { userId: string; userType: 'customer' | 'trainer' };
  AgeCheck: { userId: string };
  ParentalConsent: { userId: string; childName: string; childDob: string };
  TrainerCertifications: { userId: string };
  TrainerReferences: { userId: string };
  TrainerIntroVideo: { userId: string };
  VerificationPending: { userId: string; userType: 'customer' | 'trainer' };
};

export type MainStackParamList = {
  MainTabs: undefined;
  ProfileEdit: undefined;
};

export type MainTabsParamList = {
  Home: undefined;
  Discovery: undefined;
  Bookings: undefined;
  Settings: undefined;
};

export type WelcomeScreenProps = NativeStackScreenProps<AuthStackParamList, 'Welcome'>;
export type RoleSelectScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  'RoleSelect'
>;
export type RegisterCustomerScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  'RegisterCustomer'
>;
export type RegisterTrainerScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  'RegisterTrainer'
>;
export type OtpScreenProps = NativeStackScreenProps<AuthStackParamList, 'Otp'>;
export type EmiratesIdUploadScreenProps = NativeStackScreenProps<
  OnboardingStackParamList,
  'EmiratesIdUpload'
>;
export type AgeCheckScreenProps = NativeStackScreenProps<
  OnboardingStackParamList,
  'AgeCheck'
>;
export type ParentalConsentScreenProps = NativeStackScreenProps<
  OnboardingStackParamList,
  'ParentalConsent'
>;
export type TrainerCertificationsScreenProps = NativeStackScreenProps<
  OnboardingStackParamList,
  'TrainerCertifications'
>;
export type TrainerReferencesScreenProps = NativeStackScreenProps<
  OnboardingStackParamList,
  'TrainerReferences'
>;
export type TrainerIntroVideoScreenProps = NativeStackScreenProps<
  OnboardingStackParamList,
  'TrainerIntroVideo'
>;
export type VerificationPendingScreenProps = NativeStackScreenProps<
  OnboardingStackParamList,
  'VerificationPending'
>;
export type HomeScreenProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabsParamList, 'Home'>,
  NativeStackScreenProps<MainStackParamList>
>;
export type SettingsScreenProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabsParamList, 'Settings'>,
  NativeStackScreenProps<MainStackParamList>
>;
