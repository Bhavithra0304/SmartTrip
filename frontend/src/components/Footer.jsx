import React from 'react';
import { Compass, ArrowUp, Zap, Sparkles, MapPin, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <Link to="/" onClick={scrollToTop} className="footer-logo">
            <div className="footer-logo-icon">
              <Compass size={22} color="#FFFFFF" />
            </div>
            <span>Plan<span className="logo-highlight">Ngo</span></span>
          </Link>
          <p>
            Your ultimate AI-powered travel planner. Generate customized day-wise itineraries, live weather insights, smart budget allocations, and interactive route maps for any destination.
          </p>
          <div className="footer-badges">
            <span className="badge badge-primary"><Zap size={12} /> Live Travel Insights</span>
            <span className="badge badge-success"><Sparkles size={12} /> Voice Assistant</span>
          </div>
        </div>

        <div className="footer-col">
          <h4>Navigation</h4>
          <Link to="/" onClick={scrollToTop}>Home</Link>
          <Link to="/planner" onClick={scrollToTop}>Trip Planner</Link>
          <Link to="/chat" onClick={scrollToTop}>AI Voice Assistant</Link>
          <Link to="/dashboard" onClick={scrollToTop}>Dashboard</Link>
          <Link to="/saved" onClick={scrollToTop}>Saved Trip Vault</Link>
        </div>

        <div className="footer-col">
          <h4>Platform & Info</h4>
          <Link to="/about" onClick={scrollToTop}>About & Specialities</Link>
          <Link to="/contact" onClick={scrollToTop}>Support & Contact</Link>
          <Link to="/profile" onClick={scrollToTop}>User Profile</Link>
          <Link to="/settings" onClick={scrollToTop}>System Settings</Link>
          <a href="http://localhost:8000/docs" target="_blank" rel="noreferrer">API Documentation</a>
        </div>

        <div className="footer-col">
          <h4>Special Features</h4>
          <span>📍 Custom Day Duration Trips</span>
          <span>☀️ Live Weather Forecasts</span>
          <span>💰 5-Category Budget Allocations</span>
          <span>🎙️ Voice Input Assistance</span>
          <span>🗺️ Non-backtracking Route Maps</span>
          <span>📄 Instant High-Res PDF Export</span>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <p>© 2026 PlanNgo Smart AI Travel Planner. Built for seamless & personalized journeys.</p>
          <button className="scroll-top-btn" onClick={scrollToTop} title="Scroll to top of page">
            <span>Back to Top</span>
            <ArrowUp size={16} />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
