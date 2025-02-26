import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { ENV } from '@/config/env';
import { AuthState } from '@/features/auth/types.ts';

const { API_BASE_URL, AUTH_STORAGE_KEY } = ENV;

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    try {
      const authStorageString = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!authStorageString) {
        return config;
      }

      const authContext = JSON.parse(authStorageString) as AuthState;
      const { accessToken } = authContext;

      const newConfig = { ...config };
      newConfig.headers.Authorization = `Bearer ${accessToken}`;

      return newConfig;
    } catch {
      return config;
    }
  }
);

/* eslint no-underscore-dangle: 0 */
let isRefreshing = false;

axiosInstance.interceptors.response.use(
  (response) => Promise.resolve(response),
  async (error) => {
    if (error.response?.status !== 401 || error.config.url === '/auth/refresh' || isRefreshing) {
      return Promise.reject(error);
    }

    try {
      isRefreshing = true;
      const response = await axiosInstance.post('/auth/refresh');

      if (response.status !== 200) {
        throw new Error('Refresh token failed');
      }

      const { username, accessToken, profileImage } = response.data.result;
      const authStorage: AuthState = {
        accessToken,
        isAuthenticated: true,
        username,
        profileImage,
      };

      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authStorage));

      const newConfig = { ...error.config };
      newConfig.headers.Authorization = `Bearer ${accessToken}`;

      return axiosInstance(newConfig);
    } catch {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      window.location.href = '/login'; // 로그인 페이지로 리다이렉트
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  }
);
