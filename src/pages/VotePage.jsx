import React, { useEffect, useState } from 'react';
import api from '../api/api';
import ghanaFlag from '../assets/ghana-flag.png'; // Ensure this image exists

export default function VotePage() {
  const [candidates, setCandidates] = useState([]);
  const [selected, setSelected] = useState('');
  const [hasVoted, setHasVoted] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const candRes = await api.get('/candidates');
        setCandidates(Array.isArray(candRes.data) ? candRes.data : []);
        const status = await api.get('/vote/status');
        setHasVoted(status.data.hasVoted);
      } catch (err) {
        console.error(err);
        setMessage('Failed to load candidates or voting status.');
      }
    };
    fetch();
  }, []);

  const handleVote = async () => {
    if (!selected) return;
    if (!window.confirm('Are you sure you want to cast your vote?')) return;
    try {
      await api.post('/vote', { candidateId: selected });
      setHasVoted(true);
      setMessage('✅ Your vote has been cast successfully!');
    } catch (err) {
      setMessage('❌ Vote failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 via-white to-green-100 py-10 px-2">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-8">
        <div className="flex flex-col items-center mb-6">
          <img
            src={ghanaFlag}
            alt="Ghana Flag"
            className="w-20 h-14 mb-2 rounded shadow"
          />
          <h2 className="text-3xl font-extrabold text-green-900 mb-1 text-center">
            Ghana National Election
          </h2>
          <div className="flex space-x-2 mb-2">
            <span className="w-6 h-2 bg-red-600 rounded"></span>
            <span className="w-6 h-2 bg-yellow-400 rounded"></span>
            <span className="w-6 h-2 bg-green-700 rounded"></span>
          </div>
          <p className="text-gray-600 text-sm mb-4 text-center">
            Select your preferred candidate and cast your vote securely.
          </p>
        </div>
        {hasVoted ? (
          <div className="text-green-700 font-bold text-center py-10 text-lg">
            You have already voted. Thank you for participating!
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              {candidates.map((c) => (
                <label
                  key={c._id}
                  className={`border-2 p-4 rounded-xl shadow-sm flex flex-col items-center cursor-pointer transition ${
                    selected === c._id
                      ? 'border-green-700 ring-2 ring-green-300'
                      : 'border-gray-200'
                  }`}
                >
                  {c.image && (
                    <img
                      src={`http://localhost:3000${c.image}`}
                      alt={c.name}
                      className="w-20 h-20 object-cover rounded-full mb-2 border-4 border-white shadow"
                    />
                  )}
                  <input
                    type="radio"
                    name="candidate"
                    value={c._id}
                    checked={selected === c._id}
                    onChange={() => setSelected(c._id)}
                    className="accent-green-700 w-5 h-5 mb-2"
                  />
                  <span className="font-semibold text-green-900">{c.name}</span>
                  <span className="text-sm text-gray-700">{c.party}</span>
                </label>
              ))}
            </div>
            <button
              onClick={handleVote}
              disabled={!selected}
              className="w-full bg-gradient-to-r from-red-600 via-yellow-400 to-green-700 hover:from-green-700 hover:to-red-600 text-white font-bold py-3 rounded-xl shadow transition disabled:opacity-50"
            >
              Submit Vote
            </button>
          </div>
        )}
        {message && (
          <div className="mt-6 text-center text-lg font-semibold text-green-700">{message}</div>
        )}
        <div className="mt-10 text-center text-gray-400 text-xs">
          &copy; {new Date().getFullYear()} Ghana Electoral Commission. All rights reserved.
        </div>
      </div>
    </div>
  );
}