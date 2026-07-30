import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, MapPin, Calendar, Trash2, ArrowRight, Search } from 'lucide-react';
import { useTrip } from '../context/TripContext';
import './SavedTrips.css';

const SavedTrips = () => {
  const { trips, fetchUserTrips, deleteTrip, loading } = useTrip();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUserTrips();
  }, []);

  const filteredTrips = trips.filter(t => 
    t.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="saved-trips-page animate-fade-in">
      <div className="saved-container">
        <div className="saved-header card">
          <div className="header-left">
            <Bookmark size={24} color="#4A90E2" />
            <div>
              <h2>Your Saved Itineraries</h2>
              <p>Manage and review your saved AI multi-agent travel plans</p>
            </div>
          </div>
          <div className="search-box">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search saved trips..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <p className="text-center">Loading your saved trips...</p>
        ) : filteredTrips.length > 0 ? (
          <div className="trips-grid">
            {filteredTrips.map((t) => (
              <div key={t.id} className="saved-trip-card card">
                <div className="card-top">
                  <span className="dest-badge">📍 {t.destination}</span>
                  <button 
                    onClick={() => deleteTrip(t.id)}
                    className="delete-btn"
                    title="Delete Trip"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <h3>{t.title}</h3>
                <div className="meta-info">
                  <span>📅 {t.travel_dates}</span>
                  <span>💰 ${t.budget}</span>
                  <span>👥 {t.num_travelers} Traveler(s)</span>
                </div>
                <Link to={`/trip/${t.id}`} className="btn-primary full-width flex-center">
                  View Full Details <ArrowRight size={16} />
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-card card text-center">
            <h3>No saved trips found</h3>
            <p>Generate a new trip using our 6 AI Agents!</p>
            <Link to="/planner" className="btn-primary mt-2">
              Plan A Trip Now
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedTrips;
