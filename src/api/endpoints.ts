import { apiClient } from './client';
import {
  RegisterRequest,
  RegisterResponse,
  OtpVerifyRequest,
  OtpVerifyResponse,
  UserData,
} from '../types/api';

const api = apiClient.getClient();

export const authApi = {
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await api.post<RegisterResponse>('/auth/register', data);
    return response.data;
  },

  verifyOtp: async (data: OtpVerifyRequest): Promise<OtpVerifyResponse> => {
    const response = await api.post<OtpVerifyResponse>('/auth/verify-otp', data);
    return response.data;
  },

  resendOtp: async (userId: string): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>('/auth/resend-otp', { userId });
    return response.data;
  },

  refreshToken: async (refreshToken: string): Promise<OtpVerifyResponse> => {
    const response = await api.post<OtpVerifyResponse>('/auth/refresh', { refreshToken });
    return response.data;
  },

  getUserProfile: async (): Promise<UserData> => {
    const response = await api.get<UserData>('/auth/profile');
    return response.data;
  },

  logout: async (): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>('/auth/logout');
    return response.data;
  },
};

export const documentsApi = {
  requestPresignedUrl: async (
    documentType: string,
    fileName: string,
    fileType: string
  ): Promise<{ presignedUrl: string; path: string }> => {
    const response = await api.post<{ presignedUrl: string; path: string }>(
      '/documents/presigned-url',
      {
        documentType,
        fileName,
        fileType,
      }
    );
    return response.data;
  },

  confirmUpload: async (
    documentType: string,
    path: string
  ): Promise<{ success: boolean; documentPath: string }> => {
    const response = await api.post<{ success: boolean; documentPath: string }>(
      '/documents/confirm',
      {
        documentType,
        path,
      }
    );
    return response.data;
  },

  uploadFile: async (presignedUrl: string, file: Blob, onProgress?: (percent: number) => void): Promise<void> => {
    await api.put(presignedUrl, file, {
      headers: {
        'Content-Type': file.type,
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percent = Math.round((progressEvent.loaded / progressEvent.total) * 100);
          onProgress(percent);
        }
      },
    });
  },
};

export const userApi = {
  updateProfile: async (data: Partial<UserData>): Promise<UserData> => {
    const response = await api.patch<UserData>('/users/profile', data);
    return response.data;
  },

  uploadEmiratesId: async (documentPath: string): Promise<{ success: boolean }> => {
    const response = await api.post<{ success: boolean }>('/users/emirates-id', {
      documentPath,
    });
    return response.data;
  },

  checkAge: async (dateOfBirth: string): Promise<{ age: number; isUnder18: boolean }> => {
    const response = await api.post<{ age: number; isUnder18: boolean }>('/users/check-age', {
      dateOfBirth,
    });
    return response.data;
  },

  submitParentalConsent: async (parentEmail: string): Promise<{ sent: boolean }> => {
    const response = await api.post<{ sent: boolean }>('/users/parental-consent', {
      parentEmail,
    });
    return response.data;
  },
};

export const trainerApi = {
  submitApplication: async (data: any): Promise<{ applicationId: string; status: string }> => {
    const response = await api.post<{ applicationId: string; status: string }>(
      '/trainers/application',
      data
    );
    return response.data;
  },

  getApplicationStatus: async (): Promise<{ status: string; createdAt: string }> => {
    const response = await api.get<{ status: string; createdAt: string }>(
      '/trainers/application-status'
    );
    return response.data;
  },
};
