const admin = require('firebase-admin');
const adminUid = ['Sov88pGOKFghLeVxdhMgswityPs2', '34HpqBLNtdU6w777mfwznhD1fxI3'];

const app = admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://gtm-templates-com.firebaseio.com'
});

const authenticate = async (req, res, next) => {
  try {
    const sessionCookie = req.cookies.session || '';
    req.user = await app.auth().verifySessionCookie(sessionCookie, true);
    req.user.admin = adminUid.indexOf(req.user.uid) > -1;
    next();
  } catch(err) {
    next();
  }
};

const checkAdmin = (req, res, next) => {
  // Disable caching for admin
  res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.header('Pragma', 'no-cache');
  res.header('Expires', 0);
  if (!req.user || req.user.admin !== true) {
    res.redirect(301, '/');
  } else {
    next();
  }
};

module.exports = {
  app,
  authenticate,
  checkAdmin
};
