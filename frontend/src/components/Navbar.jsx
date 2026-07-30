import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Settings, LogOut, Menu, X, Sun, Moon, BarChart2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('planngo_theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('planngo_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  const handleNavClick = () => {
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" onClick={handleNavClick} className="navbar-logo">
          <span className="logo-text">Plan<span className="logo-highlight">Ngo</span></span>
        </Link>

        <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle navigation">
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <nav className={`navbar-links ${mobileOpen ? 'mobile-show' : ''}`}>
          <Link to="/" onClick={handleNavClick} className={`nav-link ${isActive('/')}`}>Home</Link>
          {user && (
            <>
              <Link to="/dashboard" onClick={handleNavClick} className={`nav-link ${isActive('/dashboard')}`}>Dashboard</Link>
              <Link to="/planner" onClick={handleNavClick} className={`nav-link ${isActive('/planner')}`}>Trip Planner</Link>
              <Link to="/analytics" onClick={handleNavClick} className={`nav-link ${isActive('/analytics')}`}>Visual Analytics</Link>
              <Link to="/chat" onClick={handleNavClick} className={`nav-link ${isActive('/chat')}`}>Assistant Chat</Link>
              <Link to="/saved" onClick={handleNavClick} className={`nav-link ${isActive('/saved')}`}>Saved Trips</Link>
            </>
          )}
          <Link to="/about" onClick={handleNavClick} className={`nav-link ${isActive('/about')}`}>About</Link>
          <Link to="/contact" onClick={handleNavClick} className={`nav-link ${isActive('/contact')}`}>Contact</Link>
        </nav>

        <div className="navbar-actions">
          {/* Theme Toggle Button */}
          <button 
            className="theme-toggle-btn" 
            onClick={toggleTheme} 
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            <span className="theme-text">{theme === 'light' ? 'Dark' : 'Light'}</span>
          </button>

          {user ? (
            <div className="user-menu">
              <Link to="/profile" onClick={handleNavClick} className="user-avatar-btn" title={user.full_name}>
                <div className="avatar-circle">
                  {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="user-name">{user.full_name.split(' ')[0]}</span>
              </Link>

              <Link to="/settings" onClick={handleNavClick} className="icon-btn" title="Settings">
                <Settings size={18} />
              </Link>

              <button onClick={handleLogout} className="icon-btn logout-btn" title="Logout">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" onClick={handleNavClick} className="btn-secondary nav-auth-btn">Log In</Link>
              <Link to="/register" onClick={handleNavClick} className="btn-primary nav-auth-btn">Get Started</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
