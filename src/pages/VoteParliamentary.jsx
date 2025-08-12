import React, { useEffect, useState } from 'react';
import api from '../api/api';

export default function VoteParliamentary() {
  const [constituency, setConstituency] = useState('');
  const [availableConstituencies, setAvailableConstituencies] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch all constituencies on mount
  useEffect(() => {
    const fetchConstituencies = async () => {
      try {
        const res = await api.get('/api/candidates?type=parliamentary');
        const allCandidates = res.data.candidates || [];
        const constituencies = [...new Set(
          allCandidates
            .map(c => c.constituency?.toUpperCase())
            .filter(c => c)
        )];
        setAvailableConstituencies(constituencies.sort());
      } catch (err) {
        console.error('Failed to load constituencies:', err);
        setMessage('❌ Failed to load constituencies.');
      }
    };

    fetchConstituencies();
  }, []);

  // Fetch candidates when a constituency is selected
  useEffect(() => {
    if (constituency) {
      const fetchCandidates = async () => {
        try {
          const res = await api.get(
            `/api/candidates?type=parliamentary&constituency=${constituency}`
          );
          setCandidates(res.data.candidates || []);
        } catch (err) {
          console.error('Failed to load candidates:', err);
          setMessage('❌ Failed to load candidates.');
        }
      };
      fetchCandidates();
    } else {
      setCandidates([]);
      setSelectedCandidate('');
    }
  }, [constituency]);

  const handleVote = async () => {
    if (!selectedCandidate) {
      alert('Please select a candidate.');
      return;
    }

    setLoading(true);
    setMessage('');
    try {
      await api.post('/api/votes', {
        candidateId: selectedCandidate,
        electionType: 'parliamentary',
      });

      setMessage('✅ Vote cast successfully!');
    } catch (err) {
      console.error(err);
      setMessage('❌ ' + (err.response?.data?.message || 'Vote failed.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-100 py-10 px-2">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-8">
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-3xl font-extrabold text-blue-900 mb-2">Parliamentary Election</h2>
          <p className="text-gray-500 text-sm mb-4">Select your constituency and preferred candidate</p>
        </div>

        {/* Constituency Dropdown */}
        <select
          value={constituency}
          onChange={(e) => setConstituency(e.target.value)}
          className="border p-3 rounded-lg mb-8 w-full focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Select your constituency</option>
          {availableConstituencies.map((c, i) => (
            <option key={i} value={c}>{c}</option>
          ))}
        </select>

        {constituency && candidates.length === 0 && (
          <p className="text-gray-600 mb-4 text-center">
            ⚠️ No candidates found for this constituency.
          </p>
        )}

        {/* Candidate List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {candidates.map((c) => (
            <div
              key={c._id}
              className={`border-2 p-4 rounded-xl shadow-sm bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col items-center transition ${
                selectedCandidate === c._id
                  ? 'border-blue-600 ring-2 ring-blue-300'
                  : 'border-gray-200'
              }`}
            >
              {c.image && (
                <img
                  src={`https://chain-choice-backend-1.onrender.com${c.image}`}
                  alt={c.name}
                  className="w-28 h-28 object-cover rounded-full mb-3 border-4 border-white shadow"
                />
              )}
              <label className="flex items-center space-x-2 mb-2">
                <input
                  type="radio"
                  name="candidate"
                  value={c._id}
                  checked={selectedCandidate === c._id}
                  onChange={() => setSelectedCandidate(c._id)}
                  className="accent-blue-600 w-5 h-5"
                />
                <span className="font-semibold text-blue-900">{c.name}</span>
              </label>
              <span className="text-sm text-gray-700 mb-1">{c.party}</span>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <button
          onClick={handleVote}
          disabled={!selectedCandidate || loading}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold py-3 rounded-xl shadow mt-8 transition disabled:opacity-50"
        >
          {loading ? 'Submitting Vote...' : 'Cast Vote'}
        </button>

        {/* Message */}
        {message && <p className="mt-6 text-center text-lg font-semibold text-blue-700">{message}</p>}

        <div className="mt-10 text-center text-gray-400 text-xs">
          &copy; {new Date().getFullYear()} National Online Voting System. All rights reserved.
        </div>
      </div>
    </div>
  );
}