import axios from 'axios';
import type { UpdateProfileInput, ChangePasswordInput, ResetPasswordInput } from '../../types/user'
import { API_ROUTES } from '../../constants/apiRoutes';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1/user';

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return { Authorization: `Bearer ${user.token}` };
};

export const userProfileService = {
  getProfile: async () => {
    const response = await axios.get(`${API_URL}${API_ROUTES.USER_PROFILE.PROFILE}`, { headers: getAuthHeader() });
    return response.data;
  },

  updateProfile: async (data: UpdateProfileInput) => {
    const response = await axios.patch(`${API_URL}${API_ROUTES.USER_PROFILE.PROFILE}`, data, { headers: getAuthHeader() });
    return response.data;
  },

  updateAvatar: async (formData: FormData) => {
    const response = await axios.post(`${API_URL}${API_ROUTES.USER_PROFILE.AVATAR}`, formData, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  changePassword: async (data: ChangePasswordInput) => {
    const response = await axios.post(`${API_URL}${API_ROUTES.USER_PROFILE.CHANGE_PASSWORD}`, data, { headers: getAuthHeader() });
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await axios.post(`${API_URL}${API_ROUTES.USER_PROFILE.FORGOT_PASSWORD}`, { email });
    return response.data;
  },

  resetPassword: async (data: ResetPasswordInput) => {
    const response = await axios.post(`${API_URL}${API_ROUTES.USER_PROFILE.RESET_PASSWORD}`, data);
    return response.data;
  },
};
