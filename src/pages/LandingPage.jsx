import React from 'react';
import { useNavigate } from 'react-router-dom';
import ghanaFlag from '../assets/ghana-flag.png'; // Make sure this image exists
import './LandingPage.css'; // Ensure this CSS file is imported

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="landing-card">
        <img
          src={ghanaFlag}
          alt="Ghana Flag"
          style={{ width: 70, height: 48, borderRadius: 6, marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }}
        />
        <h1>Welcome to the Ghana Online Voting System</h1>
        <p>
          Secure, transparent, and accessible voting for all Ghanaians.<br />
          Choose your role to continue.
        </p>
        <button onClick={() => navigate('/voter-login')}>Login as Voter</button>
        <button onClick={() => navigate('/admin/login')}>Login as Admin</button>
        <button onClick={() => navigate('/voter-register')}>Register as Voter</button>
        <div style={{ marginTop: 32, color: '#6b7280', fontSize: 13 }}>
          &copy; {new Date().getFullYear()} Ghana Electoral Commission. All rights reserved.
        </div>
      </div>
    </div>
  );
}