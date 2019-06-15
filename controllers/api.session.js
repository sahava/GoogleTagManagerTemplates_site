const express = require('express');
const router = express.Router();
const {app} = require('../helpers/firebase');

router.post('/', async (req, res) => {
  try {
    const idToken = req.body.idToken.toString();

    // Set session cookie settings
    const expiresIn = 1000 * 60 * 60 * 24 * 5;
    const options = {maxAge: expiresIn, httpOnly: true};

    const sessionCookie = await app.auth().createSessionCookie(idToken, {expiresIn});

    res.cookie('session', sessionCookie, options);
    res.end(JSON.stringify({status: 'success'}));
  } catch (err) {
    console.log(err);
    res.status(401).send('UNAUTHORIZED REQUEST');
  }
});

module.exports = router;
