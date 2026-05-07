import axios, { AxiosInstance, AxiosError } from 'axios';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';
import { ApiError, mapStatusCodeToMessage } from '../utils/errors';

const API_BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl || 'http://localhost:3001/api/v1';
const MOCK_API = Constants.expoConfig?.extra?.mockApi === true;

class ApiClient {
  private client: AxiosInstance;
  private refreshing = false;
  private refreshSubscribers: Array<(token: string) => void> = [];

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.request.use(
      async (config) => {
        const token = await SecureStore.getItemAsync('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config;

        if (
          error.response?.status === 401 &&
          originalRequest &&
          !this.isRetryRequest(originalRequest) &&
          originalRequest.url !== '/auth/refresh'
        ) {
          return this.handle401Error(originalRequest);
        }

        const statusCode = error.response?.status || 500;
        const code = (error.response?.data as Record<string, unknown>)?.code || 'UNKNOWN_ERROR';
        const message =
          (error.response?.data as Record<string, unknown>)?.error ||
          mapStatusCodeToMessage(statusCode);

        throw ApiError.fromResponse({
          statusCode,
          code: code as string,
          error: message as string,
          details: (error.response?.data as Record<string, unknown>)?.details,
        });
      }
    );
  }

  private isRetryRequest(config: any): boolean {
    return config.__isRetryRequest === true;
  }

  private async handle401Error(originalRequest: any): Promise<any> {
    if (this.refreshing) {
      return new Promise((resolve) => {
        this.refreshSubscribers.push((token: string) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(this.client(originalRequest));
        });
      });
    }

    this.refreshing = true;
    originalRequest.__isRetryRequest = true;

    try {
      const refreshToken = await SecureStore.getItemAsync('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await this.client.post('/auth/refresh', { refreshToken });
      const { accessToken, refreshToken: newRefreshToken } = response.data;

      await SecureStore.setItemAsync('access_token', accessToken);
      await SecureStore.setItemAsync('refresh_token', newRefreshToken);

      originalRequest.headers.Authorization = `Bearer ${accessToken}`;

      this.refreshSubscribers.forEach((callback) => callback(accessToken));
      this.refreshSubscribers = [];

      return this.client(originalRequest);
    } catch (refreshError) {
      await SecureStore.deleteItemAsync('access_token');
      await SecureStore.deleteItemAsync('refresh_token');
      throw refreshError;
    } finally {
      this.refreshing = false;
    }
  }

  public getClient(): AxiosInstance {
    return this.client;
  }

  public isMockMode(): boolean {
    return MOCK_API;
  }
}

export const apiClient = new ApiClient();
