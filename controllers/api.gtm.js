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
    res.json({
      status: 200,
      results: results.data.account
    });
  } catch (err) {
    res.status(401).send({
      status: 401,
      message: 'unauthorized request'
    });
  }
});

router.get('/getContainers/:accountId?', async (req, res) => {
  try {
    let error = null;
    const accountId = req.params.accountId;
    // If no Account ID, throw 500        
    if (!accountId) {
      res.status(500).send({
        status: 500,
        message: 'missing account id'
      });      
    }

    // If invalid ID, throw 500        
    if (isNaN(accountId, 10)) {
      res.status(500).send({
        status: 500,
        message: 'invalid account id (base 10 number expected)'
      });  
    }
    try {
      const gtm = google.tagmanager({ version: 'v2', auth: oauth2Client });
      const results = await gtm.accounts.containers.list({ parent: 'accounts/' + accountId });
      res.json({
        status: 200,
        results: results.data.container
      });      
    } catch (err) {
      if(err && err.errors && err.errors[0])
        error = err.errors[0].message;
      else
        error = "something went wrong";
      res.status(500).send({
        status: 500,
        message: error
      });
    }
  } catch (err) {
    res.status(401).send({
      status: 401,
      message: 'unauthorized request'
    });
  }
});

router.get('/getWorkspaces/:accountId?/:containerId?/', async (req, res) => {
  try {
    const accountId = req.params.accountId;
    const containerId = req.params.containerId;
    // If no Account ID, throw 500        
    if (!accountId) {
      res.status(500).send({
        status: 500,
        message: 'missing account id'
      });      
    }
    // If invalid ID, throw 500        
    if (isNaN(accountId, 10)) {
      res.status(500).send({
        status: 500,
        message: 'invalid account id (base 10 number expected)'
      });  
    }
    // If no Container ID, throw 500        
    if (!containerId) {
      res.status(500).send({
        status: 500,
        message: 'missing container id'
      }); 
    }
    // If invalid Container ID, throw 500        
    if (isNaN(containerId, 10)) {
      res.status(500).send({
        status: 500,
        message: 'invalid container id (base 10 number expected)'
      });  
    }
    try {
      const gtm = google.tagmanager({ version: 'v2', auth: oauth2Client });
      const results = await gtm.accounts.containers.workspaces.list({ parent: 'accounts/' + accountId + '/containers/' + containerId });
      res.json({
        status: 200,
        results: results.data.workspace
      });      
    } catch (err) {
      res.status(500).send({
        status: 500,
        message: 'something went wrong'
      });
    }
  } catch (err) {
    res.status(401).send({
      status: 401,
      message: 'unauthorized request'
    });
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
      res.status(500).send({
        status: 500,
        message: 'missing template id'
      });        
    }
    // If invalid ID, throw 500        
    if (isNaN(templateId, 10)) {
      res.status(500).send({
        status: 500,
        message: 'invalid template id (base 10 number expected)'
      }); 
    }
    // If no Account ID, throw 500        
    if (!accountId) {
      res.status(500).send({
        status: 500,
        message: 'missing account id'
      });      
    }
    // If invalid ID, throw 500        
    if (isNaN(accountId, 10)) {
      res.status(500).send({
        status: 500,
        message: 'invalid account id (base 10 number expected)'
      });  
    }
    // If no Container ID, throw 500        
    if (!containerId) {
      res.status(500).send({
        status: 500,
        message: 'missing container id'
      }); 
    }
    // If invalid Container ID, throw 500        
    if (isNaN(containerId, 10)) {
      res.status(500).send({
        status: 500,
        message: 'invalid container id (base 10 number expected)'
      });  
    }
    // If no Container ID, throw 500        
    if (!workspaceId) {
      res.status(500).send({
        status: 500,
        message: 'missing workspace id'
      }); 
    }
    // If invalid workspaceID, throw 500        
    if (isNaN(workspaceId, 10)) {
      res.status(500).send({
        status: 500,
        message: 'invalid workspace id (base 10 number expected)'
      }); 
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
      // GET https://www.googleapis.com/tagmanager/v2/+parent/templates
      // accounts/{account_id}/containers/{container_id}/workspaces/{workspace_id}
      // 1. Get Current Container Custom Template List Names
      // 1.2 If current tempalte exisits, template name should be renamed ( maybe GTM API does take care of this automatically, test it)
      // 2. Do the template install call
      // 3.1  Is success increamente install counte, return msg to site.
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
    res.status(401).send({
      status: 401,
      message: 'unauthorized request'
    });
  }
});
module.exports = router;