import api from '@/lib/api';
import { UserRolesRequest, UserRoles, User } from '@/lib/types/evaluacionInsitu';

export const userRolesService = {
  getAll: async (): Promise<UserRoles[]> => {
    const response = await api.get('/user-roles');
    return response.data.data;
  },

  SearchUser: async (username: string): Promise<User[]> => {
    const response = await api.get(`/user-roles/search/${username}`);
    return response.data.data;
  },

  getById: async (userId: number): Promise<UserRoles> => {
    const response = await api.get(`/user-roles/${userId}`);
    return response.data.data;
  },

  create: async (data: UserRolesRequest): Promise<UserRoles> => {
    const response = await api.post('/user-roles', data);
    return response.data.data;
  },

  update: async (id: number, data: Partial<UserRolesRequest>): Promise<UserRoles> => {
    const response = await api.put(`/user-roles/${id}`, data);
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/user-roles/${id}`);
  }
};
