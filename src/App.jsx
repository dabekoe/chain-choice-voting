import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AdminLoginPage from './pages/AdminLoginPage';
import VoterLoginPage from './pages/VoterLoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import ManageCandidates from './pages/ManageCandidates';
import VoterDashboard from './pages/VoterDashboard';
import CandidatesPage from './pages/CandidatesPage';
import ResultsPage from './pages/ResultsPage';
import VotePresidential from './pages/VotePresidential';
import VoteParliamentary from './pages/VoteParliamentary';
import AdminChangePasswordPage from './pages/AdminChangePasswordPage';
const yourToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbklkIjoiNjg4NjA5ZGM5OTY1OWY1MDg1ZWVjNGE5Iiwicm9sZSI6InN1cGVyYWRtaW4iLCJpYXQiOjE3NTQ3NTM0NTQsImV4cCI6MTc1NDgzOTg1NH0.NksMDs-bJ6dZ_cfeFwsd-VVdLgGCAB5dukb6EoGsUaw";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin/change-password" element={<AdminChangePasswordPage token={yourToken} />} />
      <Route path="/voter/login" element={<VoterLoginPage />} />
      <Route path="/voter/register" element={<RegisterPage />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/admin/manage-candidates" element={<ManageCandidates />} />
      <Route path="/voter-dashboard" element={<VoterDashboard />} />
      <Route path="/candidates" element={<CandidatesPage />} />
      <Route path="/results" element={<ResultsPage />} />
      <Route path="/vote/presidential" element={<VotePresidential />} />
      <Route path="/vote/parliamentary" element={<VoteParliamentary />} />
      {/* ✅ NEW DYNAMIC ROUTE */}
      <Route path="/vote/parliamentary/:constituency" element={<VoteParliamentary />} />
    </Routes>
  );
}

export default App;
