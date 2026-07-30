import React from 'react';
import { Navigation, MapPin, Clock, ArrowRight, Compass } from 'lucide-react';
import './RouteMap.css';

const RouteMap = ({ routesInfo }) => {
  if (!routesInfo) return null;

  const destination = routesInfo.destination || "Destination";
  const total_distance_km = routesInfo.total_distance_km || 0;
  const total_travel_time_hours = routesInfo.total_travel_time_hours || 0;
  const legsList = routesInfo.optimized_legs || routesInfo.optimized_route_legs || [];
  const tipsList = routesInfo.travel_tips || routesInfo.travel_efficiency_tips || [];
  const provider = routesInfo.provider || "TomTom Live Routing API";

  return (
    <div className="route-map-card card">
      <div className="route-header">
        <div className="header-left">
          <Navigation size={22} className="nav-icon" />
          <div>
            <h3>Navigation & Route Optimization</h3>
            <span className="subtitle">{destination} Matrix • <small>{provider}</small></span>
          </div>
        </div>
        <div className="stats-pills">
          <span className="badge badge-info"><MapPin size={12} /> {total_distance_km} km total</span>
          <span className="badge badge-primary"><Clock size={12} /> ~{total_travel_time_hours} hrs transit</span>
        </div>
      </div>

      <div className="legs-list">
        {legsList.length > 0 ? (
          legsList.map((leg, idx) => (
            <div key={idx} className="leg-card">
              <div className="leg-badge">Leg #{idx + 1}</div>
              <div className="leg-route">
                <span className="spot font-bold">{leg.from || "Start Spot"}</span>
                <ArrowRight size={16} className="arrow" />
                <span className="spot font-bold">{leg.to || "Destination Spot"}</span>
              </div>
              <div className="leg-meta">
                <span>{leg.distance_km || leg.dist_km || 3.5} km</span>
                <span>•</span>
                <span>{leg.estimated_time_mins || leg.travel_time_mins || 15} mins</span>
                <span>•</span>
                <span className="mode-tag">{leg.recommended_mode || "Taxi/Metro"}</span>
              </div>
            </div>
          ))
        ) : (
          <p className="no-data-text">No route leg calculation needed for single spot destinations.</p>
        )}
      </div>

      {tipsList.length > 0 && (
        <div className="navigation-tips">
          <h4><Compass size={16} /> Transit Efficiency Tips</h4>
          <ul>
            {tipsList.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RouteMap;
