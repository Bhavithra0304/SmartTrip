import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Database, 
  Shield, 
  CheckCircle2, 
  Zap, 
  DollarSign, 
  CloudSun, 
  MapPin, 
  Compass, 
  ArrowRight, 
  Mic, 
  Calendar, 
  FileText, 
  Navigation,
  Check,
  X
} from 'lucide-react';
import './About.css';

const About = () => {
  return (
    <div className="about-page animate-fade-in">
      {/* Hero Header */}
      <section className="about-hero">
        <div className="about-hero-badge">
          <Sparkles size={16} /> Welcome to PlanNgo
        </div>
        <h1>Intelligent Travel Planning Tailored for Every Journey</h1>
        <p className="about-hero-sub">
          <strong>PlanNgo</strong> is an advanced AI travel intelligence platform built to eliminate travel planning stress. From 1-day weekend getaways to 14-day international expeditions, PlanNgo analyzes live data, weather forecasts, route distances, and custom budget limits to generate hyper-personalized itineraries in seconds.
        </p>

        <div className="about-stats-grid">
          <div className="about-stat-card">
            <div className="about-stat-num">Live Data</div>
            <div className="about-stat-label">Real-Time Insights</div>
          </div>
          <div className="about-stat-card">
            <div className="about-stat-num">Custom</div>
            <div className="about-stat-label">Exact Day Duration</div>
          </div>
          <div className="about-stat-card">
            <div className="about-stat-num">5-Category</div>
            <div className="about-stat-label">Smart Budget Split</div>
          </div>
          <div className="about-stat-card">
            <div className="about-stat-num">Voice AI</div>
            <div className="about-stat-label">Hands-Free Assistant</div>
          </div>
        </div>
      </section>

      {/* Website Specialities Section */}
      <section className="specialities-section">
        <div className="about-section-header">
          <span className="about-section-tag">Key Platform Specialities</span>
          <h2 className="about-section-title">What Makes PlanNgo Special?</h2>
          <p className="about-section-desc">
            Explore the flagship features and travel innovations that make PlanNgo your ultimate journey companion.
          </p>
        </div>

        <div className="specialities-grid">
          {/* Speciality 1 */}
          <div className="speciality-card">
            <div className="speciality-icon-wrapper spec-blue">
              <Calendar size={26} />
            </div>
            <h3>1. Flexible Day-Duration Itineraries</h3>
            <p>
              PlanNgo generates itineraries tailored precisely to your mentioned trip duration. Whether you need a 1-day day trip, 3-day weekend, 5-day holiday, or 10-day tour, every single day is fully scheduled.
            </p>
            <ul className="speciality-bullets">
              <li><CheckCircle2 size={16} /> Exact match for requested trip days (1 to 14+ days)</li>
              <li><CheckCircle2 size={16} /> Structured Morning, Afternoon, & Evening routines</li>
              <li><CheckCircle2 size={16} /> Balanced pace matching your preferred travel style</li>
            </ul>
          </div>

          {/* Speciality 2 */}
          <div className="speciality-card">
            <div className="speciality-icon-wrapper spec-purple">
              <Database size={26} />
            </div>
            <h3>2. Live Data & Destination Intelligence</h3>
            <p>
              When you choose a destination, PlanNgo fetches real-time destination data, live seasonal weather, authentic local attractions, hidden culinary gems, and cultural tips directly for that place.
            </p>
            <ul className="speciality-bullets">
              <li><CheckCircle2 size={16} /> Live weather condition tracking & forecasts</li>
              <li><CheckCircle2 size={16} /> Authentic local dining & landmark suggestions</li>
              <li><CheckCircle2 size={16} /> Context-aware travel recommendations</li>
            </ul>
          </div>

          {/* Speciality 3 */}
          <div className="speciality-card">
            <div className="speciality-icon-wrapper spec-green">
              <Mic size={26} />
            </div>
            <h3>3. Interactive Voice Assistant</h3>
            <p>
              Speak your travel ideas effortlessly with integrated Web Speech voice recognition. Tell PlanNgo your destination, budget, and dates hands-free, and listen to AI travel guidance.
            </p>
            <ul className="speciality-bullets">
              <li><CheckCircle2 size={16} /> One-click microphone voice input</li>
              <li><CheckCircle2 size={16} /> Real-time speech-to-text transcript typing</li>
              <li><CheckCircle2 size={16} /> Audio playback assistant responses</li>
            </ul>
          </div>

          {/* Speciality 4 */}
          <div className="speciality-card">
            <div className="speciality-icon-wrapper spec-orange">
              <DollarSign size={26} />
            </div>
            <h3>4. 5-Category Smart Budget Allocation</h3>
            <p>
              Input your total target budget, and PlanNgo automatically calculates optimized financial splits across Stays, Flights/Transit, Food, Activities, and Local Transport with cost-saving alerts.
            </p>
            <ul className="speciality-bullets">
              <li><CheckCircle2 size={16} /> Visual expense allocation charts</li>
              <li><CheckCircle2 size={16} /> Budget tier matching (Economy, Mid-Range, Luxury)</li>
              <li><CheckCircle2 size={16} /> Savings tips and category spend caps</li>
            </ul>
          </div>

          {/* Speciality 5 */}
          <div className="speciality-card">
            <div className="speciality-icon-wrapper spec-amber">
              <Navigation size={26} />
            </div>
            <h3>5. Spatial Route & Transit Optimizer</h3>
            <p>
              Eliminate unnecessary back-and-forth commuting. PlanNgo sequences daily spots geographically and renders interactive Leaflet maps with distance matrices and travel time estimates.
            </p>
            <ul className="speciality-bullets">
              <li><CheckCircle2 size={16} /> Geographic non-backtracking attraction ordering</li>
              <li><CheckCircle2 size={16} /> Interactive route maps and transit modes</li>
              <li><CheckCircle2 size={16} /> Estimated commute times between spots</li>
            </ul>
          </div>

          {/* Speciality 6 */}
          <div className="speciality-card">
            <div className="speciality-icon-wrapper spec-rose">
              <FileText size={26} />
            </div>
            <h3>6. High-Res PDF Export & Saved Vault</h3>
            <p>
              Keep all your travel plans organized. Save trip itineraries to your personal user account, access historical plans anytime, and export print-ready PDF itineraries with a single click.
            </p>
            <ul className="speciality-bullets">
              <li><CheckCircle2 size={16} /> One-click high-resolution PDF download</li>
              <li><CheckCircle2 size={16} /> Personal saved trip dashboard</li>
              <li><CheckCircle2 size={16} /> Offline accessible travel schedules</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="comparison-section">
        <div className="about-section-header">
          <span className="about-section-tag">Why Choose PlanNgo?</span>
          <h2 className="about-section-title">PlanNgo vs Standard Travel Methods</h2>
          <p className="about-section-desc">
            See how PlanNgo compares with manual research and generic search tools.
          </p>
        </div>

        <div className="table-wrapper">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Feature / Capability</th>
                <th className="highlight-col">PlanNgo Smart Travel Platform</th>
                <th>Generic AI Search</th>
                <th>Manual Travel Booking</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Custom Day Duration</strong></td>
                <td className="highlight-col"><span className="check-yes"><Check size={16} /> Exact requested days (1-14+ days)</span></td>
                <td><span className="check-no"><X size={16} /> Fixed templates</span></td>
                <td><span className="check-no"><X size={16} /> Hours of manual scheduling</span></td>
              </tr>
              <tr>
                <td><strong>Live Data & Weather</strong></td>
                <td className="highlight-col"><span className="check-yes"><Check size={16} /> Live Forecasts & Risk Alerts</span></td>
                <td><span className="check-no"><X size={16} /> Outdated static knowledge</span></td>
                <td><span className="check-no"><X size={16} /> Separate app checks</span></td>
              </tr>
              <tr>
                <td><strong>Voice Assistant Input</strong></td>
                <td className="highlight-col"><span className="check-yes"><Check size={16} /> Speech Recognition & Playback</span></td>
                <td><span className="check-no"><X size={16} /> Typing only</span></td>
                <td><span className="check-no"><X size={16} /> None</span></td>
              </tr>
              <tr>
                <td><strong>5-Category Budgeting</strong></td>
                <td className="highlight-col"><span className="check-yes"><Check size={16} /> Automated Category Charts</span></td>
                <td><span className="check-no"><X size={16} /> Generic text estimates</span></td>
                <td><span className="check-no"><X size={16} /> Manual spreadsheet tracking</span></td>
              </tr>
              <tr>
                <td><strong>Route Optimization</strong></td>
                <td className="highlight-col"><span className="check-yes"><Check size={16} /> Non-backtracking Maps</span></td>
                <td><span className="check-no"><X size={16} /> Plain text lists</span></td>
                <td><span className="check-no"><X size={16} /> Unconnected map tabs</span></td>
              </tr>
              <tr>
                <td><strong>PDF Export</strong></td>
                <td className="highlight-col"><span className="check-yes"><Check size={16} /> One-Click High-Res PDF</span></td>
                <td><span className="check-no"><X size={16} /> Copy-paste text</span></td>
                <td><span className="check-no"><X size={16} /> Multiple email attachments</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="about-cta-card">
        <h2>Ready to Plan Your Next Journey?</h2>
        <p>
          Experience smart, personalized travel planning for your exact destination and duration in seconds.
        </p>
        <Link to="/planner" className="about-cta-btn">
          Create Your Trip Now <ArrowRight size={18} />
        </Link>
      </section>
    </div>
  );
};

export default About;
