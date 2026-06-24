import axios from 'axios';
import { API_ROUTES } from '../../constants/apiRoutes';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return { Authorization: `Bearer ${user.token || ''}` };
};

export const uploadMemories = async (formData: FormData) => {
  const response = await axios.post(`${API_URL}${API_ROUTES.UPLOADS.BASE}`, formData, {
    headers: {
      ...getAuthHeader(),
      'Content-Type': 'multipart/form-data',
    }
  });
  return response.data;
};

export const getUserUploads = async () => {
  const response = await axios.get(`${API_URL}${API_ROUTES.UPLOADS.BASE}`, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const getUploadDetails = async (id: string) => {
  const response = await axios.get(`${API_URL}${API_ROUTES.UPLOADS.BASE}/${id}`, { 
    headers: getAuthHeader() 
  });
  return response.data;
};

export const deleteUpload = async (id: string) => {
  const response = await axios.delete(`${API_URL}${API_ROUTES.UPLOADS.BASE}/${id}`, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const updateUpload = async (id: string, formData: FormData) => {
  const response = await axios.put(`${API_URL}${API_ROUTES.UPLOADS.BASE}/${id}`, formData, {
    headers: {
      ...getAuthHeader(),
      'Content-Type': 'multipart/form-data',
    }
  });
  return response.data;
};

export const getExploreUploads = async (page = 1, limit = 12) => {
  const response = await axios.get(`${API_URL}${API_ROUTES.UPLOADS.EXPLORE}?page=${page}&limit=${limit}`, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const toggleLike = async (id: string) => {
  const response = await axios.post(`${API_URL}${API_ROUTES.UPLOADS.LIKE(id)}`, {}, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const getPublicProfile = async (userId: string) => {
  const response = await axios.get(`${API_URL}${API_ROUTES.UPLOADS.PUBLIC_PROFILE(userId)}`);
  return response.data;
};

export const getUploadBySlug = async (username: string, slug: string, token?: string) => {
  const url = `${API_URL}${API_ROUTES.UPLOADS.BY_SLUG(username, slug)}${token ? `?token=${token}` : ''}`
  const response = await axios.get(url, { headers: getAuthHeader() });
  return response.data;
};

export const toggleShare = async (id: string) => {
  const response = await axios.post(`${API_URL}${API_ROUTES.UPLOADS.SHARE(id)}`, {}, {
    headers: getAuthHeader()
  });
  return response.data;
};
