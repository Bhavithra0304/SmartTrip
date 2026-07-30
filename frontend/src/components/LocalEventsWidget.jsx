import React, { useState } from 'react';
import { Calendar, MapPin, ExternalLink, Ticket, Bookmark, Check } from 'lucide-react';
import { useTrip } from '../context/TripContext';
import './LocalEventsWidget.css';

const LocalEventsWidget = ({ localEvents = {} }) => {
  const { addFavorite } = useTrip();
  const [savedEvents, setSavedEvents] = useState({});

  const eventsList = localEvents.top_events || [];
  const destination = localEvents.destination || 'Destination';
  const provider = localEvents.provider || 'PredictHQ Live Events API & Groq LLM';

  const handleSaveFav = async (event) => {
    try {
      await addFavorite({
        destination,
        category: 'Local Event',
        title: event.name,
        description: event.description,
        details: event
      });
      setSavedEvents(prev => ({ ...prev, [event.name]: true }));
    } catch (e) {
      console.error('Save event error:', e);
    }
  };

  return (
    <div className="local-events-card card">
      <div className="events-header">
        <div className="header-left">
          <Ticket size={22} className="events-icon" />
          <div>
            <h3>Live Local Events & Festivals</h3>
            <span className="subtitle">{destination} • <small>{provider}</small></span>
          </div>
        </div>
        <div className="events-badge-pill">
          <span>{eventsList.length} Curated Events</span>
        </div>
      </div>

      {eventsList.length > 0 ? (
        <div className="events-grid">
          {eventsList.map((evt, idx) => (
            <div key={idx} className="event-item-card">
              <div className="event-card-top">
                <span className="event-category-badge">{evt.category || 'Festival'}</span>
                <span className="event-date-tag"><Calendar size={12} /> {evt.date || 'Upcoming'}</span>
              </div>

              <h4 className="event-title">{evt.name}</h4>
              <p className="event-venue"><MapPin size={14} /> {evt.venue}</p>
              <p className="event-desc">{evt.description}</p>

              {evt.reason_for_recommendation && (
                <div className="event-recommend-note">
                  💡 <strong>AI Reason:</strong> {evt.reason_for_recommendation}
                </div>
              )}

              <div className="event-card-footer">
                <a 
                  href={evt.event_url || '#'} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="btn-secondary btn-sm"
                >
                  Event Details <ExternalLink size={13} />
                </a>

                <button 
                  className="btn-secondary btn-sm fav-event-btn"
                  onClick={() => handleSaveFav(evt)}
                  disabled={savedEvents[evt.name]}
                >
                  {savedEvents[evt.name] ? (
                    <><Check size={13} /> Saved</>
                  ) : (
                    <><Bookmark size={13} /> Save</>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-events-box">
          <p>No major live public events scheduled for this specific date range. Enjoy the classic local attractions and cultural spots!</p>
        </div>
      )}
    </div>
  );
};

export default LocalEventsWidget;
