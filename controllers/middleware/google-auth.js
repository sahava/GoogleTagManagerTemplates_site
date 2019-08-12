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

const checkLoggedIn = (req, res, next) => {
  if (!req['user']) {
    res.status(401).send({
      status: 401,
      error_code: '001',
      message: 'You need to be logged in to perform this action.'
    });
  }
  next();
};

const checkAccountId = (req, res, next) => {
  const accountId = req.params.accountId;
  if (!accountId || isNaN(accountId) ) {
    res.status(500).send({
      status: 500,
      error_code: '002',
      message: 'Invalid or missing Account ID (base 10 number expected).'
    });
  }
  if (next) { next(); }
};

const checkContainerId = (req, res, next) => {
  const containerId = req.params.containerId;
  checkAccountId(req, res);
  if (!containerId || isNaN(containerId)) {
    res.status(500).send({
      error_code: '003',
      message: 'Invalid or missing Container ID (base 10 number expected).'
    });
  }
  if (next) { next(); }
};

const checkWorkspaceId = (req, res, next) => {
  const workspaceId = req.params.workspaceId;
  const templateId = req.params.templateId;
  if (!templateId || isNaN(templateId)) {
    res.status(500).send({
      error_code: '004',
      message: 'invalid or missing template id (base 10 number expected)'
    });
  }
  checkContainerId(req, res);
  if (!workspaceId || isNaN(workspaceId)) {
    res.status(500).send({
      error_code: '005',
      message: 'Invalid or missing Workspace ID (base 10 number expected).'
    });
  }
  next();
};

const gtmClient = google.tagmanager({ version: 'v2', auth: oauth2Client });

module.exports = {
  authenticate,
  checkAdmin,
  oauth2Client,
  checkLoggedIn,
  gtmClient,
  checkAccountId,
  checkContainerId,
  checkWorkspaceId
};
