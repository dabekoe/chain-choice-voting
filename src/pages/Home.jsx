import React from 'react';
import { Link } from 'react-router-dom';
import ghanaFlag from '../assets/ghana-flag.png'; // Add a Ghana flag image in src/assets
import symbolImage from '../assets/symbol.png'; // Place your symbol image in src/assets

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-100 to-green-200 px-2 py-4">
      <div className="flex flex-col items-center mb-6">
        <img src={ghanaFlag} alt="Ghana Flag" className="w-16 h-10 mb-2 rounded shadow" />
        <h1 className="text-2xl md:text-3xl font-extrabold text-green-900 mb-1 text-center">Ghana National Online Voting</h1>
        <p className="text-base md:text-lg text-gray-700 mb-2 text-center">Secure. Transparent. Accessible.</p>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 flex flex-col items-center w-full max-w-xs md:max-w-md">
        <h2 className="text-lg md:text-xl font-bold text-green-800 mb-4">Welcome</h2>
        <Link
          to="/voter/login"
          className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-2 rounded mb-2 text-center text-sm"
        >
          Voter Login
        </Link>
        <Link
          to="/voter/register"
          className="w-full bg-white border border-green-700 hover:bg-green-50 text-green-800 font-semibold py-2 rounded mb-2 text-center text-sm"
        >
          Voter Registration
        </Link>
        <Link
          to="/admin/login"
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 rounded text-center text-sm"
        >
          Admin Login
        </Link>
      </div>
      <footer className="mt-8 text-gray-500 text-xs text-center">
        &copy; {new Date().getFullYear()} Ghana Electoral Commission. All rights reserved.
      </footer>
      <div className="flex justify-center mt-8 mb-2">
        <img
          src={symbolImage}
          alt="Symbol"
          className="w-24 h-24 object-contain"
          style={{ margin: '0 auto' }}
        />
      </div>
    </div>
    );
  };
  
  export default Home;