import React, { useState } from 'react';
import { useTrip } from '../context/TripContext';
import { 
  BarChart2, ShieldCheck, Users, DollarSign, CloudSun, 
  MapPin, Clock, ArrowRight, AlertTriangle, Phone, Activity
} from 'lucide-react';
import './AnalyticsView.css';

const AnalyticsView = () => {
  const { currentTrip } = useTrip();

  // Mock / Active Trip Data
  const trip = currentTrip || {
    destination: 'Tokyo',
    budget: 1800,
    currency: 'USD',
    travel_dates: '4 Days',
    budget_breakdown: {
      stays: 630,
      dining: 360,
      flights: 450,
      activities: 210,
      local_transit: 150
    },
    safety_prediction: {
      safety_score: 88,
      safety_status: 'Safe',
      weather_alerts: ['Pleasant weather with clear skies.', 'UV index moderate - wear SPF 30+ sunscreen.'],
      risk_warnings: ['Standard tourist caution in crowded metro hubs.'],
      safest_travel_time: '08:30 AM - 11:30 AM & 04:00 PM - 07:30 PM',
      emergency_contacts: {
        Police: '112 / 911',
        Ambulance: '119',
        Tourist_Helpline: '+81-3-3201-3331'
      }
    },
    crowd_prediction: {
      crowd_score: 58,
      overall_crowd_level: 'Medium',
      attraction_predictions: [
        { attraction_name: 'Asakusa Senso-ji Temple', crowd_level: 'High', crowd_score: 82, best_visiting_time: '08:00 AM - 09:30 AM', peak_hours: '11:30 AM - 03:30 PM' },
        { attraction_name: 'Shibuya Crossing & Sky', crowd_level: 'Very High', crowd_score: 94, best_visiting_time: '07:30 PM - 09:00 PM', peak_hours: '04:00 PM - 07:00 PM' },
        { attraction_name: 'Tsukiji Outer Market', crowd_level: 'Medium', crowd_score: 62, best_visiting_time: '07:00 AM - 09:00 AM', peak_hours: '10:00 AM - 01:30 PM' },
        { attraction_name: 'Shinjuku Gyoen National Garden', crowd_level: 'Low', crowd_score: 38, best_visiting_time: '09:00 AM - 11:30 AM', peak_hours: '01:30 PM - 03:30 PM' }
      ]
    },
    weather_info: {
      average_temperature_c: 21.5,
      condition: 'Partly Cloudy & Comfortable',
      rain_probability_percent: 15
    },
    routes_info: {
      total_distance_km: 18.4,
      total_travel_time_hours: 1.8
    }
  };

  const budgetItems = [
    { label: 'Stays & Hotels', amount: trip.budget_breakdown?.stays || trip.budget * 0.35, color: '#6366F1' },
    { label: 'Dining & Cafés', amount: trip.budget_breakdown?.dining || trip.budget * 0.20, color: '#8B5CF6' },
    { label: 'Flights & Travel', amount: trip.budget_breakdown?.flights || trip.budget * 0.25, color: '#06B6D4' },
    { label: 'Activities & Tours', amount: trip.budget_breakdown?.activities || trip.budget * 0.12, color: '#10B981' },
    { label: 'Local Transit', amount: trip.budget_breakdown?.local_transit || trip.budget * 0.08, color: '#F59E0B' }
  ];

  const totalBudgetAmt = budgetItems.reduce((acc, curr) => acc + curr.amount, 0);

  const getCrowdBadgeClass = (level) => {
    switch (level?.toLowerCase()) {
      case 'low': return 'badge-success';
      case 'medium': return 'badge-info';
      case 'high': return 'badge-warning';
      case 'very high': return 'badge-danger';
      default: return 'badge-primary';
    }
  };

  return (
    <div className="analytics-page animate-fade-in">
      <div className="analytics-container">
        <header className="analytics-header">
          <div>
            <span className="analytics-badge">
              <BarChart2 size={16} /> Trip Analytics & Smart Graphs
            </span>
            <h1 className="analytics-title">
              Visual Trip Intelligence: <span className="text-gradient">{trip.destination}</span>
            </h1>
            <p className="analytics-subtitle">
              Comprehensive budget allocation, safety score metrics, crowd predictions, weather trends, and route analytics.
            </p>
          </div>
        </header>

        {/* Top Summary Cards */}
        <div className="analytics-summary-grid">
          <div className="analytics-stat-card card">
            <div className="stat-icon-wrapper bg-indigo">
              <DollarSign size={24} />
            </div>
            <div>
              <span className="stat-label">Total Target Budget</span>
              <h3 className="stat-value">{trip.currency} {trip.budget?.toLocaleString()}</h3>
              <span className="stat-subtext">5 Category Split</span>
            </div>
          </div>

          <div className="analytics-stat-card card">
            <div className="stat-icon-wrapper bg-emerald">
              <ShieldCheck size={24} />
            </div>
            <div>
              <span className="stat-label">Safety Score</span>
              <h3 className="stat-value">{trip.safety_prediction?.safety_score || 88}/100</h3>
              <span className="badge badge-success">{trip.safety_prediction?.safety_status || 'Safe'}</span>
            </div>
          </div>

          <div className="analytics-stat-card card">
            <div className="stat-icon-wrapper bg-amber">
              <Users size={24} />
            </div>
            <div>
              <span className="stat-label">Crowd Density Score</span>
              <h3 className="stat-value">{trip.crowd_prediction?.crowd_score || 58}/100</h3>
              <span className="badge badge-info">{trip.crowd_prediction?.overall_crowd_level || 'Medium'}</span>
            </div>
          </div>

          <div className="analytics-stat-card card">
            <div className="stat-icon-wrapper bg-cyan">
              <CloudSun size={24} />
            </div>
            <div>
              <span className="stat-label">Weather Forecast</span>
              <h3 className="stat-value">{trip.weather_info?.average_temperature_c}°C</h3>
              <span className="stat-subtext">{trip.weather_info?.condition}</span>
            </div>
          </div>
        </div>

        {/* Main Analytics Graphs Section */}
        <div className="charts-grid">
          {/* Chart 1: Budget Allocation Breakdown */}
          <div className="chart-card card">
            <div className="chart-card-header">
              <div className="chart-title">
                <DollarSign size={20} className="chart-header-icon" />
                <h3>Budget Category Allocation</h3>
              </div>
              <span className="stat-subtext">Live Conversion</span>
            </div>

            <div className="budget-bars-list">
              {budgetItems.map((item, i) => {
                const pct = Math.round((item.amount / (totalBudgetAmt || 1)) * 100);
                return (
                  <div key={i} className="budget-bar-item">
                    <div className="bar-label-row">
                      <span className="bar-label">{item.label}</span>
                      <span className="bar-amount">{trip.currency} {Math.round(item.amount).toLocaleString()} ({pct}%)</span>
                    </div>
                    <div className="bar-track">
                      <div 
                        className="bar-fill" 
                        style={{ width: `${pct}%`, backgroundColor: item.color }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chart 2: Safety & Emergency Analysis */}
          <div className="chart-card card">
            <div className="chart-card-header">
              <div className="chart-title">
                <ShieldCheck size={20} className="chart-header-icon" />
                <h3>Safety Index & Risk Analysis</h3>
              </div>
              <span className="badge badge-success">{trip.safety_prediction?.safety_status || 'Safe'}</span>
            </div>

            <div className="safety-gauge-wrapper">
              <div className="gauge-circle">
                <span className="gauge-score">{trip.safety_prediction?.safety_score || 88}</span>
                <span className="gauge-max">/100</span>
              </div>
              <div className="gauge-details">
                <h4>Recommended Visiting Window:</h4>
                <p className="highlight-text">{trip.safety_prediction?.safest_travel_time || '08:30 AM - 11:30 AM'}</p>
                <div className="weather-alert-box">
                  <AlertTriangle size={16} color="#F59E0B" />
                  <span>{trip.safety_prediction?.weather_alerts?.[0] || 'Standard weather conditions.'}</span>
                </div>
              </div>
            </div>

            <div className="emergency-contacts-grid">
              {Object.entries(trip.safety_prediction?.emergency_contacts || {}).map(([key, val], idx) => (
                <div key={idx} className="emergency-chip">
                  <Phone size={14} />
                  <span><strong>{key.replace('_', ' ')}:</strong> {val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Chart 3: Attraction Crowd Density Prediction */}
          <div className="chart-card card full-width">
            <div className="chart-card-header">
              <div className="chart-title">
                <Users size={20} className="chart-header-icon" />
                <h3>Attraction Crowd Prediction & Peak Hour Analysis</h3>
              </div>
              <span className="stat-subtext">Peak vs Off-Peak Times</span>
            </div>

            <div className="crowd-table-wrapper">
              <table className="crowd-table">
                <thead>
                  <tr>
                    <th>Attraction Name</th>
                    <th>Crowd Density</th>
                    <th>Crowd Score</th>
                    <th>Best Visiting Time</th>
                    <th>Peak Avoidance Window</th>
                  </tr>
                </thead>
                <tbody>
                  {(trip.crowd_prediction?.attraction_predictions || []).map((spot, i) => (
                    <tr key={i}>
                      <td><strong>{spot.attraction_name}</strong></td>
                      <td><span className={`badge ${getCrowdBadgeClass(spot.crowd_level)}`}>{spot.crowd_level}</span></td>
                      <td>
                        <div className="table-score-bar">
                          <div className="table-bar-fill" style={{ width: `${spot.crowd_score}%` }}></div>
                          <span>{spot.crowd_score}/100</span>
                        </div>
                      </td>
                      <td className="text-success font-semibold">{spot.best_visiting_time}</td>
                      <td className="text-muted">{spot.peak_hours}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
