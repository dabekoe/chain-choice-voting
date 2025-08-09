import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import ghanaFlag from '../assets/ghana-flag.png';

const VoterLoginPage = () => {
  const [voterId, setVoterId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/api/voters/login', { voterId, password });
      const token = res.data.token;

      localStorage.setItem('token', token);
      localStorage.setItem('isAdmin', 'false');

      navigate('/voter-dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Voter login failed.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-green-100 via-yellow-50 to-red-100">
      <div className="w-full max-w-sm bg-white/90 rounded-2xl shadow-xl px-6 py-8 border-l-4 border-green-700 relative">
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white rounded-full shadow-lg p-1 border-2 border-yellow-400">
          <img src={ghanaFlag} alt="Ghana Flag" className="w-14 h-10 rounded" />
        </div>
        <div className="flex flex-col items-center mt-10 mb-6">
          <h1 className="text-2xl font-extrabold text-green-900 mb-1 text-center drop-shadow">
            Voter Login
          </h1>
          <p className="text-gray-600 text-center mb-2 text-sm">Ghana National Online Voting Portal</p>
          <div className="flex space-x-1 mb-2">
            <span className="w-5 h-1.5 bg-red-600 rounded"></span>
            <span className="w-5 h-1.5 bg-yellow-400 rounded"></span>
            <span className="w-5 h-1.5 bg-green-700 rounded"></span>
          </div>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold text-green-900 text-sm">Voter ID</label>
            <input
              type="text"
              placeholder="Enter your Voter ID"
              value={voterId}
              onChange={(e) => setVoterId(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-lg border border-green-200 focus:ring-2 focus:ring-green-400 focus:outline-none transition text-sm"
            />
          </div>
          <div className="relative">
            <label className="block mb-1 font-semibold text-green-900 text-sm">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-lg border border-green-200 focus:ring-2 focus:ring-green-400 focus:outline-none transition text-sm pr-10"
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute right-2 top-9 text-gray-500"
              onClick={() => setShowPassword((prev) => !prev)}
              style={{ top: '2.35rem' }}
            >
              {showPassword ? (
                <span role="img" aria-label="Hide password">👁️</span>
              ) : (
                <span role="img" aria-label="Show password">👁️</span>
              )}
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-700 via-yellow-400 to-red-600 hover:from-red-600 hover:to-green-700 text-white font-bold py-2 rounded-lg shadow transition text-base"
          >
            Login
          </button>
        </form>
        <div className="mt-6 text-center text-gray-500 text-xs">
          &copy; {new Date().getFullYear()} Ghana Electoral Commission. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default VoterLoginPage;