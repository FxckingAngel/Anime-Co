// Simple SQLite wrapper for per-guild settings and logs
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const db = new sqlite3.Database(path.join(__dirname, 'animeco.db'));

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS guild_settings (
    guild_id TEXT PRIMARY KEY,
    settings TEXT
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS custom_commands (
    guild_id TEXT,
    name TEXT,
    response TEXT,
    PRIMARY KEY (guild_id, name)
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS logs (
    guild_id TEXT,
    type TEXT,
    data TEXT,
    timestamp INTEGER
  )`);
});

module.exports = {
  getSettings(guildId, cb) {
    db.get('SELECT settings FROM guild_settings WHERE guild_id = ?', [guildId], (err, row) => {
      if (err) return cb(err);
      cb(null, row ? JSON.parse(row.settings) : {});
    });
  },
  setSettings(guildId, settings, cb) {
    db.run('INSERT OR REPLACE INTO guild_settings (guild_id, settings) VALUES (?, ?)', [guildId, JSON.stringify(settings)], cb);
  },
  getCustomCommands(guildId, cb) {
    db.all('SELECT name, response FROM custom_commands WHERE guild_id = ?', [guildId], cb);
  },
  setCustomCommand(guildId, name, response, cb) {
    db.run('INSERT OR REPLACE INTO custom_commands (guild_id, name, response) VALUES (?, ?, ?)', [guildId, name, response], cb);
  },
  deleteCustomCommand(guildId, name, cb) {
    db.run('DELETE FROM custom_commands WHERE guild_id = ? AND name = ?', [guildId, name], cb);
  },
  log(guildId, type, data, cb) {
    db.run('INSERT INTO logs (guild_id, type, data, timestamp) VALUES (?, ?, ?, ?)', [guildId, type, JSON.stringify(data), Date.now()], cb);
  },
  getLogs(guildId, type, cb) {
    db.all('SELECT * FROM logs WHERE guild_id = ? AND type = ? ORDER BY timestamp DESC LIMIT 100', [guildId, type], cb);
  }
};
