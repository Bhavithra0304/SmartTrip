import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TripProvider } from './context/TripContext';
import { NotificationProvider } from './context/NotificationContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AIChat from './pages/AIChat';
import TripPlanner from './pages/TripPlanner';
import SavedTrips from './pages/SavedTrips';
import TripDetails from './pages/TripDetails';
import UserProfile from './pages/UserProfile';
import Settings from './pages/Settings';
import About from './pages/About';
import Contact from './pages/Contact';
import AnalyticsView from './pages/AnalyticsView';

import './styles/global.css';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
};

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading session...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <TripProvider>
        <NotificationProvider>
          <Router>
            <ScrollToTop />
            <div className="app-layout" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
              <Navbar />
              <main style={{ flex: 1 }}>
                <Routes>
                  {/* Public Pages */}
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/settings" element={<Settings />} />

                  {/* Protected Pages */}
                  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/chat" element={<ProtectedRoute><AIChat /></ProtectedRoute>} />
                  <Route path="/planner" element={<ProtectedRoute><TripPlanner /></ProtectedRoute>} />
                  <Route path="/analytics" element={<ProtectedRoute><AnalyticsView /></ProtectedRoute>} />
                  <Route path="/saved" element={<ProtectedRoute><SavedTrips /></ProtectedRoute>} />
                  <Route path="/trip/:id" element={<ProtectedRoute><TripDetails /></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />

                  {/* Catch-all redirect to Home */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <ChatWidget />
              <Footer />
            </div>
          </Router>
        </NotificationProvider>
      </TripProvider>
    </AuthProvider>
  );
}

export default App;
