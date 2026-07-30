import React from 'react';
import { CloudSun, Sun, Thermometer, Droplets, AlertTriangle, Shirt, ExternalLink } from 'lucide-react';
import './WeatherWidget.css';

const WeatherWidget = ({ weatherInfo }) => {
  if (!weatherInfo) return null;

  const {
    destination,
    average_temperature_c,
    condition,
    humidity_percent,
    rain_probability_percent,
    weather_risk_detected,
    risk_warnings = [],
    clothing_suggestions = [],
    provider = "Open-Meteo Weather API"
  } = weatherInfo;

  return (
    <div className="weather-widget-card card">
      <div className="weather-widget-header">
        <div className="header-left">
          <CloudSun size={24} className="weather-icon" />
          <div>
            <h3>Weather Intelligence Report</h3>
            <span className="location-tag">{destination} Forecast • <small>{provider}</small></span>
          </div>
        </div>
        <div className="temp-badge">
          <Thermometer size={18} />
          <span>{average_temperature_c}°C</span>
        </div>
      </div>

      <div className="weather-metrics">
        <div className="metric-box">
          <span className="metric-label">Condition</span>
          <span className="metric-value">{condition}</span>
        </div>
        <div className="metric-box">
          <span className="metric-label">Humidity</span>
          <span className="metric-value">{humidity_percent}%</span>
        </div>
        <div className="metric-box">
          <span className="metric-label">Rain Chance</span>
          <span className="metric-value">{rain_probability_percent}%</span>
        </div>
      </div>

      {weather_risk_detected && (
        <div className="weather-alert">
          <AlertTriangle size={18} className="alert-icon" />
          <div>
            <strong>Weather Risk Warning:</strong>
            <ul>
              {risk_warnings.map((w, idx) => <li key={idx}>{w}</li>)}
            </ul>
          </div>
        </div>
      )}

      {clothing_suggestions.length > 0 && (
        <div className="clothing-section">
          <h4><Shirt size={16} /> Clothing & Packing Gear Advice</h4>
          <div className="clothing-tags">
            {clothing_suggestions.map((c, idx) => (
              <span key={idx} className="clothing-tag">• {c}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;
