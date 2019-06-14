const express = require('express');
const router = express.Router();
const firebase = require('../helpers/firebase');

router.get('/', firebase.isAuthenticated, (req, res) => {
  res.send('hello');
});

module.exports = router;
