import React from 'react';

// Replace with your actual backend domain
const BACKEND_URL = 'https://your-backend-domain.com';

export default function PartyNameWithLogo({ party, logoFilename, className = '' }) {
  if (!party || !logoFilename) return <span>{party}</span>;
  return (
    <span className={`flex items-center ${className}`}>
      <img
        src={`${BACKEND_URL}/logos/${logoFilename}`}
        alt={party + " logo"}
        className="w-8 h-8 object-contain mr-2"
      />
      <span className="font-bold text-lg text-gray-900">{party}</span>
    </span>
  );
}