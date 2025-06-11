import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Home.css';

function formatUptime(seconds) {
  const d = Math.floor(seconds / (3600*24));
  const h = Math.floor(seconds % (3600*24) / 3600);
  const m = Math.floor(seconds % 3600 / 60);
  const s = Math.floor(seconds % 60);
  return `${d}d ${h}h ${m}m ${s}s`;
}

const Home = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('/api/status')
      .then(res => {
        setStatus(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch bot status.');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loader">Loading bot status...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="home-page">
      <h1>Anime-Co Discord Bot</h1>
      <div className="status-card">
        <div className={`status-indicator ${status.online ? 'online' : 'offline'}`}></div>
        <span className="status-text">{status.online ? 'Online' : 'Offline'}</span>
      </div>
      <div className="stats-grid">
        <div className="stat-item">
          <span className="stat-label">Uptime</span>
          <span className="stat-value">{formatUptime(status.uptime)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Servers</span>
          <span className="stat-value">{status.serverCount}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Users</span>
          <span className="stat-value">{status.userCount}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Ping</span>
          <span className="stat-value">{status.ping} ms</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Version</span>
          <span className="stat-value">{status.version}</span>
        </div>
      </div>
    </div>
  );
};

export default Home;
