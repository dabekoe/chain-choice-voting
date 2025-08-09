import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

export default function VoterDashboard() {
  const [elections, setElections] = useState([]);
  const [voteStatus, setVoteStatus] = useState({ presidential: false, parliamentary: [] });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const res = await api.get('/api/votes/elections', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setElections(Array.isArray(res.data.elections) ? res.data.elections : []);
      } catch (err) {
        console.error('Error fetching elections:', err);
        setError('Failed to load elections');
      }
    };

    const fetchVoteStatus = async () => {
      try {
        const res = await api.get('/api/votes/status', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setVoteStatus(res.data);
      } catch (err) {
        setVoteStatus({ presidential: false, parliamentary: [] });
      }
    };

    fetchElections();
    fetchVoteStatus();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    navigate('/'); // Redirect to home page after logout
  };

  const handleVoteClick = (type, constituency = '') => {
    if (type === 'presidential') {
      navigate('/vote/presidential');
    } else {
      navigate(`/vote/parliamentary/${constituency}`);
    }
  };

  // Filter to show only one Parliamentary Election card
  const uniqueElections = [];
  const seenTypes = new Set();
  for (const election of elections) {
    const key = election.type === 'parliamentary' ? 'parliamentary' : election.type;
    if (!seenTypes.has(key)) {
      uniqueElections.push(election);
      seenTypes.add(key);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex flex-col items-center py-10 px-2">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-blue-900 mb-1">Welcome, Voter</h2>
            <p className="text-gray-500 text-sm">Your secure voting dashboard</p>
          </div>
          <button
            onClick={handleLogout}
            className="mt-4 md:mt-0 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold shadow transition"
          >
            Logout
          </button>
        </div>

        <h3 className="text-xl font-bold text-gray-800 mb-4">Available Elections</h3>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        {uniqueElections.length === 0 ? (
          <div className="text-gray-500 text-center py-12">
            <svg className="mx-auto mb-2" width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="#a0aec0">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            No elections available at the moment.
          </div>
        ) : (
          <div className="space-y-5">
            {uniqueElections.map((election, i) => {
              let voted = false;
              if (election.type === 'presidential') {
                voted = voteStatus.presidential;
              } else if (election.type === 'parliamentary') {
                voted = voteStatus.parliamentary && voteStatus.parliamentary.length > 0;
              }
              return (
                <div
                  key={i}
                  className="flex flex-col md:flex-row md:justify-between md:items-center border rounded-xl shadow-sm p-5 bg-gradient-to-r from-blue-50 to-indigo-50"
                >
                  <div className="mb-2 md:mb-0">
                    <span className="font-semibold text-lg text-blue-800">
                      {election.type === 'presidential'
                        ? 'Presidential Election'
                        : 'Parliamentary Election'}
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      handleVoteClick(election.type, election.constituency)
                    }
                    className={`px-6 py-2 rounded-lg font-bold shadow transition ${
                      voted
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-indigo-700 text-white'
                    }`}
                    disabled={voted}
                  >
                    {voted ? 'Voted' : 'Vote'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className="mt-8 text-center text-gray-400 text-xs">
        &copy; {new Date().getFullYear()} National Online Voting System. All rights reserved.
      </div>
    </div>
  );
}