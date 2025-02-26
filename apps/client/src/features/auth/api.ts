import axios from 'axios';
import { axiosInstance } from '@/lib/axios';
import { BaseResponse } from '@/features/types.ts';
import {
  LoginRequestDto,
  LoginResult,
  RegisterRequestDto,
  RegisterResult,
} from '@/features/auth/types.ts';
import { ENV } from '@/config/env';

const { API_BASE_URL } = ENV;

export const authAPI = {
  login: async (loginRequestDto: LoginRequestDto) => {
    const { data } = await axios.post<BaseResponse<LoginResult>>(
      `${API_BASE_URL}/auth/signin`,
      loginRequestDto,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return data;
  },

  logout: async () => {
    const { data } = await axiosInstance.post<BaseResponse>('/auth/signout');

    return data;
  },

  register: async (registerRequestDto: RegisterRequestDto) => {
    const { data } = await axios.post<BaseResponse<RegisterResult>>(
      `${API_BASE_URL}/auth/signup`,
      registerRequestDto,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return data;
  },
};
