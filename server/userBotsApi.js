const express = require('express');
const userBots = require('./userBots');
const router = express.Router();

// Middleware: require authentication
function requireAuth(req, res, next) {
  if (!req.isAuthenticated() || !req.user) return res.status(401).json({ error: 'Not authenticated' });
  next();
}

// Get current user's bot settings (never expose secrets to others)
router.get('/bot-settings', requireAuth, (req, res) => {
  userBots.getUserBot(req.user.id, (err, row) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    if (!row) return res.json({});
    // Only return to the owner
    res.json({
      bot_token: row.bot_token,
      client_id: row.client_id,
      client_secret: row.client_secret,
      callback_url: row.callback_url,
      dashboard_url: row.dashboard_url,
      session_secret: row.session_secret
    });
  });
});

// Update current user's bot settings
router.post('/bot-settings', requireAuth, (req, res) => {
  userBots.setUserBot(req.user.id, req.body, (err) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    // TODO: Restart user's bot instance here
    res.json({ success: true });
  });
});

module.exports = router;
