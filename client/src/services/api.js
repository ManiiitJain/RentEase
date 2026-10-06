import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to append JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('rentease_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors gracefully
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized, clear invalid token and state if needed
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        localStorage.removeItem('rentease_token');
        localStorage.removeItem('rentease_user');
      }
    }
    return Promise.reject(error);
  }
);

// API Service modules
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
};

export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
};

export const propertyAPI = {
  getProperties: (params) => api.get('/properties', { params }),
  getPropertyById: (id) => api.get(`/properties/${id}`),
  createProperty: (data) => api.post('/properties', data),
  updateProperty: (id, data) => api.put(`/properties/${id}`, data),
  deleteProperty: (id) => api.delete(`/properties/${id}`),
  getMyProperties: () => api.get('/properties/owner/mine'),
};

export const requestAPI = {
  createRequest: (data) => api.post('/requests', data),
  getMyRequests: () => api.get('/requests/my'),
  getOwnerRequests: () => api.get('/requests/owner'),
  updateStatus: (id, status) => api.put(`/requests/${id}`, { status }),
};

export const favoriteAPI = {
  getFavorites: () => api.get('/favorites'),
  addFavorite: (propertyId) => api.post(`/favorites/${propertyId}`),
  removeFavorite: (propertyId) => api.delete(`/favorites/${propertyId}`),
};

export const uploadAPI = {
  uploadImages: (formData) =>
    api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

export default api;
