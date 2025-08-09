import React, { useState, useEffect } from 'react';
import api from '../api/api';
import Select from 'react-select';
import ghanaConstituencies from '../data/ghanaConstituencies';
import ghanaFlag from '../assets/ghana-flag.png'; // Add this image to your assets

const ManageCandidates = () => {
  const [name, setName] = useState('');
  const [party, setParty] = useState('');
  const [type, setType] = useState('presidential');
  const [constituency, setConstituency] = useState(null);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [message, setMessage] = useState('');

  const constituencyOptions = ghanaConstituencies.map((c) => ({
    label: c,
    value: c,
  }));

  const handleAddCandidate = async (e) => {
    e.preventDefault();

    if (!image) {
      return setMessage('Please select an image.');
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('party', party);
    formData.append('type', type);
    if (type === 'parliamentary' && constituency?.value) {
      formData.append('constituency', constituency.value);
    }
    formData.append('image', image);

    try {
      const token = localStorage.getItem('token');
      const res = await api.post('/candidates', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage(res.data.message || 'Candidate added successfully ✅');
      setName('');
      setParty('');
      setType('presidential');
      setConstituency(null);
      setImage(null);
      setImagePreview(null);
    } catch (err) {
      console.error('Error adding candidate:', err);
      setMessage(err.response?.data?.message || 'Failed to add candidate ❌');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  };

  useEffect(() => {
    // For debugging
    // console.log("Type:", type);
    // console.log("Constituency:", constituency);
  }, [type, constituency]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 via-yellow-50 to-green-100">
      <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-2xl border-t-8 border-green-700 relative">
        <div className="flex flex-col items-center mb-6">
          <img
            src={ghanaFlag}
            alt="Ghana Flag"
            className="w-20 h-14 mb-2 rounded shadow"
          />
          <h1 className="text-2xl font-extrabold text-green-900 mb-1 text-center">
            Ghana National Online Voting
          </h1>
          <div className="flex space-x-2 mb-2">
            <span className="w-6 h-2 bg-red-600 rounded"></span>
            <span className="w-6 h-2 bg-yellow-400 rounded"></span>
            <span className="w-6 h-2 bg-green-700 rounded"></span>
          </div>
          <h2 className="text-lg font-bold text-gray-700 mb-2">Add New Candidate</h2>
        </div>
        <form onSubmit={handleAddCandidate} className="space-y-4" encType="multipart/form-data">
          <div>
            <label className="block mb-1 font-semibold text-green-900">Candidate Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 rounded border border-green-200 focus:ring-2 focus:ring-green-400"
              placeholder="Enter candidate name"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold text-green-900">Party</label>
            <input
              type="text"
              value={party}
              onChange={(e) => setParty(e.target.value)}
              required
              className="w-full px-3 py-2 rounded border border-green-200 focus:ring-2 focus:ring-green-400"
              placeholder="Enter party name"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold text-green-900">Election Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
              className="w-full px-3 py-2 rounded border border-green-200 focus:ring-2 focus:ring-green-400"
            >
              <option value="presidential">Presidential</option>
              <option value="parliamentary">Parliamentary</option>
            </select>
          </div>

          {type === 'parliamentary' && (
            <div>
              <label className="block mb-1 font-semibold text-green-900">Select Constituency</label>
              <Select
                options={constituencyOptions}
                value={constituency}
                onChange={setConstituency}
                isSearchable
                className="react-select-container"
                classNamePrefix="react-select"
                styles={{
                  control: (provided) => ({
                    ...provided,
                    padding: '2px',
                    borderRadius: '0.375rem',
                    borderColor: '#d1d5db',
                  }),
                }}
              />
            </div>
          )}

          <div>
            <label className="block mb-1 font-semibold text-green-900">Candidate Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
              className="w-full"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Candidate Preview"
                className="mt-2 w-full h-48 object-cover rounded shadow"
              />
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-red-600 via-yellow-400 to-green-700 hover:from-green-700 hover:to-red-600 text-white font-bold py-2 rounded shadow transition"
          >
            Add Candidate
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm font-semibold text-blue-700">{message}</p>
        )}
        <div className="mt-6 text-center text-gray-500 text-xs">
          &copy; {new Date().getFullYear()} Ghana Electoral Commission. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default ManageCandidates;