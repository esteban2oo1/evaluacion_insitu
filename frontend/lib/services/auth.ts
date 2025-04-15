import api from '../api';
import { LoginRequest, LoginResponse, ProfileResponse } from '../types/auth';

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      console.log('URL base:', api.defaults.baseURL);
      console.log('Credenciales:', credentials);
      const response = await api.post<LoginResponse>('/auth/login', credentials);
      console.log('Respuesta:', response);
      // Guardar el token en localStorage
      if (response.data.success && response.data.data.token) {
        localStorage.setItem('token', response.data.data.token);
        // Configurar el token en el header de axios para futuras peticiones
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.data.token}`;
      }
      return response.data;
    } catch (error) {
      console.error('Error en el login:', error);
      throw error;
    }
  },

  getProfile: async (): Promise<ProfileResponse> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }
      // Asegurarse de que el token esté en los headers
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await api.get<ProfileResponse>('/auth/profile');
      return response.data;
    } catch (error) {
      console.error('Error al obtener el perfil:', error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  }
}; 