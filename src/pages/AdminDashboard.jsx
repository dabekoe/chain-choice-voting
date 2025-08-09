import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [admins, setAdmins] = useState([]);
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    navigate('/'); // Redirect to home page after logout
  };

  const fetchAdmins = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/admins', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdmins(res.data);
    } catch (err) {
      console.error('Error fetching admins:', err);
      setAdmins([]);
    }
  };

  useEffect(() => {
    fetchAdmins();
    // eslint-disable-next-line
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/admins', form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForm({ email: '', password: '' });
      fetchAdmins();
    } catch (err) {
      console.error('Error adding admin:', err);
    }
  };

  // Add this function to navigate to the change password page
  const handleChangePassword = () => {
    navigate('/admin/change-password');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-green-100 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8 border-t-8 border-green-700">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-green-900 mb-2">Admin Dashboard</h2>
            <p className="text-gray-600">Manage the Ghana National Online Voting System</p>
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <button
              onClick={handleChangePassword}
              className="bg-gray-700 hover:bg-gray-800 text-white font-semibold px-6 py-2 rounded shadow"
            >
              Change Password
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded shadow"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <button
            onClick={() => navigate('/candidates')}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-4 rounded-lg shadow text-lg transition"
          >
            Manage Candidates
          </button>
          <button
            onClick={() => navigate('/results')}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-lg shadow text-lg transition"
          >
            View Results
          </button>
        </div>

        <div className="border-t pt-8">
          <h3 className="text-2xl font-bold text-green-800 mb-4">Add New Admin</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleInputChange}
              placeholder="Admin Email"
              className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleInputChange}
              placeholder="Admin Password"
              className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
            <button
              type="submit"
              className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-4 py-2 rounded shadow"
            >
              Add Admin
            </button>
          </form>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">Current Admins</h3>
          <ul className="space-y-2">
            {Array.isArray(admins) && admins.map((admin) => (
              <li
                key={admin._id}
                className="flex items-center justify-between border p-3 rounded bg-gray-50"
              >
                <span>
                  <strong className="text-green-900">{admin.email}</strong>
                  <span className="ml-2 text-xs text-gray-500">({admin.role})</span>
                </span>
                {/* Optionally, add a remove button here */}
              </li>
            ))}
          </ul>
        </div>
      </div>
            <footer className="mt-10 text-center text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} Ghana Electoral Commission. All rights reserved.
            </footer>
          </div>
        );
      }