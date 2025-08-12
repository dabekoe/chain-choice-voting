import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ghanaFlag from '../assets/ghana-flag.png';

function AdminChangePassword({ token }) {
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const res = await fetch('https://chain-choice-backend-1.onrender.com/api/admins/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ email, oldPassword, newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || 'Password changed successfully!');
        setEmail('');
        setOldPassword('');
        setNewPassword('');
        setTimeout(() => {
          navigate('/admin/login');
        }, 1200);
      } else {
        setError(data.message || 'Failed to change password.');
      }
    } catch (err) {
      setError('Server error. Please try again.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc, #fef6e4 60%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        width: '100%',
        maxWidth: 340,
        background: '#fff',
        borderRadius: 18,
        boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
        padding: '1.5rem 1.2rem 1rem 1.2rem',
        position: 'relative'
      }}>
        {/* Ghana Flag */}
        <div style={{
          position: 'absolute',
          left: '50%',
          top: -28,
          transform: 'translateX(-50%)',
          background: '#fff',
          borderRadius: '50%',
          padding: 4,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
          <img src={ghanaFlag} alt="Ghana Flag" style={{ width: 38, height: 24, borderRadius: 6 }} />
        </div>
        <h2 style={{
          marginTop: 18,
          marginBottom: 0,
          textAlign: 'center',
          color: '#166534',
          fontWeight: 700,
          fontSize: '1.3rem',
          letterSpacing: 1
        }}>Change Admin Password</h2>
        <div style={{
          textAlign: 'center',
          color: '#555',
          fontSize: '0.98rem',
          marginBottom: 6
        }}>
          Ghana National Online Voting Portal
        </div>
        {/* Colored lines */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 6,
          marginBottom: 12
        }}>
          <div style={{ width: 18, height: 4, background: '#dc2626', borderRadius: 3 }} />
          <div style={{ width: 18, height: 4, background: '#facc15', borderRadius: 3 }} />
          <div style={{ width: 18, height: 4, background: '#16a34a', borderRadius: 3 }} />
        </div>
        {message && <div className="mb-2 text-green-600 text-center" style={{ marginBottom: 6, fontSize: '0.95rem' }}>{message}</div>}
        {error && <div className="mb-2 text-red-600 text-center" style={{ marginBottom: 6, fontSize: '0.95rem' }}>{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div style={{ marginBottom: 10 }}>
            <label style={{ fontWeight: 600, color: '#166534', display: 'block', marginBottom: 3, fontSize: '0.98rem' }}>Email</label>
            <input
              type="email"
              placeholder="Admin Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '7px 10px',
                borderRadius: 7,
                border: '1.2px solid #16a34a',
                background: '#f1f5f9',
                color: '#222',
                fontSize: '0.98rem'
              }}
              required
            />
          </div>
          <div style={{ marginBottom: 10 }}>
            <label style={{ fontWeight: 600, color: '#166534', display: 'block', marginBottom: 3, fontSize: '0.98rem' }}>Old Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showOldPassword ? "text" : "password"}
                placeholder="Old Password"
                value={oldPassword}
                onChange={e => setOldPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '7px 32px 7px 10px',
                  borderRadius: 7,
                  border: '1.2px solid #16a34a',
                  background: '#f1f5f9',
                  color: '#222',
                  fontSize: '0.98rem'
                }}
                required
              />
              <button
                type="button"
                onClick={() => setShowOldPassword(v => !v)}
                style={{
                  position: 'absolute',
                  right: 6,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#166534',
                  fontSize: 16
                }}
                tabIndex={-1}
                aria-label="Toggle old password visibility"
              >
                {showOldPassword ? <span role="img" aria-label="Hide">Hide</span> : <span role="img" aria-label="Show">Show</span>}
              </button>
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: 600, color: '#166534', display: 'block', marginBottom: 3, fontSize: '0.98rem' }}>New Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '7px 32px 7px 10px',
                  borderRadius: 7,
                  border: '1.2px solid #16a34a',
                  background: '#f1f5f9',
                  color: '#222',
                  fontSize: '0.98rem'
                }}
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(v => !v)}
                style={{
                  position: 'absolute',
                  right: 6,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#166534',
                  fontSize: 16
                }}
                tabIndex={-1}
                aria-label="Toggle new password visibility"
              >
                {showNewPassword ? <span role="img" aria-label="Hide">Hide</span> : <span role="img" aria-label="Show">Show</span>}
              </button>
            </div>
          </div>
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '10px 0',
              borderRadius: 7,
              background: 'linear-gradient(90deg, #16a34a 0%, #facc15 100%)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '1rem',
              border: 'none',
              boxShadow: '0 2px 8px rgba(22,163,74,0.08), 0 1.5px 0 #facc15 inset',
              cursor: 'pointer',
              marginBottom: 6
            }}
          >
            Change Password
          </button>
        </form>
        <div style={{
          textAlign: 'center',
          color: '#888',
          fontSize: '0.85rem',
          marginTop: 12
        }}>
          © 2025 Ghana Electoral Commission. All rights reserved.
        </div>
      </div>
    </div>
    );
  }
  
  export default AdminChangePassword;