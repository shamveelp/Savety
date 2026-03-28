import axiosInstance from '../axiosInstance';
import { type SignupInput, type LoginInput } from '../../validations/auth.validation';

export interface UserAuthResponse {
  message: string;
  token?: string;
  id?: string;
  username?: string;
  email?: string;
}

export const userAuthService = {
  async signup(data: SignupInput): Promise<UserAuthResponse> {
    const response = await axiosInstance.post('/user/auth/signup', data);
    return response.data;
  },

  async login(data: LoginInput): Promise<UserAuthResponse> {
    const response = await axiosInstance.post('/user/auth/login', data);
    return response.data;
  },

  async verifyOTP(email: string, otp: string): Promise<UserAuthResponse> {
    const response = await axiosInstance.post('/user/auth/verify-otp', { email, otp });
    return response.data;
  },
};
