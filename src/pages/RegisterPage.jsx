import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ghanaFlag from '../assets/ghana-flag.png';
import './RegisterPage.css';

function RegisterPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [voterId, setVoterId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState('register'); // 'register' or 'verify'
  const [verificationCode, setVerificationCode] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !phone || !voterId || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/voters/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, phone, voterId, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setStep('verify');
        setMessage('Registration successful. Please check your email for the verification code.');
        setError('');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred. Please try again.');
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const response = await fetch('http://localhost:3000/api/voters/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, token: verificationCode }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Verification successful! You can now log in.');
        setTimeout(() => navigate('/voter/login'), 2000);
      } else {
        setError(data.message || 'Verification failed');
      }
    } catch (err) {
      setError('An error occurred during verification.');
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
            Voter Registration
          </h1>
          <p className="text-gray-600 text-center mb-2 text-sm">Ghana National Online Voting Portal</p>
          <div className="flex space-x-1 mb-2">
            <span className="w-5 h-1.5 bg-red-600 rounded"></span>
            <span className="w-5 h-1.5 bg-yellow-400 rounded"></span>
            <span className="w-5 h-1.5 bg-green-700 rounded"></span>
          </div>
        </div>
        {step === 'register' ? (
          <>
            {error && <p className="error mb-2 text-red-600">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-green-200 focus:ring-2 focus:ring-green-400 focus:outline-none transition text-sm"
                  required
                />
              </div>
              <div>
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-green-200 focus:ring-2 focus:ring-green-400 focus:outline-none transition text-sm"
                  required
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Voter ID"
                  value={voterId}
                  onChange={(e) => setVoterId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-green-200 focus:ring-2 focus:ring-green-400 focus:outline-none transition text-sm"
                  required
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-green-200 focus:ring-2 focus:ring-green-400 focus:outline-none transition text-sm"
                  required
                />
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-green-200 focus:ring-2 focus:ring-green-400 focus:outline-none transition text-sm pr-10"
                  required
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-2 top-2 text-gray-500"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? (
                    <span role="img" aria-label="Hide password">👁️</span>
                  ) : (
                    <span role="img" aria-label="Show password">👁️</span>
                  )}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-green-200 focus:ring-2 focus:ring-green-400 focus:outline-none transition text-sm pr-10"
                  required
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-2 top-2 text-gray-500"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  {showConfirmPassword ? (
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
                Register
              </button>
            </form>
            <div className="mt-6 text-center text-gray-500 text-xs">
              &copy; {new Date().getFullYear()} Ghana Electoral Commission. All rights reserved.
            </div>
          </>
        ) : (
          <>
            {error && <p className="error mb-2 text-red-600">{error}</p>}
            {message && <p className="mb-2 text-green-700">{message}</p>}
            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full px-3 py-2 rounded-lg border border-green-200 bg-gray-100 text-gray-500"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Verification Code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-green-200 focus:ring-2 focus:ring-green-400 focus:outline-none transition text-sm"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-700 via-yellow-400 to-red-600 hover:from-red-600 hover:to-green-700 text-white font-bold py-2 rounded-lg shadow transition text-base"
              >
                Verify Account
              </button>
            </form>
            <div className="mt-6 text-center text-gray-500 text-xs">
              &copy; {new Date().getFullYear()} Ghana Electoral Commission. All rights reserved.
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default RegisterPage;