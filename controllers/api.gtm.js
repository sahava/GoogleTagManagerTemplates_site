const express = require('express');
const router = express.Router();
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

router.get('/installTemplate/:templateId?/:accountId?/:containerId?/:workspaceId?/', async (req, res) => {
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
        res.status(404).send({
          status: 404,
          message: 'template doesn\'t exist!'
        });         
      }
      const parsed_tpl = gtmTplParser.parseTemplate(JSON.parse(JSON.stringify(template)));      

      let bodyParams = {
        "path": ["accounts",accountId,"containers",containerId,"workspaces",workspaceId].join('/'),
        "accountId": accountId,
        "containerId": containerId,
        "workspaceId": workspaceId,
        //"templateId": string,
        "name": parsed_tpl.name,
        //"fingerprint": string,
        //"tagManagerUrl": string,
        "templateData": parsed_tpl.json
      }
      const gtm = google.tagmanager({ version: 'v2', auth: oauth2Client });      

      // Grab current workspace custom template names
      const results = await gtm.accounts.containers.workspaces.templates.list({ parent: ["accounts",accountId,"containers",containerId,"workspaces",workspaceId].join('/')});
      const tpls = results.data.template.map(function(e){
        return e.name;
      });
      // Template name already exists
      if(tpls.indexOf(bodyParams.name)>-1){        
        // Check if the template name is already a copied one, if not increment number
        // All this need refactoring, not happy with the way is coded for now.
        // Talk with simo about naming format
        // final __INT , or leading "Copy (INT) "
        if(bodyParams.name.match(/.+(__[0-9]{1,3})$/)){
          // This template seems to be already a copy
          const index = parseInt(bodyParams.name.match(/.+__([0-9]{1,3})$/)[1]);
          const nextIndex = index+1;
          bodyParams.name = bodyParams.name.replace("__"+index,"__"+nextIndex);
        }else{
          bodyParams.name = bodyParams.name + '__1';  
        }
        
      }

      const created = await gtm.accounts.containers.workspaces.templates.create({ 
        parent: ["accounts",accountId,"containers",containerId,"workspaces",workspaceId].join('/'), resource: bodyParams
      });
      res.status(200).send(created);     
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
      //res.status(500).send('SOMETHING WENT WRONG');
      res.status(200).send(err);
      //res.status(500).send(err);
    }
  } catch (err) {
    res.status(401).send({
      status: 401,
      message: 'unauthorized request'
    });
  }
});
module.exports = router;