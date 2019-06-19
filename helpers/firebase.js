const admin = require('firebase-admin');
const adminUid = ['Sov88pGOKFghLeVxdhMgswityPs2'];

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

module.exports = {
  app,
  authenticate
};
