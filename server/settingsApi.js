const express = require('express');
const db = require('./db');
const router = express.Router();

// Get guild settings
router.get('/settings/:guildId', (req, res) => {
  db.getSettings(req.params.guildId, (err, settings) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json(settings);
  });
});

// Update guild settings
router.post('/settings/:guildId', (req, res) => {
  db.setSettings(req.params.guildId, req.body, (err) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json({ success: true });
  });
});

// Get custom commands
router.get('/custom-commands/:guildId', (req, res) => {
  db.getCustomCommands(req.params.guildId, (err, rows) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json(rows);
  });
});

// Add/update custom command
router.post('/custom-commands/:guildId', (req, res) => {
  const { name, response } = req.body;
  db.setCustomCommand(req.params.guildId, name, response, (err) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json({ success: true });
  });
});

// Delete custom command
router.delete('/custom-commands/:guildId/:name', (req, res) => {
  db.deleteCustomCommand(req.params.guildId, req.params.name, (err) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json({ success: true });
  });
});

module.exports = router;
