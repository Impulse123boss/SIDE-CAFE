import React from 'react';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <h2>Welcome back to <span>Side Café</span> 👋</h2>
      <p className="subtext">What would you like to do today?</p>

      <div className="card-grid">
        <div className="card" onClick={() => navigate('/upload')}>
          📤 Upload Document
        </div>
        <div className="card" onClick={() => navigate('/jobs')}>
          📄 View Print Jobs
        </div>
        <div className="card" onClick={() => navigate('/machines')}>
          🗺 Find a Machine
        </div>
      </div>
    </div>
  );
}
