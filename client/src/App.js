import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Commands from './pages/Commands';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="logo">Anime-Co</div>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/commands">Commands</Link></li>
          <li><Link to="/about">About</Link></li>
        </ul>
      </nav>
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/commands" element={<Commands />} />
          <Route path="/about" element={<About />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>
      <footer className="footer">
        &copy; {new Date().getFullYear()} Anime-Co. All rights reserved.
      </footer>
    </div>
  );
}

export default App;
