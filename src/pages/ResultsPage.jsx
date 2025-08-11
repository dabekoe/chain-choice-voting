import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { Bar } from 'react-chartjs-2';
import { saveAs } from 'file-saver';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const ResultsPage = () => {
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [electionType, setElectionType] = useState('');
  const [constituency, setConstituency] = useState('');
  const [availableConstituencies, setAvailableConstituencies] = useState([]);
  const [viewGraph, setViewGraph] = useState(false);

  // Check admin status from localStorage
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await api.get('/api/votes/results');
        const sorted = [...res.data.results].sort((a, b) => b.voteCount - a.voteCount);
        setResults(sorted);
        setFilteredResults(sorted);

        const constituencies = sorted
          .filter(r => r.type === 'parliamentary')
          .map(r => r.constituency)
          .filter((v, i, a) => v && a.indexOf(v) === i);
        setAvailableConstituencies(constituencies);
      } catch (err) {
        console.error('Failed to load results:', err);
        alert('Failed to load results.');
      }
    };

    fetchResults();
  }, []);

  useEffect(() => {
    let filtered = results;

    if (electionType) {
      filtered = filtered.filter(r => r.type === electionType);
    }

    if (electionType === 'parliamentary' && constituency) {
      filtered = filtered.filter(r => r.constituency === constituency);
    }

    setFilteredResults(filtered);
  }, [electionType, constituency, results]);

  const handleExportCSV = () => {
    const csv = [
      ['Candidate', 'Party', 'Type', 'Constituency', 'Votes'],
      ...filteredResults.map(r => [
        r.name,
        r.party,
        r.type,
        r.type === 'parliamentary' ? r.constituency : '',
        r.voteCount ?? 0
      ])
    ].map(e => e.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, 'election_results.csv');
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text('Election Results', 14, 15);
    autoTable(doc, {
      head: [['Candidate', 'Party', 'Type', 'Constituency', 'Votes']],
      body: filteredResults.map(r => [
        r.name,
        r.party,
        r.type,
        r.type === 'parliamentary' ? r.constituency : '',
        r.voteCount ?? 0
      ]),
      startY: 20
    });
    doc.save('election_results.pdf');
  };

  const topVoteCount = filteredResults.length > 0 ? filteredResults[0].voteCount : null;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Election Results</h2>
      <p className="mb-4 text-gray-700">
        View the results of both <b>Presidential</b> and <b>Parliamentary</b> elections. Use the filters below to select the type and constituency.
      </p>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <select
          className="p-2 border rounded"
          value={electionType}
          onChange={(e) => {
            setElectionType(e.target.value);
            setConstituency('');
          }}
        >
          <option value="">All Election Types</option>
          <option value="presidential">Presidential</option>
          <option value="parliamentary">Parliamentary</option>
        </select>

        {electionType === 'parliamentary' && (
          <select
            className="p-2 border rounded"
            value={constituency}
            onChange={(e) => setConstituency(e.target.value)}
          >
            <option value="">All Constituencies</option>
            {availableConstituencies.map((c, i) => (
              <option key={i} value={c}>{c}</option>
            ))}
          </select>
        )}

        <button onClick={() => setViewGraph(!viewGraph)} className="p-2 px-4 bg-blue-600 text-white rounded">
          {viewGraph ? 'View Table' : 'View Graph'}
        </button>

        {/* Only show export buttons for admin */}
        {isAdmin && (
          <>
            <button onClick={handleExportCSV} className="p-2 px-4 bg-green-600 text-white rounded">
              Export CSV
            </button>
            <button onClick={handleExportPDF} className="p-2 px-4 bg-red-600 text-white rounded">
              Export PDF
            </button>
          </>
        )}
      </div>

      {/* Graph View */}
      {viewGraph ? (
        <Bar
          data={{
            labels: filteredResults.map(r => r.name),
            datasets: [{
              label: 'Votes',
              data: filteredResults.map(r => r.voteCount ?? 0),
              backgroundColor: 'rgba(54, 162, 235, 0.6)'
            }]
          }}
          options={{
            responsive: true,
            plugins: {
              legend: { display: false },
              tooltip: { enabled: true }
            }
          }}
        />
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr className="text-left border-b">
              <th className="py-2 px-4">Candidate</th>
              <th className="py-2 px-4">Party</th>
              <th className="py-2 px-4">Type</th>
              <th className="py-2 px-4">Constituency</th>
              <th className="py-2 px-4">Votes 🔽</th>
            </tr>
          </thead>
          <tbody>
            {filteredResults.map((c) => (
              <tr
                key={c.candidateId}
                className={`border-b hover:bg-gray-50 ${c.voteCount === topVoteCount ? 'bg-yellow-100 font-bold' : ''}`}
              >
                <td className="py-2 px-4">{c.name}</td>
                <td className="py-2 px-4 flex items-center space-x-2">
                  <img
                    src={`http://localhost:3000/logos/${c.party.toUpperCase()}.png`}
                    alt={c.party}
                    className="w-6 h-6 object-contain"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <span>{c.party}</span>
                </td>
                <td className="py-2 px-4 capitalize">{c.type}</td>
                <td className="py-2 px-4">{c.type === 'parliamentary' ? c.constituency : '—'}</td>
                <td className="py-2 px-4">{c.voteCount ?? 0}</td>
              </tr>
            ))}

            {filteredResults.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ResultsPage;