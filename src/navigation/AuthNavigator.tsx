import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../types/navigation';
import WelcomeScreen from '../screens/WelcomeScreen';
import RoleSelectScreen from '../screens/RoleSelectScreen';
import RegisterCustomerScreen from '../screens/auth/RegisterCustomerScreen';
import RegisterTrainerScreen from '../screens/auth/RegisterTrainerScreen';
import OtpScreen from '../screens/auth/OtpScreen';
import LoginScreen from '../screens/auth/LoginScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator(): React.ReactElement {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="RoleSelect" component={RoleSelectScreen} />
      <Stack.Screen name="RegisterCustomer" component={RegisterCustomerScreen} />
      <Stack.Screen name="RegisterTrainer" component={RegisterTrainerScreen} />
      <Stack.Screen name="Otp" component={OtpScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
}
