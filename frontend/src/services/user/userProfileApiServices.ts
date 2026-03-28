import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1/user';

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return { Authorization: `Bearer ${user.token}` };
};

export const userProfileService = {
  getProfile: async () => {
    const response = await axios.get(`${API_URL}/profile`, { headers: getAuthHeader() });
    return response.data;
  },

  updateProfile: async (data: any) => {
    const response = await axios.patch(`${API_URL}/profile`, data, { headers: getAuthHeader() });
    return response.data;
  },

  updateAvatar: async (formData: FormData) => {
    const response = await axios.post(`${API_URL}/avatar`, formData, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  changePassword: async (data: any) => {
    const response = await axios.post(`${API_URL}/change-password`, data, { headers: getAuthHeader() });
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
    return response.data;
  },

  resetPassword: async (data: any) => {
    const response = await axios.post(`${API_URL}/auth/reset-password`, data);
    return response.data;
  },
};
