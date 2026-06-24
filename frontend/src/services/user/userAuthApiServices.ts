import axiosInstance from '../axiosInstance';
import { type SignupInput, type LoginInput } from '../../validations/auth.validation';
import { API_ROUTES } from '../../constants/apiRoutes';

export interface UserAuthResponse {
  message: string;
  token?: string;
  id?: string;
  username?: string;
  email?: string;
}

export const userAuthService = {
  async signup(data: SignupInput): Promise<UserAuthResponse> {
    const response = await axiosInstance.post(API_ROUTES.USER_AUTH.SIGNUP, data);
    return response.data;
  },

  async login(data: LoginInput): Promise<UserAuthResponse> {
    const response = await axiosInstance.post(API_ROUTES.USER_AUTH.LOGIN, data);
    return response.data;
  },

  async verifyOTP(email: string, otp: string): Promise<UserAuthResponse> {
    const response = await axiosInstance.post(API_ROUTES.USER_AUTH.VERIFY_OTP, { email, otp });
    return response.data;
  },
};
