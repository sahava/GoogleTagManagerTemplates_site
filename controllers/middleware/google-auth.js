const {google} = require('googleapis');
const secret = require('../../secret/oauth-secret.json');
const adminUid = ['109635181158374226872'];

const oauth2Client = new google.auth.OAuth2(
  secret.web.client_id,
  secret.web.client_secret,
  process.env.NODE_ENV === 'production' ? secret.web.redirect_uris[0] : secret.web.redirect_uris[1]
);
const oauth2 = new google.oauth2('v2');

const scopes = ['https://www.googleapis.com/auth/tagmanager.edit.containers', 'profile'];
const url = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes
});

const authenticate = async (req, res, next) => {
  try {
    const gtoken = req.cookies.gtoken;
    if (gtoken) {
      oauth2Client.setCredentials({
        refresh_token: gtoken
      });
      const userinfo = await oauth2.userinfo.get({
        auth: oauth2Client
      });
      req.user = userinfo.data;
      req.user.admin = adminUid.indexOf(req.user.id) > -1;
    } else {
      res.locals.googleAuthUrl = url;
    }
    next();
  } catch(err) {
    res.locals.googleAuthUrl = url;
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
  authenticate,
  checkAdmin,
  oauth2Client
};
