import api from './api';

export const tripService = {
  async generateTrip(destination, budget, travel_dates, num_travelers, interests) {
    const res = await api.post('/trips/generate', {
      destination,
      budget: parseFloat(budget),
      travel_dates,
      num_travelers: parseInt(num_travelers, 10),
      interests
    });
    return res.data;
  },

  async getUserTrips() {
    const res = await api.get('/trips/');
    return res.data;
  },

  async getTripById(id) {
    const res = await api.get(`/trips/${id}`);
    return res.data;
  },

  async deleteTrip(id) {
    const res = await api.delete(`/trips/${id}`);
    return res.data;
  },

  async addFavorite(favoriteData) {
    const res = await api.post('/trips/favorites', favoriteData);
    return res.data;
  },

  async getFavorites() {
    const res = await api.get('/trips/favorites/list');
    return res.data;
  },

  async removeFavorite(id) {
    const res = await api.delete(`/trips/favorites/${id}`);
    return res.data;
  },

  async queryChat(message, history = []) {
    const res = await api.post('/chat/query', { message, history });
    return res.data;
  },

  async getDashboardStats() {
    const res = await api.get('/user/dashboard-stats');
    return res.data;
  },

  async getSettings() {
    const res = await api.get('/settings/');
    return res.data;
  }
};
