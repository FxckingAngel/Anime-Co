const express = require('express');
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const session = require('express-session');
const userBots = require('./userBots');

const router = express.Router();

const scopes = ['identify', 'guilds'];

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

// Remove global DiscordStrategy initialization
// Instead, dynamically add strategy per user on /login

router.use(session({
  secret: process.env.SESSION_SECRET || 'animeco_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 }, // 1 week
}));
router.use(passport.initialize());
router.use(passport.session());

// Dynamic Discord OAuth login
router.get('/login', (req, res, next) => {
  // You must be authenticated to have user id (e.g. via session or JWT)
  // If not, redirect to dashboard to set credentials
  if (!req.isAuthenticated() || !req.user) {
    return res.redirect(process.env.DASHBOARD_URL || 'http://localhost:3000/');
  }
  userBots.getUserBot(req.user.id, (err, creds) => {
    if (err || !creds || !creds.client_id || !creds.client_secret || !creds.callback_url) {
      // Redirect to dashboard to set credentials
      return res.redirect((process.env.DASHBOARD_URL || 'http://localhost:3000/') + 'settings/oauth');
    }
    // Remove any existing Discord strategy for hot reload
    try { passport.unuse('discord'); } catch {}
    passport.use('discord', new DiscordStrategy({
      clientID: creds.client_id,
      clientSecret: creds.client_secret,
      callbackURL: creds.callback_url,
      scope: scopes,
    }, (accessToken, refreshToken, profile, done) => {
      process.nextTick(() => done(null, profile));
    }));
    // Proceed with authentication
    passport.authenticate('discord')(req, res, next);
  });
});

router.get('/callback', (req, res, next) => {
  // Use the same dynamic strategy as in /login
  if (!req.isAuthenticated() || !req.user) {
    return res.redirect(process.env.DASHBOARD_URL || 'http://localhost:3000/');
  }
  userBots.getUserBot(req.user.id, (err, creds) => {
    if (err || !creds || !creds.client_id || !creds.client_secret || !creds.callback_url) {
      return res.redirect((process.env.DASHBOARD_URL || 'http://localhost:3000/') + 'settings/oauth');
    }
    try { passport.unuse('discord'); } catch {}
    passport.use('discord', new DiscordStrategy({
      clientID: creds.client_id,
      clientSecret: creds.client_secret,
      callbackURL: creds.callback_url,
      scope: scopes,
    }, (accessToken, refreshToken, profile, done) => {
      process.nextTick(() => done(null, profile));
    }));
    passport.authenticate('discord', {
      failureRedirect: '/api/auth/failed',
    })(req, res, () => {
      res.redirect(creds.dashboard_url || process.env.DASHBOARD_URL || 'http://localhost:3000/dashboard');
    });
  });
});

router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect(process.env.DASHBOARD_URL || 'http://localhost:3000/');
  });
});

router.get('/user', (req, res) => {
  if (!req.isAuthenticated() || !req.user) return res.status(401).json({ error: 'Not authenticated' });
  res.json(req.user);
});

router.get('/guilds', (req, res) => {
  if (!req.isAuthenticated() || !req.user) return res.status(401).json({ error: 'Not authenticated' });
  res.json(req.user.guilds);
});

router.get('/failed', (req, res) => {
  res.status(401).json({ error: 'Authentication failed' });
});

module.exports = router;
