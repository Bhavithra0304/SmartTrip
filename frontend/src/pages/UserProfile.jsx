import React, { useState } from 'react';
import { User, Mail, DollarSign, Compass, Bookmark, Shield, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTrip } from '../context/TripContext';
import './UserProfile.css';

const UserProfile = () => {
  const { user, updateProfile } = useAuth();
  const { trips, favorites } = useTrip();

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [currency, setCurrency] = useState(user?.preferred_currency || 'USD');
  const [style, setStyle] = useState(user?.travel_style || 'Balanced');
  const [notifs, setNotifs] = useState(user?.notifications_enabled ?? true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({
        full_name: fullName,
        preferred_currency: currency,
        travel_style: style,
        notifications_enabled: notifs
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="profile-page animate-fade-in">
      <div className="profile-container">
        <div className="profile-header card">
          <div className="avatar-large">
            {user?.full_name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="user-details">
            <h2>{user?.full_name}</h2>
            <p><Mail size={14} /> {user?.email}</p>
            <span className="badge badge-primary">Member since 2026</span>
          </div>
        </div>

        <div className="profile-grid">
          {/* Form */}
          <div className="card profile-form-card">
            <h3>Update Profile Preferences</h3>
            {savedSuccess && (
              <div className="success-msg">
                <Check size={16} /> Profile updated successfully!
              </div>
            )}

            <form onSubmit={handleUpdate} className="profile-form">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Preferred Currency</label>
                <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="INR">INR (₹)</option>
                  <option value="JPY">JPY (¥)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Travel Style Preference</label>
                <select value={style} onChange={(e) => setStyle(e.target.value)}>
                  <option value="Balanced">Balanced (Comfort & Savings)</option>
                  <option value="Luxury">Luxury & Fine Dining</option>
                  <option value="Backpacker">Backpacker & Budget Friendly</option>
                  <option value="Cultural">Culture & Historic Deep Dive</option>
                </select>
              </div>

              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={notifs}
                    onChange={(e) => setNotifs(e.target.checked)}
                  />
                  <span>Enable Email & Weather Risk Alerts</span>
                </label>
              </div>

              <button type="submit" className="btn-primary">Save Profile</button>
            </form>
          </div>

          {/* Stats */}
          <div className="side-stats">
            <div className="card stat-box">
              <Compass size={24} color="#4A90E2" />
              <div>
                <h4>{trips.length}</h4>
                <p>Trips Generated</p>
              </div>
            </div>

            <div className="card stat-box">
              <Bookmark size={24} color="#7ED957" />
              <div>
                <h4>{favorites.length}</h4>
                <p>Saved Favorites</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
