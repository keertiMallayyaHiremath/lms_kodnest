import apiClient from './apiClient';

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export const authApi = {
  register: async (email: string, password: string, name: string): Promise<AuthResponse> => {
    const { data } = await apiClient.post('/auth/register', { email, password, name });
    return data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const { data } = await apiClient.post('/auth/login', { email, password });
    return data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  refresh: async (): Promise<AuthResponse> => {
    const { data } = await apiClient.post('/auth/refresh');
    return data;
  },
};
