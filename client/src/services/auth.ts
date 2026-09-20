import api from './api';
import { useAuthStore } from '../store/authStore';

export interface LoginData { email: string; password: string; }
export interface RegisterData { email: string; username: string; password: string; displayName: string; }

export const authService = {
  async login(data: LoginData) {
    const res = await api.post('/auth/login', data);
    const { token, user } = res.data.data;
    useAuthStore.getState().setAuth(user, token);
    return { token, user };
  },

  async register(data: RegisterData) {
    const res = await api.post('/auth/register', data);
    const { token, user } = res.data.data;
    useAuthStore.getState().setAuth(user, token);
    return { token, user };
  },

  async getMe() {
    const res = await api.get('/auth/me');
    return res.data.data;
  },

  logout() {
    useAuthStore.getState().logout();
  },
};
