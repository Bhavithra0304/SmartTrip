import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, MapPin, Calendar, DollarSign, Bookmark, CloudSun, ArrowRight, Compass } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { tripService } from '../services/tripService';
import WeatherWidget from '../components/WeatherWidget';
import BudgetChart from '../components/BudgetChart';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    tripService.getDashboardStats()
      .then(data => setStats(data))
      .catch(err => console.error('Failed to load dashboard stats:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="dashboard-page animate-fade-in text-center" style={{ padding: '4rem 1.5rem' }}>
        <h3>Loading your AI Travel Dashboard...</h3>
      </div>
    );
  }

  return (
    <div className="dashboard-page animate-fade-in">
      <div className="dashboard-container">
        {/* Top Welcome Bar */}
        <div className="dashboard-header card">
          <div className="welcome-info">
            <h2>Welcome back, {user?.full_name || 'Traveler'}! 👋</h2>
            <p>Your Master AI Agent has generated <strong>{stats?.total_trips || 0} trips</strong> with <strong>${stats?.total_budget_planned || 0}</strong> total planned budget.</p>
          </div>
          <Link to="/planner" className="btn-primary">
            <PlusCircle size={18} /> Quick Plan New Trip
          </Link>
        </div>

        {/* Overview Stats Bar */}
        <div className="stats-row">
          <div className="stat-card card">
            <div className="stat-icon bg-blue"><MapPin size={22} /></div>
            <div>
              <span className="stat-num">{stats?.total_trips || 0}</span>
              <span className="stat-label">Total Generated Trips</span>
            </div>
          </div>
          <div className="stat-card card">
            <div className="stat-icon bg-green"><Bookmark size={22} /></div>
            <div>
              <span className="stat-num">{stats?.total_favorites || 0}</span>
              <span className="stat-label">Saved Favorites</span>
            </div>
          </div>
          <div className="stat-card card">
            <div className="stat-icon bg-purple"><DollarSign size={22} /></div>
            <div>
              <span className="stat-num">${stats?.total_budget_planned || 0}</span>
              <span className="stat-label">Budget Managed</span>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="dashboard-grid">
          {/* Main Column */}
          <div className="main-col">
            {/* Upcoming / Recent Trips */}
            <div className="section-card card">
              <div className="card-header-flex">
                <h3><Calendar size={18} className="header-icon" /> Upcoming & Saved Trips</h3>
                <Link to="/saved" className="link-more">View All ({stats?.total_trips || 0})</Link>
              </div>

              {stats?.upcoming_trips && stats.upcoming_trips.length > 0 ? (
                <div className="trips-list">
                  {stats.upcoming_trips.map((t) => (
                    <div key={t.id} className="trip-item">
                      <div className="trip-item-left">
                        <div className="trip-icon"><Compass size={20} color="#4A90E2" /></div>
                        <div>
                          <h4>{t.title}</h4>
                          <span className="trip-dates">📍 {t.destination} • 📅 {t.travel_dates}</span>
                        </div>
                      </div>
                      <div className="trip-item-right">
                        <span className="trip-budget">${t.budget}</span>
                        <Link to={`/trip/${t.id}`} className="btn-secondary btn-sm">
                          Details <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p>No trips planned yet. Click "Quick Plan New Trip" to get started!</p>
                </div>
              )}
            </div>

            {/* Budget Summary Component */}
            {stats?.upcoming_trips?.[0]?.budget_breakdown && (
              <BudgetChart budgetBreakdown={stats.upcoming_trips[0].budget_breakdown} />
            )}
          </div>

          {/* Side Column */}
          <div className="side-col">
            {/* Weather Widget */}
            {stats?.latest_weather_widget && (
              <WeatherWidget weatherInfo={stats.latest_weather_widget} />
            )}

            {/* Recent Searches */}
            <div className="section-card card">
              <h3><MapPin size={18} className="header-icon" /> Recent Destination Searches</h3>
              <div className="searches-list">
                {stats?.recent_searches && stats.recent_searches.length > 0 ? (
                  stats.recent_searches.map((s, idx) => (
                    <Link key={idx} to={`/trip/${s.id}`} className="search-pill">
                      <span>📍 {s.destination}</span>
                      <small>${s.budget}</small>
                    </Link>
                  ))
                ) : (
                  <p className="text-muted text-sm">No recent searches.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
