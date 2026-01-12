import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:3009',
  withCredentials: true, // Important for session cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth APIs
export const checkSession = () => api.get('/api/auth/check-session');
export const login = (email, password) => api.post('/api/auth/login', { email, password });
export const signup = (userData) => api.post('/api/auth/signup', userData);
export const logout = () => api.post('/api/auth/logout');

// Store APIs
export const getIndex = () => api.get('/api');
export const getHomes = () => api.get('/api/homes');
export const getHomeDetails = (homeId) => api.get(`/api/homes/${homeId}`);
export const getBookings = () => api.get('/api/bookings');
export const getFavourites = () => api.get('/api/favourites');
export const addToFavourite = (homeId) => api.post('/api/favourites', { id: homeId });
export const removeFromFavourite = (homeId) => api.post(`/api/favourites/delete/${homeId}`);

// Host APIs
export const getAddHome = () => api.get('/api/host/add-home');
export const addHome = (formData) => {
  return api.post('/api/host/add-home', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
export const getHostHomes = () => api.get('/api/host/host-home-list');
export const getEditHome = (homeId) => api.get(`/api/host/edit-home/${homeId}?editing=true`);
export const editHome = (formData) => {
  return api.post('/api/host/edit-home', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
export const deleteHome = (homeId) => api.post(`/api/host/delete-home/${homeId}`);

export default api;
