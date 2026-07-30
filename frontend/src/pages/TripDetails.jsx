import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { tripService } from '../services/tripService';
import ItineraryView from './ItineraryView';
import PDFExport from '../components/PDFExport';

const TripDetails = () => {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const printRef = useRef(null);

  useEffect(() => {
    tripService.getTripById(id)
      .then(data => setTrip(data))
      .catch(err => console.error('Failed to load trip detail:', err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <h3>Loading travel details...</h3>
      </div>
    );
  }

  if (!trip) {
    return (
      <div style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <h3>Trip not found.</h3>
        <Link to="/saved" className="btn-primary" style={{ marginTop: '1rem' }}>Back to Saved Trips</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2.5rem 1.5rem' }} className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <Link to="/saved" className="btn-secondary" style={{ padding: '0.5rem 1rem' }}>
          <ArrowLeft size={16} /> Back to Saved Trips
        </Link>

        <PDFExport targetRef={printRef} filename={`${trip.destination}_Itinerary.pdf`} />
      </div>

      <div ref={printRef}>
        <ItineraryView tripData={trip} />
      </div>
    </div>
  );
};

export default TripDetails;
