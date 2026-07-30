import React, { useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MapPin, DollarSign, Calendar, Users, Sparkles, Compass, CheckSquare, Clock } from 'lucide-react';
import { useTrip } from '../context/TripContext';
import ItineraryView from './ItineraryView';
import PDFExport from '../components/PDFExport';
import confetti from 'canvas-confetti';
import './TripPlanner.css';

const interestOptions = ["Culture", "Food & Gastronomy", "Nature & Outdoors", "Shopping", "Adventure", "Relaxation"];

const TripPlanner = () => {
  const [searchParams] = useSearchParams();
  const initialDest = searchParams.get('dest') || 'Paris';

  const [destination, setDestination] = useState(initialDest);
  const [numDays, setNumDays] = useState('3');
  const [budget, setBudget] = useState('1200');
  const [travelDates, setTravelDates] = useState('2026-09-10 to 2026-09-13');
  const [numTravelers, setNumTravelers] = useState('1');
  const [selectedInterests, setSelectedInterests] = useState(["Culture", "Food & Gastronomy"]);

  const { generateNewTrip, currentTrip, generating } = useTrip();
  const printRef = useRef(null);

  const toggleInterest = (item) => {
    if (selectedInterests.includes(item)) {
      setSelectedInterests(selectedInterests.filter(i => i !== item));
    } else {
      setSelectedInterests([...selectedInterests, item]);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      // Pass specified numDays in travelDates string so backend receives exact duration
      const datesFormatted = `${numDays} Days (${travelDates || 'Upcoming'})`;
      
      const result = await generateNewTrip(
        destination,
        budget,
        datesFormatted,
        numTravelers,
        selectedInterests
      );
      
      // Trigger celebration confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error('Trip generation error:', err);
    }
  };

  return (
    <div className="planner-page animate-fade-in">
      <div className="planner-container">
        {/* Header */}
        <div className="planner-header card">
          <div className="header-left">
            <Compass size={28} color="#4A90E2" />
            <div>
              <h2>PlanNgo Smart Trip Planner</h2>
              <p>Enter your destination, duration, and preferences to generate a live custom itinerary.</p>
            </div>
          </div>
        </div>

        {/* Input Form Card */}
        <div className="planner-form-card card">
          <form onSubmit={handleFormSubmit} className="planner-form">
            <div className="form-grid">
              <div className="form-group">
                <label><MapPin size={16} /> Destination City / Country</label>
                <input
                  type="text"
                  placeholder="e.g. Paris, Tokyo, Rome, London, Dubai, Goa"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label><Clock size={16} /> Trip Duration (Days)</label>
                <input
                  type="number"
                  min="1"
                  max="14"
                  placeholder="e.g. 1, 3, 5, 7"
                  value={numDays}
                  onChange={(e) => setNumDays(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label><DollarSign size={16} /> Target Budget (USD)</label>
                <input
                  type="number"
                  placeholder="1200"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label><Calendar size={16} /> Start Date / Range</label>
                <input
                  type="text"
                  placeholder="2026-09-10 to 2026-09-13"
                  value={travelDates}
                  onChange={(e) => setTravelDates(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label><Users size={16} /> Number of Travelers</label>
                <select value={numTravelers} onChange={(e) => setNumTravelers(e.target.value)}>
                  <option value="1">1 Solo Traveler</option>
                  <option value="2">2 Travelers (Couple / Friends)</option>
                  <option value="3">3-4 Small Group / Family</option>
                  <option value="5">5+ Large Group</option>
                </select>
              </div>
            </div>

            <div className="interests-section">
              <label>Select Your Travel Interests:</label>
              <div className="interests-pills">
                {interestOptions.map((item) => {
                  const isSelected = selectedInterests.includes(item);
                  return (
                    <button
                      type="button"
                      key={item}
                      className={`interest-pill ${isSelected ? 'selected' : ''}`}
                      onClick={() => toggleInterest(item)}
                    >
                      {isSelected && <CheckSquare size={14} />} {item}
                    </button>
                  );
                })}
              </div>
            </div>

            <button type="submit" className="btn-primary plan-submit-btn" disabled={generating}>
              {generating ? 'Generating Your Travel Plan...' : <><Sparkles size={18} /> Generate PlanNgo Travel Plan</>}
            </button>
          </form>
        </div>

        {/* Generated Itinerary Display (No stepper pipeline) */}
        {currentTrip && (
          <div className="generated-result-wrapper" ref={printRef}>
            <div className="result-controls">
              <PDFExport targetRef={printRef} filename={`${currentTrip.destination}_${currentTrip.travel_dates}_Itinerary.pdf`} />
            </div>
            <ItineraryView tripData={currentTrip} />
          </div>
        )}
      </div>
    </div>
  );
};

export default TripPlanner;
