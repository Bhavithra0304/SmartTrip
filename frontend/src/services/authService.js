import api from './api';

export const authService = {
  async register(full_name, email, password) {
    const res = await api.post('/auth/register', { full_name, email, password });
    if (res.data.access_token) {
      localStorage.setItem('smarttrip_token', res.data.access_token);
    }
    return res.data;
  },

  async login(email, password) {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.access_token) {
      localStorage.setItem('smarttrip_token', res.data.access_token);
    }
    return res.data;
  },

  async getCurrentUser() {
    const res = await api.get('/auth/me');
    return res.data;
  },

  async updateProfile(profileData) {
    const res = await api.put('/auth/profile', profileData);
    return res.data;
  },

  logout() {
    localStorage.removeItem('smarttrip_token');
  }
};
