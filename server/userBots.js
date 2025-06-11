const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const db = new sqlite3.Database(path.join(__dirname, 'animeco.db'));
const crypto = require('crypto');

const ENCRYPTION_KEY = process.env.CREDS_ENCRYPTION_KEY || 'animeco_super_secret_key_32bytes!'; // 32 bytes
const IV_LENGTH = 16;

function encrypt(text) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text) {
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift(), 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS user_bots (
    user_id TEXT PRIMARY KEY,
    bot_token TEXT,
    client_id TEXT,
    client_secret TEXT,
    callback_url TEXT,
    dashboard_url TEXT,
    session_secret TEXT
  )`);
});

module.exports = {
  getUserBot(userId, cb) {
    db.get('SELECT * FROM user_bots WHERE user_id = ?', [userId], (err, row) => {
      if (err) return cb(err);
      if (!row) return cb(null, null);
      // Decrypt sensitive fields
      for (const key of ['bot_token','client_id','client_secret','callback_url','dashboard_url','session_secret']) {
        if (row[key]) row[key] = decrypt(row[key]);
      }
      cb(null, row);
    });
  },
  setUserBot(userId, data, cb) {
    // Encrypt sensitive fields
    const enc = {};
    for (const key of ['bot_token','client_id','client_secret','callback_url','dashboard_url','session_secret']) {
      enc[key] = data[key] ? encrypt(data[key]) : null;
    }
    db.run(
      'INSERT OR REPLACE INTO user_bots (user_id, bot_token, client_id, client_secret, callback_url, dashboard_url, session_secret) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [userId, enc.bot_token, enc.client_id, enc.client_secret, enc.callback_url, enc.dashboard_url, enc.session_secret],
      cb
    );
  }
};
