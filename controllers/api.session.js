const express = require('express');
const router = express.Router();
const {app} = require('../helpers/firebase');

router.post('/login/', async (req, res) => {
  try {
    const idToken = req.body.idToken.toString();

    // Set session cookie settings
    const expiresIn = 1000 * 60 * 60 * 24 * 5;
    const options = {maxAge: expiresIn, httpOnly: true, secure: process.env.NODE_ENV === 'production'};

    const sessionCookie = await app.auth().createSessionCookie(idToken, {expiresIn});

    res.cookie('session', sessionCookie, options);
    res.end(JSON.stringify({status: 'success'}));
  } catch (err) {
    res.status(401).send('UNAUTHORIZED REQUEST');
  }
});

router.get('/logout/', async (req, res) => {
  try {
    const sessionCookie = req.cookies.session || '';
    res.clearCookie('session');
    const decodedClaims = app.auth().verifySessionCookie(sessionCookie);
    await app.auth().revokeRefreshTokens(decodedClaims.sub);
    res.redirect(301, '/');
  } catch(err) {
    res.redirect(301, '/');
  }
});

module.exports = router;
