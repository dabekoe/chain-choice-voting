import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ghanaFlag from '../assets/ghana-flag.png'; // Ensure this image exists

const CandidatesPage = () => {
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [typeFilter, setTypeFilter] = useState('');
  const [partyFilter, setPartyFilter] = useState('');
  const [form, setForm] = useState({
    name: '',
    party: '',
    type: 'presidential',
    constituency: '',
    image: null
  });
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  const fetchCandidates = async () => {
    try {
      const res = await axios.get('https://chain-choice-backend-1.onrender.com/api/candidates');
      setCandidates(res.data.candidates);
      setFilteredCandidates(res.data.candidates);
    } catch (err) {
      setError('Failed to fetch candidates.');
      console.error('Error fetching candidates:', err);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  useEffect(() => {
    let filtered = candidates;

    if (typeFilter) {
      filtered = filtered.filter(c => c.type === typeFilter);
    }

    if (partyFilter) {
      filtered = filtered.filter(c => c.party.toLowerCase() === partyFilter.toLowerCase());
    }

    setFilteredCandidates(filtered);
  }, [typeFilter, partyFilter, candidates]);

  const uniqueParties = [...new Set(candidates.map(c => c.party))];

  const handleInputChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = e => {
    setForm(prev => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!token) {
      setError('You must be logged in as an admin to perform this action.');
      return;
    }
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('party', form.party);
    formData.append('type', form.type);
    if (form.type === 'parliamentary') {
      formData.append('constituency', form.constituency);
    }
    if (form.image) {
      formData.append('image', form.image);
    }

    try {
      if (editingId) {
        await axios.put(`https://chain-choice-backend-1.onrender.com/api/candidates/${editingId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        setEditingId(null);
      } else {
        await axios.post('https://chain-choice-backend-1.onrender.com/api/candidates', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      setForm({ name: '', party: '', type: 'presidential', constituency: '', image: null });
      fetchCandidates();
    } catch (err) {
      if (err.response && err.response.status === 403) {
        setError('You are not authorized to perform this action. Please log in as an admin.');
      } else {
        setError('Error saving candidate. Please try again.');
      }
      console.error('Error saving candidate:', err);
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('Are you sure you want to delete this candidate?')) return;
    try {
      await axios.delete(`https://chain-choice-backend-1.onrender.com/api/candidates/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCandidates();
    } catch (err) {
      setError('Error deleting candidate.');
      console.error('Error deleting candidate:', err);
    }
  };

  const handleEdit = candidate => {
    setEditingId(candidate._id);
    setForm({
      name: candidate.name,
      party: candidate.party,
      type: candidate.type,
      constituency: candidate.constituency || '',
      image: null
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-green-200 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col items-center mb-8">
          <img src={ghanaFlag} alt="Ghana Flag" className="w-24 h-16 mb-2 rounded shadow" />
          <h1 className="text-3xl font-extrabold text-green-900 mb-1 text-center">
            Ghana National Online Voting
          </h1>
          <div className="flex space-x-2 mb-2">
            <span className="w-8 h-2 bg-red-600 rounded"></span>
            <span className="w-8 h-2 bg-yellow-400 rounded"></span>
            <span className="w-8 h-2 bg-green-700 rounded"></span>
          </div>
          <h2 className="text-xl font-bold text-gray-700 mb-2">Manage Candidates</h2>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-green-800">{editingId ? 'Edit Candidate' : 'Add Candidate'}</h2>
          {error && <div className="mb-4 text-red-600 font-semibold">{error}</div>}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <input type="text" name="name" value={form.name} onChange={handleInputChange} placeholder="Name" className="border p-2 rounded" required />
            <input type="text" name="party" value={form.party} onChange={handleInputChange} placeholder="Party" className="border p-2 rounded" required />
            <select name="type" value={form.type} onChange={handleInputChange} className="border p-2 rounded">
              <option value="presidential">Presidential</option>
              <option value="parliamentary">Parliamentary</option>
            </select>
            {form.type === 'parliamentary' && (
              <input type="text" name="constituency" value={form.constituency} onChange={handleInputChange} placeholder="Constituency" className="border p-2 rounded" required />
            )}
            <input type="file" onChange={handleImageChange} className="border p-2 md:col-span-2 rounded" />
            <button type="submit" className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded col-span-2 font-semibold">
              {editingId ? 'Update' : 'Add'} Candidate
            </button>
          </form>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div>
            <label className="mr-2 font-semibold text-green-900">Filter by Election Type:</label>
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="border p-2 rounded">
              <option value="">All</option>
              <option value="presidential">Presidential</option>
              <option value="parliamentary">Parliamentary</option>
            </select>
          </div>
          <div>
            <label className="mr-2 font-semibold text-green-900">Filter by Party:</label>
            <select value={partyFilter} onChange={e => setPartyFilter(e.target.value)} className="border p-2 rounded">
              <option value="">All</option>
              {uniqueParties.map(party => (
                <option key={party} value={party}>{party}</option>
              ))}
            </select>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-2 text-green-900">Candidates</h2>
        {filteredCandidates.length === 0 ? (
          <p className="text-gray-600">No candidates found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCandidates.map(candidate => (
              <div key={candidate._id} className="border rounded-lg shadow bg-white p-4 flex flex-col md:flex-row items-center justify-between">
                <div className="flex items-center gap-4">
                  {candidate.image && (
                    <img
                      src={`https://chain-choice-backend-1.onrender.com${candidate.image}`}
                      alt={candidate.name}
                      className="w-20 h-20 object-cover border rounded"
                    />
                  )}
                  <div>
                    <p className="font-bold text-lg text-green-900">{candidate.name}</p>
                    <p className="text-gray-700">{candidate.party} <span className="text-xs text-gray-500">({candidate.type})</span></p>
                    {candidate.constituency && <p className="text-sm text-gray-600">Constituency: {candidate.constituency}</p>}
                  </div>
                </div>
                <div className="flex gap-2 mt-4 md:mt-0">
                  <button onClick={() => handleEdit(candidate)} className="bg-yellow-400 hover:bg-yellow-500 px-3 py-1 text-white rounded font-semibold">Edit</button>
                  <button onClick={() => handleDelete(candidate._id)} className="bg-red-600 hover:bg-red-700 px-3 py-1 text-white rounded font-semibold">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
        <footer className="mt-10 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Ghana Electoral Commission. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default CandidatesPage;