import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './About.css';

const About = () => {
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('/api/about')
      .then(res => {
        setAbout(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch about info.');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loader">Loading about info...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="about-page">
      <h1>About {about.name}</h1>
      <p className="about-desc">{about.description}</p>
      <ul className="about-list">
        <li><strong>Author:</strong> {about.author}</li>
        <li><strong>Invite:</strong> <a href={about.invite} target="_blank" rel="noopener noreferrer">Invite Bot</a></li>
        <li><strong>Support:</strong> <a href={about.support} target="_blank" rel="noopener noreferrer">Support Server</a></li>
        <li><strong>Website:</strong> <a href={about.website} target="_blank" rel="noopener noreferrer">{about.website}</a></li>
      </ul>
    </div>
  );
};

export default About;
