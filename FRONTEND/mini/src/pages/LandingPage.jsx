import React, { useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './LandingPage.css';

function LandingPage() {
  const { user } = useContext(AuthContext);

  // If user is already logged in, we might want to still show this page, 
  // but let the "Get Started" button go to dashboard.

  return (
    <div className="landing-page">
      {/* Custom Sleek Navbar */}
      <nav className="landing-nav">
        <Link to="/" className="brand">
          <div className="brand-icon">
             {/* Using a simple text icon or SVG */}
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
             </svg>
          </div>
          EXAMNIDHI
        </Link>
        
        <div className="links">
          <Link to="/">Landing Page</Link>
          <a href="#features">Features</a>
          <a href="#stats">Stats</a>
        </div>
        
        <div className="actions">
          {!user && <Link to="/login" className="btn-staff">Admin Login</Link>}
          {user ? (
            <Link to={user.role === 'admin' ? "/admin" : "/dashboard"} className="btn-start">
              Go to {user.role === 'admin' ? 'Admin Panel' : 'Dashboard'}
            </Link>
          ) : (
            <Link to="/register" className="btn-start">Start Now</Link>
          )}
        </div>
      </nav>

      {/* Main Hero Section */}
      <main className="hero-section">
        <div className="hero-pill">
          PRO PREPARATION PLATFORM <span className="sub">GLOBAL ACADEMIC SYSTEM V2.0</span>
        </div>
        
        <h1 className="hero-title">
          THE FUTURE OF
          <span className="gradient-text">PREPARATION.</span>
        </h1>
        
        <p className="hero-subtitle">
          <strong>ExamNidhi</strong> makes studying simple and organized.
          <br/>
          A smart system for quick access to Previous Year Questions & easy progress tracking.
        </p>
        
        <div className="hero-actions">
          {user ? (
            <Link to={user.role === 'admin' ? "/admin" : "/dashboard"} className="btn-hero-primary">
              GO TO {user.role === 'admin' ? 'ADMIN PANEL' : 'DASHBOARD'}
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn-hero-primary">GET STARTED</Link>
              <Link to="/login" className="btn-hero-secondary">STUDENT LOGIN</Link>
            </>
          )}
        </div>
      </main>

      {/* Metrics Section */}
      <div className="metrics-section" id="stats">
        <div className="metric-card">
          <div className="metric-icon">📚</div>
          <div className="metric-value">50<span>+</span></div>
          <div className="metric-label">Core Subjects</div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">📄</div>
          <div className="metric-value">10<span>k+</span></div>
          <div className="metric-label">PYQ Documents</div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">💎</div>
          <div className="metric-value">100<span>%</span></div>
          <div className="metric-label">Free Access</div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🎯</div>
          <div className="metric-value">99<span>%</span></div>
          <div className="metric-label">Format Accuracy</div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
