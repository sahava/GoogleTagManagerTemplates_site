const express = require('express');
const router = express.Router();
const { oauth2Client } = require('./middleware/google-auth');

router.get('/logout/', async (req, res) => {
  res.clearCookie('gtoken');
  res.end();
});

router.get('/login/', async (req, res) => {
  try {
    const { tokens } = await oauth2Client.getToken(req.query.code);
    oauth2Client.setCredentials(tokens);
    if (tokens.refresh_token) {
      res.cookie('gtoken', tokens.refresh_token, {maxAge: 1000*60*60*24*7, httpOnly: true});
    }
    res.end(JSON.stringify({ status: 'success' }));
  } catch (err) {
    res.status(401).send('UNAUTHORIZED REQUEST');
  }
});

// Auth callback
router.get('/callback/', async (req, res) => {
  res.render('callback');
});

module.exports = router;
