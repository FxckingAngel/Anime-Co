import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [guilds, setGuilds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/auth/user', { withCredentials: true })
      .then(res => {
        setUser(res.data);
        return axios.get('/api/auth/guilds', { withCredentials: true });
      })
      .then(res => {
        setGuilds(res.data);
        setLoading(false);
      })
      .catch(() => {
        window.location.href = '/api/auth/login';
      });
  }, []);

  if (loading) return <div className="loader">Loading dashboard...</div>;

  return (
    <div className="dashboard-page">
      <h1>Welcome, {user.username}#{user.discriminator}</h1>
      <img src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`} alt="avatar" style={{ borderRadius: '50%' }} />
      <h2>Your Servers</h2>
      <div className="guilds-list">
        {guilds.map(guild => (
          <div className="guild-card" key={guild.id}>
            <img src={guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=64` : '/noicon.png'} alt="icon" />
            <span>{guild.name}</span>
            {/* Add manage button/links here */}
          </div>
        ))}
      </div>
      <a href="/api/auth/logout" className="logout-btn">Logout</a>
    </div>
  );
};

export default Dashboard;
