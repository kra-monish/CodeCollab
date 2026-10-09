import axios from 'axios';

const getApiBaseUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL;

  if (apiUrl) {
    return apiUrl;
  }

  return '/api';
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true
});

export default api;
