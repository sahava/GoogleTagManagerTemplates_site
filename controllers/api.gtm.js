const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const { google } = require('googleapis');
const { oauth2Client } = require('./middleware/google-auth');
const model = require('../models/template-db');
const gtmTplParser = require('../helpers/gtm-custom-template-parser');

router.get('/getAccounts', async (req, res) => {
  try {
    const gtm = google.tagmanager({ version: 'v2', auth: oauth2Client });
    const results = await gtm.accounts.list();

    res.json(results.data.account);
  } catch (err) {
    res.status(401).send('UNAUTHORIZED REQUEST');
  }
});

router.get('/getContainers/:accountId?', async (req, res, next) => {
  try {
    const accountId = req.params.accountId;
    // If no Account ID, throw 500        
    if (!accountId) {
      next(createError(500, 'Missing accountId!'));
      return;
    }

    // If invalid ID, throw 500        
    if (isNaN(parseInt(accountId, 10))) {
      next(createError(500, 'Invalid accountId!'));
      return;
    }
    try {
      const gtm = google.tagmanager({ version: 'v2', auth: oauth2Client });
      const results = await gtm.accounts.containers.list({ parent: 'accounts/' + accountId });
      res.json(results.data.container);
    } catch (err) {
      res.status(500).send('SOMETHING WENT WRONG');
    }
  } catch (err) {
    res.status(401).send('UNAUTHORIZED REQUEST');
  }
});

router.get('/getWorkspaces/:accountId?/:containerId?/', async (req, res, next) => {
  try {
    const accountId = req.params.accountId;
    const containerId = req.params.containerId;
    // If no Account ID, throw 500        
    if (!accountId) {
      next(createError(500, 'Missing accountId!'));
      return;
    }

    // If invalid ID, throw 500        
    if (isNaN(parseInt(accountId, 10))) {
      next(createError(500, 'Invalid accountId!'));
      return;
    }

    // If no Container ID, throw 500        
    if (!containerId) {
      next(createError(500, 'Missing containerId!'));
      return;
    }

    // If invalid Container ID, throw 500        
    if (isNaN(parseInt(containerId, 10))) {
      next(createError(500, 'Invalid containerId!'));
      return;
    }
    try {
      const gtm = google.tagmanager({ version: 'v2', auth: oauth2Client });
      const results = await gtm.accounts.containers.workspaces.list({ parent: 'accounts/' + accountId + '/containers/' + containerId });
      res.json(results.data.workspace);
    } catch (err) {
      res.status(500).send('SOMETHING WENT WRONG');
    }
  } catch (err) {
    res.status(401).send('UNAUTHORIZED REQUEST');
  }
});

router.get('/installTemplate/:templateId?/:accountId?/:containerId?/:workspaceId?/', async (req, res, next) => {
  try {
    const templateId = req.params.templateId;
    const accountId = req.params.accountId;
    const containerId = req.params.containerId;
    const workspaceId = req.params.workspaceId;    
    // If no template ID, throw 500        
    if (!templateId) {
      next(createError(500, 'Missing templateId!'));
      return;
    }

    // If invalid ID, throw 500        
    if (isNaN(parseInt(templateId, 10))) {
      next(createError(500, 'Invalid templateId!'));
      return;
    }

    // If no Account ID, throw 500        
    if (!accountId) {
      next(createError(500, 'Missing accountId!'));
      return;
    }

    // If invalid ID, throw 500        
    if (isNaN(parseInt(accountId, 10))) {
      next(createError(500, 'Invalid accountId!'));
      return;
    }

    // If no Container ID, throw 500        
    if (!containerId) {
      next(createError(500, 'Missing containerId!'));
      return;
    }

    // If invalid Container ID, throw 500        
    if (isNaN(parseInt(containerId, 10))) {
      next(createError(500, 'Invalid containerId!'));
      return;
    }

    // If invalid workspaceID, throw 500        
    if (isNaN(parseInt(workspaceId, 10))) {
      next(createError(500, 'Invalid workspaceId!'));
      return;
    }    

    try {
      /* DO INSTALL STUFF */
      // Fetch item that matches ID
      const [template] = await model.read(templateId);
      // If no such item exists
      if (!template) {
        next(createError(404, 'Template doesn\'t exist!'));
        return;
      }
      const parsed_tpl = gtmTplParser.parseTemplate(JSON.parse(JSON.stringify(template)));      
      const ret = [{
        templateId: templateId,
        accountId: accountId,
        containerId: containerId,
        workspaceId: workspaceId,
        json: parsed_tpl.json
      }];
      res.json(ret);
      // TO-DO TASKS
      // 1. Get Current Container Custom Template List Names
      // 1.2 If current tempalte exisits, template name should be renamed ( maybe GTM API does take care of this automatically, test it)
      // 2. Do the template install call
      // Increment template installs
      /*template.installs += 1;
      await model.update(id, template);
      */
      /*
      const gtm = google.tagmanager({ version: 'v2', auth: oauth2Client });
      const results = await gtm.accounts.containers.list({ parent: 'accounts/' + accountId });
      res.json(results.data.container);
      */
    } catch (err) {
      res.status(500).send('SOMETHING WENT WRONG');
    }
  } catch (err) {
    res.status(401).send('UNAUTHORIZED REQUEST');
  }
});
module.exports = router;