import React, { useState } from 'react';
import { Mail, MessageSquare, Phone, MapPin, Send, Check } from 'lucide-react';

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setName('');
    setEmail('');
    setMsg('');
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2.5rem 1.5rem' }} className="animate-fade-in">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '2rem' }}>
        {/* Left info */}
        <div>
          <div className="card" style={{ padding: '2rem', height: '100%' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>Get in Touch</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '1.5rem' }}>
              Have questions about PlanNgo AI Travel Planner or need assistance?
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Mail color="#4A90E2" size={20} />
                <span>support@planngo.ai</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Phone color="#4A90E2" size={20} />
                <span>+1 (800) 555-PLAN</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <MapPin color="#4A90E2" size={20} />
                <span>PlanNgo AI Global Tech Hub</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form */}
        <div>
          <div className="card" style={{ padding: '2rem' }}>
            <h3>Send Us a Message</h3>

            {submitted && (
              <div style={{ background: '#DCFCE7', color: 'var(--success)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                <Check size={16} /> Thank you! Your message has been sent.
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Your Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Alex Johnson" />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Your Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="alex@example.com" />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Message</label>
                <textarea rows="4" value={msg} onChange={(e) => setMsg(e.target.value)} required placeholder="How can we help you?" />
              </div>

              <button type="submit" className="btn-primary" style={{ justifyContent: 'center' }}>
                <Send size={16} /> Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
