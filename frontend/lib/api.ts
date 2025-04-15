import axios from 'axios';

// Configuración base de axios
const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Aquí puedes manejar los errores globales
    console.error('Error en la petición:', error);
    return Promise.reject(error);
  }
);

export default api; 