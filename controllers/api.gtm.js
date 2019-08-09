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
        // "templateId": string,
        "name": parsed_tpl.info.displayName,
        // "fingerprint": string,
        // "tagManagerUrl": string,        
        "templateData": parsed_tpl.json
      }
      const gtm = google.tagmanager({ version: 'v2', auth: oauth2Client });      
      // Grab current workspace custom template names
      const results = await gtm.accounts.containers.workspaces.templates.list({ parent: ["accounts",accountId,"containers",containerId,"workspaces",workspaceId].join('/')});
      const tpls = results.data.template.map(function(e){
        return e.name;
      });

      // TO-DO Refactor
      //
      const indexes = tpls.filter(function(e) {
        var reg = new RegExp('^'+bodyParams.name+'$|'+bodyParams.name+'_import_([0-9]+)$','gi');
        if(e.match(reg))  return e;    
      });   
      indexes.sort();
      if(indexes.length>1){        
        bodyParams.name = bodyParams.name+'_import_'+(parseInt(indexes.reverse()[0].split('_').reverse()[0])+1).toString();
      }else if(indexes.length===1){
        bodyParams.name = bodyParams.name+'_import_1';
      }      

      // Rename Template Name
      bodyParams.templateData = bodyParams.templateData.replace('"displayName": "TEST"','"displayName": "'+bodyParams.name+'"');
      const created = await gtm.accounts.containers.workspaces.templates.create({ 
        parent: ["accounts",accountId,"containers",containerId,"workspaces",workspaceId].join('/'), resource: bodyParams
      });
      
      if(created && created.status && created.status===200){
        res.json({
          status: 200,
          results: [created.data]
        });       
        /*template.installs += 1;
        await model.update(id, template); // USe a copy for the template, to avoid the name to be changed.
        */      
      }

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