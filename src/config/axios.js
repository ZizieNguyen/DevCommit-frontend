import axios from 'axios';

const API_URL = '/api/proxy';

console.log('Configurando axios con baseURL:', '/api/proxy');

export const clienteAxios = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  withCredentials: false
});

clienteAxios.interceptors.request.use(
  config => {
    console.log('Axios realizando petición a:', config.url);
    console.log('Con baseURL:', config.baseURL);
    console.log('URL completa:', config.baseURL + config.url);

    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Interceptor para incluir token en todas las peticiones
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