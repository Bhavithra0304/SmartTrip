import React, { createContext, useContext, useState, useEffect } from 'react';
import { tripService } from '../services/tripService';

const TripContext = createContext(null);

export const TripProvider = ({ children }) => {
  const [trips, setTrips] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [currentTrip, setCurrentTrip] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [agentLogs, setAgentLogs] = useState([]);

  const fetchUserTrips = async () => {
    setLoading(true);
    try {
      const data = await tripService.getUserTrips();
      setTrips(data);
    } catch (err) {
      console.error('Failed to fetch trips', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const data = await tripService.getFavorites();
      setFavorites(data);
    } catch (err) {
      console.error('Failed to fetch favorites', err);
    }
  };

  const generateNewTrip = async (destination, budget, travel_dates, num_travelers, interests) => {
    setGenerating(true);
    setAgentLogs([]);
    try {
      const data = await tripService.generateTrip(destination, budget, travel_dates, num_travelers, interests);
      setCurrentTrip(data);
      if (data.agent_logs) {
        setAgentLogs(data.agent_logs);
      }
      setTrips(prev => [data, ...prev]);
      return data;
    } catch (err) {
      console.error('Failed to generate trip', err);
      throw err;
    } finally {
      setGenerating(false);
    }
  };

  const deleteTrip = async (id) => {
    await tripService.deleteTrip(id);
    setTrips(prev => prev.filter(t => t.id !== id));
    if (currentTrip && currentTrip.id === id) {
      setCurrentTrip(null);
    }
  };

  const addFavorite = async (favData) => {
    const newFav = await tripService.addFavorite(favData);
    setFavorites(prev => [newFav, ...prev]);
    return newFav;
  };

  const removeFavorite = async (id) => {
    await tripService.removeFavorite(id);
    setFavorites(prev => prev.filter(f => f.id !== id));
  };

  return (
    <TripContext.Provider value={{
      trips,
      favorites,
      currentTrip,
      setCurrentTrip,
      loading,
      generating,
      agentLogs,
      fetchUserTrips,
      fetchFavorites,
      generateNewTrip,
      deleteTrip,
      addFavorite,
      removeFavorite
    }}>
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = () => useContext(TripContext);
