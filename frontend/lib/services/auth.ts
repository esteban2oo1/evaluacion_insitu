import api from '../api';
import {
  LoginRequest,
  LoginResponse,
  ErrorResponse,
  ProfileResponse
} from '../types/auth';

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await api.post<LoginResponse | ErrorResponse>('/auth/login', credentials);

      if (response.status === 200 && response.data.success && 'data' in response.data) {
        const { token } = response.data.data;
        localStorage.setItem('token', token);
        return response.data as LoginResponse;
      }

      const errorResponse = response.data as ErrorResponse;
      throw errorResponse;

    } catch (error: any) {
      if (error.response && error.response.data) {
        const backendError: ErrorResponse = {
          success: false,
          message: error.response.data.message || 'Credenciales inválidas',
          error: error.response.data.error || 'Usuario o contraseña incorrectos',
        };
        throw backendError;
      }

      throw {
        success: false,
        message: 'Error al iniciar sesión',
        error: error.message || 'Error desconocido',
      } as ErrorResponse;
    }
  },

  getProfile: async (): Promise<ProfileResponse> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No hay token de autenticación');
      const response = await api.get<ProfileResponse>('/auth/profile');
      return response.data;
    } catch (error) {
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
