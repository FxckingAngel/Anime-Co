require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Settings & Custom Commands API
app.use('/api', require('./settingsApi'));

// Discord OAuth2 Auth API
app.use('/api/auth', require('./auth'));

// User Bot API (for per-user bot management)
app.use('/api/user-bots', require('./userBotsApi'));

// The following Discord bot logic is removed:
// - No global Discord bot instance
// - No global login with DISCORD_TOKEN
// - All bot logic should be per-user, managed via userBots.js and userBotInstance.js

// Serve static production-ready landing page
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));
app.get('/', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(publicPath, 'dashboard.html'));
});
app.get('/login', (req, res) => {
  res.sendFile(path.join(publicPath, 'login.html'));
});

// API Endpoints
app.get('/api/status', (req, res) => {
  res.json({
    online: true,
    uptime: process.uptime(),
    version: require('./package.json').version,
    message: 'Anime-Co API server is running. No global bot instance.'
  });
});

app.get('/api/about', (req, res) => {
  res.json({
    name: 'Anime-Co',
    description: 'A powerful Discord bot for anime fans. Features anime search, moderation, fun, and more.',
    author: 'Anime-Co Team',
    support: process.env.SUPPORT_LINK || '',
    website: process.env.WEBSITE_LINK || '',
  });
});

app.listen(PORT, () => {
  console.log(`Anime-Co API server running on port ${PORT}`);
});
