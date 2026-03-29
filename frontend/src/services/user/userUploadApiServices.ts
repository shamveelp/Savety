import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return { Authorization: `Bearer ${user.token || ''}` };
};

export const uploadMemories = async (formData: FormData) => {
  const response = await axios.post(`${API_URL}/uploads`, formData, {
    headers: {
      ...getAuthHeader(),
      'Content-Type': 'multipart/form-data',
    }
  });
  return response.data;
};

export const getUserUploads = async () => {
  const response = await axios.get(`${API_URL}/uploads`, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const getUploadDetails = async (id: string) => {
  const response = await axios.get(`${API_URL}/uploads/${id}`, { 
    headers: getAuthHeader() 
  });
  return response.data;
};

export const deleteUpload = async (id: string) => {
  const response = await axios.delete(`${API_URL}/uploads/${id}`, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const updateUpload = async (id: string, formData: FormData) => {
  const response = await axios.put(`${API_URL}/uploads/${id}`, formData, {
    headers: {
      ...getAuthHeader(),
      'Content-Type': 'multipart/form-data',
    }
  });
  return response.data;
};

export const getExploreUploads = async (page = 1, limit = 12) => {
  const response = await axios.get(`${API_URL}/uploads/explore?page=${page}&limit=${limit}`, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const toggleLike = async (id: string) => {
  const response = await axios.post(`${API_URL}/uploads/${id}/like`, {}, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const getPublicProfile = async (userId: string) => {
  const response = await axios.get(`${API_URL}/uploads/profile/${userId}`);
  return response.data;
};

export const getUploadBySlug = async (username: string, slug: string) => {
  const response = await axios.get(`${API_URL}/uploads/s/${username}/${slug}`);
  return response.data;
};
