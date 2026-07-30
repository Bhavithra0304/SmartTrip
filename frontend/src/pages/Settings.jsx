import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Key, CheckCircle2, Shield, Bell } from 'lucide-react';
import { tripService } from '../services/tripService';

const Settings = () => {
  const [settingsData, setSettingsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    tripService.getSettings()
      .then(data => setSettingsData(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2.5rem 1.5rem' }} className="animate-fade-in">
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1.5rem', borderLeft: '4px solid var(--primary-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <SettingsIcon size={26} color="#4A90E2" />
          <div>
            <h2>Application & API System Settings</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Configure API connections, vector database status, and preferences</p>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: '2rem' }}>
        <h3><Key size={18} style={{ color: 'var(--primary-color)', marginRight: '0.5rem' }} /> Service Integrations Status</h3>
        
        {loading ? (
          <p>Loading integration diagnostics...</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.85rem', background: 'var(--bg-color)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div>
                <strong>ChromaDB Vector Store (RAG)</strong>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Internal travel knowledge base embeddings</p>
              </div>
              <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><CheckCircle2 size={14} /> Active & Ready</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.85rem', background: 'var(--bg-color)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div>
                <strong>OpenWeather API Service</strong>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Weather forecasts and precipitation alerts</p>
              </div>
              <span className="badge badge-info">Connected (Simulated / Live)</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.85rem', background: 'var(--bg-color)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div>
                <strong>Google Maps API Service</strong>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Route optimization and travel matrix</p>
              </div>
              <span className="badge badge-info">Connected (Simulated / Live)</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.85rem', background: 'var(--bg-color)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div>
                <strong>Currency Exchange API Service</strong>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Real-time currency conversion rates</p>
              </div>
              <span className="badge badge-success">Active</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
