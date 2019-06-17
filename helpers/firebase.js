const admin = require('firebase-admin');

const app = admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://gtm-templates-com.firebaseio.com'
});

const authenticate = async (req, res, next) => {
  try {
    const sessionCookie = req.cookies.session || '';
    req.user = await app.auth().verifySessionCookie(sessionCookie, true);
    next();
  } catch(err) {
    next();
  }
};

module.exports = {
  app,
  authenticate
};
