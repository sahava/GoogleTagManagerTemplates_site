const express = require('express');
const router = express.Router();
const {oauth2Client} = require('./middleware/google-auth');

router.get('/logout/', async (req, res) => {
  try {
    res.clearCookie('gtoken');
    res.redirect(301, req.headers.referer);
  } catch(err) {
    res.redirect(301, '/');
  }
});

router.get('/login/', async (req, res) => {
  try {
    const {tokens} = await oauth2Client.getToken(req.query.code);
    oauth2Client.setCredentials(tokens);
    res.cookie('gtoken', tokens.refresh_token);
    res.end(JSON.stringify({status: 'success'}));
  } catch (err) {
    res.status(401).send('UNAUTHORIZED REQUEST');
  }
});

// Auth callback
router.get('/callback/', async (req, res) => {
  res.render('callback');
});

module.exports = router;
