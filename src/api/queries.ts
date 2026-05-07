import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../state/authStore';
import { authApi, documentsApi, userApi, trainerApi } from './endpoints';
import { RegisterRequest, OtpVerifyRequest } from '../types/api';
import * as SecureStore from 'expo-secure-store';

export const useRegisterMutation = () => {
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: (response) => {
      console.log('Registration successful:', response.userId);
    },
  });
};

export const useVerifyOtpMutation = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const setTokens = useAuthStore((state) => state.setTokens);

  return useMutation({
    mutationFn: (data: OtpVerifyRequest) => authApi.verifyOtp(data),
    onSuccess: async (response) => {
      setUser(response.user);
      setTokens({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        expiresIn: 3600,
      });

      await SecureStore.setItemAsync('access_token', response.accessToken);
      await SecureStore.setItemAsync('refresh_token', response.refreshToken);
    },
  });
};

export const useResendOtpMutation = () => {
  return useMutation({
    mutationFn: (userId: string) => authApi.resendOtp(userId),
  });
};

export const useGetUserProfileQuery = (enabled = true) => {
  return useQuery({
    queryKey: ['user', 'profile'],
    queryFn: () => authApi.getUserProfile(),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
};

export const useLogoutMutation = () => {
  const logout = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: async () => {
      await logout();
    },
  });
};

export const useRequestPresignedUrlMutation = () => {
  return useMutation({
    mutationFn: (params: { documentType: string; fileName: string; fileType: string }) =>
      documentsApi.requestPresignedUrl(
        params.documentType,
        params.fileName,
        params.fileType
      ),
  });
};

export const useUploadFileMutation = () => {
  return useMutation({
    mutationFn: (params: {
      presignedUrl: string;
      file: Blob;
      onProgress?: (percent: number) => void;
    }) => documentsApi.uploadFile(params.presignedUrl, params.file, params.onProgress),
  });
};

export const useConfirmUploadMutation = () => {
  return useMutation({
    mutationFn: (params: { documentType: string; path: string }) =>
      documentsApi.confirmUpload(params.documentType, params.path),
  });
};

export const useCheckAgeMutation = () => {
  return useMutation({
    mutationFn: (dateOfBirth: string) => userApi.checkAge(dateOfBirth),
  });
};

export const useSubmitParentalConsentMutation = () => {
  return useMutation({
    mutationFn: (parentEmail: string) => userApi.submitParentalConsent(parentEmail),
  });
};

export const useSubmitTrainerApplicationMutation = () => {
  return useMutation({
    mutationFn: (data: any) => trainerApi.submitApplication(data),
  });
};

export const useGetTrainerApplicationStatusQuery = (enabled = true) => {
  return useQuery({
    queryKey: ['trainer', 'application-status'],
    queryFn: () => trainerApi.getApplicationStatus(),
    enabled,
    refetchInterval: 30000, // Poll every 30 seconds
    staleTime: 5000,
  });
};
