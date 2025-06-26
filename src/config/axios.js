import axios from 'axios';

// Usar la URL de la API desde variables de entorno
const API_URL = import.meta.env.VITE_API_URL || 'https://hangv1-2425.proyectosdwa.es/backend/public';

export const clienteAxios = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',

  },
  withCredentials: false
});

// Interceptor para incluir token en todas las peticiones
clienteAxios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Interceptor para manejar errores de autenticación
clienteAxios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);