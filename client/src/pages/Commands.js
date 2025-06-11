import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Commands.css';

const Commands = () => {
  const [commands, setCommands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('/api/commands')
      .then(res => {
        setCommands(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch commands.');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loader">Loading commands...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="commands-page">
      <h1>Bot Commands</h1>
      <div className="commands-list">
        {commands.map(cmd => (
          <div className="command-card" key={cmd.name}>
            <div className="command-header">
              <span className="command-name">/{cmd.name}</span>
              <span className="command-category">{cmd.category}</span>
            </div>
            <div className="command-desc">{cmd.description}</div>
            <div className="command-usage"><strong>Usage:</strong> <code>{cmd.usage}</code></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Commands;
