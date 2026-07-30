import React, { useState } from 'react';
import { 
  Calendar, DollarSign, CloudSun, Navigation, Sparkles, Bookmark, 
  Ticket, ShieldCheck, Users, AlertTriangle, Phone
} from 'lucide-react';
import WeatherWidget from '../components/WeatherWidget';
import BudgetChart from '../components/BudgetChart';
import RouteMap from '../components/RouteMap';
import LocalEventsWidget from '../components/LocalEventsWidget';
import { useTrip } from '../context/TripContext';
import './ItineraryView.css';

const ItineraryView = ({ tripData }) => {
  const [activeTab, setActiveTab] = useState('itinerary');
  const { addFavorite } = useTrip();
  const [savedFavs, setSavedFavs] = useState({});

  if (!tripData) return null;

  const {
    title,
    destination,
    budget,
    travel_dates,
    num_travelers,
    itinerary_data = {},
    budget_breakdown = {},
    weather_info = {},
    routes_info = {},
    local_events = {},
    safety_prediction = {},
    crowd_prediction = {},
    rag_recommendations = {},
    summary = ""
  } = tripData;

  const handleSaveFav = async (item, category) => {
    try {
      await addFavorite({
        destination,
        category,
        title: item.name || item.title || item.place || item.activity,
        description: item.activity || item.must_try || item.highlight || item.tag,
        details: item
      });
      setSavedFavs(prev => ({ ...prev, [item.name || item.title || item.place || item.activity]: true }));
    } catch (e) {
      console.error('Fav save error:', e);
    }
  };

  return (
    <div className="itinerary-view-container">
      {/* Header Banner */}
      <div className="itinerary-banner card">
        <div className="banner-title">
          <h2>{title || `Trip to ${destination}`}</h2>
          <div className="banner-pills">
            <span className="badge badge-primary">📍 {destination}</span>
            <span className="badge badge-success">💰 ${budget}</span>
            <span className="badge badge-info">📅 {travel_dates}</span>
            <span className="badge badge-warning">👥 {num_travelers} Traveler(s)</span>
          </div>
        </div>
      </div>

      {summary && (
        <div className="summary-box card">
          <p>💡 {summary}</p>
        </div>
      )}

      {/* Interactive Tabs */}
      <div className="itinerary-tabs">
        <button 
          className={`tab-btn ${activeTab === 'itinerary' ? 'active' : ''}`}
          onClick={() => setActiveTab('itinerary')}
        >
          <Calendar size={16} /> Day Itinerary
        </button>

        <button 
          className={`tab-btn ${activeTab === 'budget' ? 'active' : ''}`}
          onClick={() => setActiveTab('budget')}
        >
          <DollarSign size={16} /> Budget Report
        </button>

        <button 
          className={`tab-btn ${activeTab === 'safety' ? 'active' : ''}`}
          onClick={() => setActiveTab('safety')}
        >
          <ShieldCheck size={16} /> Safety & Risks
        </button>

        <button 
          className={`tab-btn ${activeTab === 'crowd' ? 'active' : ''}`}
          onClick={() => setActiveTab('crowd')}
        >
          <Users size={16} /> Crowd Density
        </button>

        <button 
          className={`tab-btn ${activeTab === 'weather' ? 'active' : ''}`}
          onClick={() => setActiveTab('weather')}
        >
          <CloudSun size={16} /> Weather Risk
        </button>

        <button 
          className={`tab-btn ${activeTab === 'routes' ? 'active' : ''}`}
          onClick={() => setActiveTab('routes')}
        >
          <Navigation size={16} /> Routes
        </button>

        <button 
          className={`tab-btn ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => setActiveTab('events')}
        >
          <Ticket size={16} /> Local Events
        </button>

        <button 
          className={`tab-btn ${activeTab === 'rag' ? 'active' : ''}`}
          onClick={() => setActiveTab('rag')}
        >
          <Sparkles size={16} /> Recommendations
        </button>
      </div>

      {/* Tab Panels */}
      <div className="tab-content animate-fade-in">
        {/* Tab 1: Day-Wise Itinerary */}
        {activeTab === 'itinerary' && (
          <div className="days-timeline">
            {itinerary_data.itinerary ? (
              itinerary_data.itinerary.map((day) => (
                <div key={day.day} className="day-card card">
                  <div className="day-header">
                    <span className="day-number">Day {day.day}</span>
                    <h3>{day.title}</h3>
                  </div>

                  <div className="day-slots">
                    <div className="slot">
                      <span className="slot-time">🌅 Morning ({day.morning.time})</span>
                      <p>{day.morning.activity}</p>
                    </div>
                    <div className="slot">
                      <span className="slot-time">☀️ Afternoon ({day.afternoon.time})</span>
                      <p>{day.afternoon.activity}</p>
                    </div>
                    <div className="slot">
                      <span className="slot-time">🌙 Evening ({day.evening.time})</span>
                      <p>{day.evening.activity}</p>
                    </div>
                  </div>

                  <div className="day-footer">
                    <strong>Key Attractions:</strong>
                    <div className="spots-tags">
                      {day.key_spots?.map((s, i) => (
                        <span key={i} className="spot-tag">📍 {s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            ) : <p>No day itinerary data generated.</p>}
          </div>
        )}

        {/* Tab 2: Budget */}
        {activeTab === 'budget' && (
          <BudgetChart budgetBreakdown={budget_breakdown} />
        )}

        {/* Tab 3: Safety Prediction Panel */}
        {activeTab === 'safety' && (
          <div className="safety-panel card">
            <div className="safety-panel-header">
              <div>
                <h3>Travel Safety & Emergency Services</h3>
                <p>Live risk assessment and emergency contact directory for {destination}.</p>
              </div>
              <span className="badge badge-success">Score: {safety_prediction.safety_score || 85}/100 ({safety_prediction.safety_status || 'Safe'})</span>
            </div>

            <div className="safety-grid">
              <div className="safety-col card">
                <h4>⚠️ Risk Warnings & Weather Alerts</h4>
                <ul className="safety-list">
                  {(safety_prediction.weather_alerts || []).map((alt, i) => (
                    <li key={i}>🌧️ {alt}</li>
                  ))}
                  {(safety_prediction.risk_warnings || []).map((rw, i) => (
                    <li key={i}>🚨 {rw}</li>
                  ))}
                </ul>

                <h4 style={{ marginTop: '1rem' }}>🕒 Safest Visiting Windows</h4>
                <p><strong>{safety_prediction.safest_travel_time || '08:30 AM - 11:30 AM'}</strong></p>
              </div>

              <div className="safety-col card">
                <h4>📞 Emergency Helpline Numbers</h4>
                <div className="emergency-list">
                  {Object.entries(safety_prediction.emergency_contacts || {}).map(([k, v], i) => (
                    <div key={i} className="emergency-item">
                      <span><strong>{k.replace('_', ' ')}:</strong></span>
                      <span className="badge badge-info">{v}</span>
                    </div>
                  ))}
                </div>

                <h4 style={{ marginTop: '1.25rem' }}>🏥 Nearby Hospitals</h4>
                {(safety_prediction.nearby_hospitals || []).map((h, i) => (
                  <div key={i} className="hospital-item">
                    <strong>{h.name}</strong>
                    <p>{h.address} ({h.distance_km} km away) • Phone: {h.phone}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Crowd Prediction Panel */}
        {activeTab === 'crowd' && (
          <div className="crowd-panel card">
            <div className="crowd-panel-header">
              <div>
                <h3>Attraction Crowd Density & Peak Hour Avoidance</h3>
                <p>Predicted visitor traffic and best visiting windows for {destination}.</p>
              </div>
              <span className="badge badge-info">Crowd Score: {crowd_prediction.crowd_score || 58}/100 ({crowd_prediction.overall_crowd_level || 'Medium'})</span>
            </div>

            <div className="crowd-spots-list">
              {(crowd_prediction.attraction_predictions || []).map((spot, i) => (
                <div key={i} className="crowd-spot-card card">
                  <div className="crowd-spot-top">
                    <h4>📍 {spot.attraction_name}</h4>
                    <span className={`badge ${spot.crowd_level === 'Low' ? 'badge-success' : spot.crowd_level === 'Medium' ? 'badge-info' : 'badge-warning'}`}>
                      {spot.crowd_level} Density ({spot.crowd_score}/100)
                    </span>
                  </div>
                  <div className="crowd-spot-details">
                    <p>✅ <strong>Best Visiting Window:</strong> {spot.best_visiting_time}</p>
                    <p>⛔ <strong>Peak Hours:</strong> {spot.peak_hours}</p>
                    {spot.alternate_spot && <p>🌿 <strong>Quiet Alternative:</strong> {spot.alternate_spot}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Weather */}
        {activeTab === 'weather' && (
          <WeatherWidget weatherInfo={weather_info} />
        )}

        {/* Tab 6: Routes */}
        {activeTab === 'routes' && (
          <RouteMap routesInfo={routes_info} />
        )}

        {/* Tab 7: Local Events */}
        {activeTab === 'events' && (
          <LocalEventsWidget localEvents={local_events} />
        )}

        {/* Tab 8: RAG Recommendations */}
        {activeTab === 'rag' && (
          <div className="rag-panel">
            <div className="recs-grid">
              <div className="recs-col card">
                <h4>🍽️ Recommended Dining & Cafés</h4>
                {rag_recommendations.restaurants?.map((r, i) => (
                  <div key={i} className="rec-item">
                    <div className="rec-top">
                      <strong>{r.name}</strong>
                      <span>{r.type}</span>
                    </div>
                    <p>{r.description}</p>
                    <button 
                      className="fav-btn" 
                      onClick={() => handleSaveFav(r, 'Restaurant')}
                      disabled={savedFavs[r.name]}
                    >
                      <Bookmark size={12} /> {savedFavs[r.name] ? 'Saved' : 'Save Favorite'}
                    </button>
                  </div>
                ))}
              </div>

              <div className="recs-col card">
                <h4>💎 Hidden Gems & Local Activities</h4>
                {rag_recommendations.hidden_gems?.map((g, i) => (
                  <div key={i} className="rec-item">
                    <strong>{g.name}</strong>
                    <p>{g.why_visit || g.description}</p>
                    <button 
                      className="fav-btn" 
                      onClick={() => handleSaveFav(g, 'Hidden Gem')}
                      disabled={savedFavs[g.name]}
                    >
                      <Bookmark size={12} /> {savedFavs[g.name] ? 'Saved' : 'Save Favorite'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItineraryView;
