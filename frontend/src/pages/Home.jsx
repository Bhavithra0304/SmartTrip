import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, ArrowRight, CheckCircle2, Calendar, DollarSign, 
  CloudSun, Mic, Navigation, FileText, Ticket, Compass, MapPin, 
  ChevronRight, Shield, Zap, Users, ShieldCheck, BarChart2
} from 'lucide-react';
import './Home.css';

const showcaseDestinations = [
  {
    city: 'Tokyo',
    country: 'Japan',
    tag: 'Culture & High-Tech',
    duration: '4 Days',
    budget: '$1,800',
    weather: '18°C Clear',
    events: '3 Live Festivals',
    safety: 'Safety Score: 88/100 (Safe)',
    crowd: 'Crowd Score: 58/100 (Medium)',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&auto=format&fit=crop',
    highlight: 'Asakusa Senso-ji, Shibuya Sky & Tsukiji Outer Market'
  },
  {
    city: 'Rome',
    country: 'Italy',
    tag: 'Ancient Heritage & Gastronomy',
    duration: '3 Days',
    budget: '$1,400',
    weather: '24°C Sunny',
    events: '2 Wine & Art Expos',
    safety: 'Safety Score: 85/100 (Safe)',
    crowd: 'Crowd Score: 64/100 (Medium)',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&auto=format&fit=crop',
    highlight: 'Colosseum Tour, Trevi Fountain & Trastevere Dining'
  },
  {
    city: 'Bali',
    country: 'Indonesia',
    tag: 'Tropical Beaches & Temples',
    duration: '5 Days',
    budget: '$1,100',
    weather: '29°C Tropical',
    events: '4 Sunset Sessions',
    safety: 'Safety Score: 82/100 (Safe)',
    crowd: 'Crowd Score: 45/100 (Low)',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&auto=format&fit=crop',
    highlight: 'Ubud Monkey Forest, Tegallalang Rice Terraces & Beach Clubs'
  },
  {
    city: 'Goa',
    country: 'India',
    tag: 'Coastal Vibe & Nightlife',
    duration: '3 Days',
    budget: '$600',
    weather: '28°C Pleasant',
    events: '5 Night Bazaar Fairs',
    safety: 'Safety Score: 90/100 (Safe)',
    crowd: 'Crowd Score: 52/100 (Medium)',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&auto=format&fit=crop',
    highlight: 'Baga Beach Watersports, Fontainhas Latin Quarter & Fort Aguada'
  }
];

const Home = () => {
  const [activeDestIndex, setActiveDestIndex] = useState(0);
  const activeDest = showcaseDestinations[activeDestIndex];

  return (
    <div className="home-page animate-fade-in">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <span className="hero-badge">
              <Sparkles size={14} /> Smart AI Travel Intelligence Platform
            </span>
            <h1 className="hero-title">
              Plan Your Perfect Trip with <span className="text-gradient">PlanNgo</span> Assistant
            </h1>
            <p className="hero-description">
              Experience effortless, custom travel planning. Instantly generate day-wise itineraries, live safety assessments, crowd density forecasts, PredictHQ live events, and route optimizations.
            </p>
            <div className="hero-cta">
              <Link to="/planner" className="btn-primary hero-btn">
                Start Planning Now <ArrowRight size={18} />
              </Link>
              <Link to="/analytics" className="btn-secondary hero-btn">
                Visual Analytics <BarChart2 size={18} />
              </Link>
            </div>
            
            <div className="hero-stats">
              <div className="stat-item">
                <strong>Live Safety Alerts</strong>
                <span>Open-Meteo & TomTom POI</span>
              </div>
              <div className="stat-item">
                <strong>Crowd Predictor</strong>
                <span>Peak Hour Avoidance</span>
              </div>
              <div className="stat-item">
                <strong>PredictHQ Events</strong>
                <span>Live Festivals & Concerts</span>
              </div>
            </div>
          </div>

          {/* Dynamic Live Interactive Showcase Widget */}
          <div className="hero-showcase-widget card">
            <div className="showcase-header">
              <div className="showcase-title">
                <Compass size={20} className="compass-icon" />
                <span>Live Trip Planner Assistant</span>
              </div>
              <span className="badge badge-success">● Live Sync Active</span>
            </div>

            {/* Destination Selector Tabs */}
            <div className="showcase-tabs">
              {showcaseDestinations.map((d, i) => (
                <button
                  key={i}
                  className={`showcase-tab ${activeDestIndex === i ? 'active' : ''}`}
                  onClick={() => setActiveDestIndex(i)}
                >
                  {d.city}
                </button>
              ))}
            </div>

            {/* Showcase Preview Card */}
            <div className="showcase-card">
              <div 
                className="showcase-image" 
                style={{ backgroundImage: `linear-gradient(to bottom, rgba(15,23,42,0.1), rgba(15,23,42,0.8)), url(${activeDest.image})` }}
              >
                <span className="showcase-tag">{activeDest.tag}</span>
                <div className="showcase-img-details">
                  <h3>{activeDest.city}, {activeDest.country}</h3>
                  <p><MapPin size={12} /> {activeDest.highlight}</p>
                </div>
              </div>

              <div className="showcase-chips-grid">
                <div className="showcase-chip"><Calendar size={13} /> {activeDest.duration} Custom Plan</div>
                <div className="showcase-chip"><DollarSign size={13} /> Budget: {activeDest.budget}</div>
                <div className="showcase-chip"><CloudSun size={13} /> Weather: {activeDest.weather}</div>
                <div className="showcase-chip"><ShieldCheck size={13} /> {activeDest.safety}</div>
                <div className="showcase-chip"><Users size={13} /> {activeDest.crowd}</div>
                <div className="showcase-chip"><Ticket size={13} /> Events: {activeDest.events}</div>
              </div>

              <div className="showcase-actions">
                <Link to={`/planner?dest=${activeDest.city}`} className="btn-primary btn-sm showcase-btn">
                  Generate {activeDest.city} Trip <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section (Inspired by MyTripMatch 4-Step Process) */}
      <section className="how-it-works-section">
        <div className="section-container">
          <div className="text-center margin-bottom-lg">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">Plan a complete trip in 4 simple steps</p>
          </div>

          <div className="steps-wrapper">
            <div className="steps-line"></div>
            <div className="steps-grid">
              <div className="step-card card">
                <div className="step-badge">01</div>
                <h3>Pick your destination</h3>
                <p>Search any city in India or worldwide with real-time TomTom POI autocomplete.</p>
              </div>

              <div className="step-card card">
                <div className="step-badge">02</div>
                <h3>Choose occasion & budget</h3>
                <p>Vacation, honeymoon, friends trip — pick your vibe and customize your target budget.</p>
              </div>

              <div className="step-card card">
                <div className="step-badge">03</div>
                <h3>Select your interests</h3>
                <p>Adventure, culture, food, nightlife, nature or shopping — select up to 3 preferences.</p>
              </div>

              <div className="step-card card">
                <div className="step-badge">04</div>
                <h3>Get full itinerary in 15s</h3>
                <p>Day-wise plans, route maps, PredictHQ live events, safety tips & PDF export ready.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits & Features Grid */}
      <section className="features-section">
        <div className="section-container">
          <h2 className="section-title text-center">Smart Trip Planning Benefits</h2>
          <p className="section-subtitle text-center">Everything you need for an authentic, safe, and effortless journey.</p>

          <div className="features-grid">
            <div className="feature-card card">
              <div className="feature-icon bg-purple"><Calendar size={22} /></div>
              <h3>1. Dynamic Day-wise Planning</h3>
              <p>Generates structured morning, afternoon, and evening routines for any duration (1-14+ days) with visit timings.</p>
            </div>

            <div className="feature-card card">
              <div className="feature-icon bg-green"><DollarSign size={22} /></div>
              <h3>2. Smart Budget Allocator</h3>
              <p>Splits budget across Stays, Flights, Food, Activities, and Transit with live ExchangeRate API conversions.</p>
            </div>

            <div className="feature-card card">
              <div className="feature-icon bg-sky"><CloudSun size={22} /></div>
              <h3>3. Weather Risk Protection</h3>
              <p>Fetches Open-Meteo forecasts, alerts rain/heat risks, and suggests backup indoor activities.</p>
            </div>

            <div className="feature-card card">
              <div className="feature-icon bg-pink"><ShieldCheck size={22} /></div>
              <h3>4. Safety Prediction Engine</h3>
              <p>Calculates destination safety score (0-100), risk warnings, safest visiting windows, and nearby emergency hospitals & police stations.</p>
            </div>

            <div className="feature-card card">
              <div className="feature-icon bg-orange"><Users size={22} /></div>
              <h3>5. Crowd Density Predictor</h3>
              <p>Forecasts attraction crowd levels (Low, Medium, High) and recommends off-peak hours & quiet alternative spots.</p>
            </div>

            <div className="feature-card card">
              <div className="feature-icon bg-accent"><Ticket size={22} /></div>
              <h3>6. PredictHQ Live Events</h3>
              <p>Integrates live data to discover cultural festivals, concerts, and food fairs occurring during your stay.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Destinations Showcase */}
      <section className="destinations-section">
        <div className="section-container">
          <h2 className="section-title text-center">Trending Destinations Ready to Explore</h2>
          <p className="section-subtitle text-center">Choose a destination and start customizing your travel plan immediately.</p>
          <div className="destinations-grid">
            {[
              { city: 'Paris', country: 'France', tag: 'Culture & Fine Dining', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&auto=format&fit=crop' },
              { city: 'Tokyo', country: 'Japan', tag: 'Heritage & Innovation', img: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&auto=format&fit=crop' },
              { city: 'Rome', country: 'Italy', tag: 'Historic Monuments', img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&auto=format&fit=crop' },
              { city: 'New York', country: 'USA', tag: 'Skyline & Arts', img: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&auto=format&fit=crop' }
            ].map((d, i) => (
              <div key={i} className="destination-card card">
                <div 
                  className="dest-image-placeholder" 
                  style={{ 
                    backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(15,23,42,0.75)), url(${d.img})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <span className="dest-tag">{d.tag}</span>
                </div>
                <div className="dest-info">
                  <div>
                    <h3 style={{ margin: 0 }}>{d.city}</h3>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{d.country}</span>
                  </div>
                  <Link to={`/planner?dest=${d.city}`} className="btn-secondary btn-sm">
                    Plan Trip <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
