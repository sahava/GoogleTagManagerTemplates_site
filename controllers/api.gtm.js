const express = require('express');
const router = express.Router();
const { google } = require('googleapis');
const { oauth2Client } = require('./middleware/google-auth');
const model = require('../models/template-db');
const gtmTplParser = require('../helpers/gtm-custom-template-parser');

router.get('/getAccounts', async (req, res) => {   
  try {
    if(!req.user){
      res.status(401).send({
        status: 401,
        error_code: '001',
        message: 'You need to be logged in to perform this action <a id="signIn" href="#">Login</a>'
      });    
    }
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
    if(!req.user){
      res.status(401).send({
        status: 401,
        error_code: '001',
        message: 'You need to be logged in to perform this action <a id="signIn" href="#">Login</a>'
      });        
    }
    let error = null;
    const accountId = req.params.accountId;
    // If no Account ID, throw 500        
    if (!accountId || isNaN(accountId, 10) ) {
      res.status(500).send({
        status: 500,
        error_code: '002',
        message: 'invalid or missing account id (base 10 number expected)'
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
        error_code: '999',        
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
    if(!req.user){
      res.status(401).send({
        status: 401,
        error_code: '001',
        message: 'You need to be logged in to perform this action <a id="signIn" href="#">Login</a>'
      });        
    }
    const accountId = req.params.accountId;
    const containerId = req.params.containerId;
    // If no Account ID, throw 500        
    if (!accountId || isNaN(accountId, 10)) {
      res.status(500).send({
        error_code: '002',
        message: 'invalid or missing account id (base 10 number expected)'
      });      
    }
    // If no Container ID, throw 500        
    if (!containerId || isNaN(containerId, 10)) {
      res.status(500).send({
        error_code: '003',
        message: 'invalid or missing container id (base 10 number expected)'
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
    if(!req.user){
      res.status(401).send({
        status: 401,
        error_code: '001',
        message: 'You need to be logged in to perform this action <a id="signIn" href="#">Login</a>'
      });  
    }    
    const templateId = req.params.templateId;
    const accountId = req.params.accountId;
    const containerId = req.params.containerId;
    const workspaceId = req.params.workspaceId;        

    // If no template ID, throw 500        
    if (!templateId || isNaN(templateId, 10)) {
      res.status(500).send({
        error_code: '004',
        message: 'invalid or missing template id (base 10 number expected)'
      });      
    }
    // If no Account ID, throw 500        
    if (!accountId || isNaN(accountId, 10)) {
      res.status(500).send({
        error_code: '002',
        message: 'invalid or missing account id (base 10 number expected)'
      });      
    }    
    // If no Container ID, throw 500        
    if (!containerId || isNaN(containerId, 10)) {
      res.status(500).send({
        error_code: '003',
        message: 'invalid or missing container id (base 10 number expected)'
      });  
    }
    // If no Container ID, throw 500        
    if (!workspaceId || isNaN(workspaceId, 10)) {
      res.status(500).send({
        error_code: '005',
        message: 'invalid or missing workspace id (base 10 number expected)'
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
          error_code: '006',
          message: 'template id doesn\'t exist!'
        });         
      }

      const parsed_tpl = gtmTplParser.parseTemplate(JSON.parse(JSON.stringify(template)));      
      let bodyParams = {
        /* This keys are not needed for template updates.
        "path": ["accounts",accountId,"containers",containerId,"workspaces",workspaceId].join('/'),
        "accountId": accountId,
        "containerId": containerId,
        "workspaceId": workspaceId,
        "templateId": string,        
        "fingerprint": string,
        "tagManagerUrl": string,        
        */
        "name": parsed_tpl.info.displayName,
        "templateData": parsed_tpl.json
      }

      // Init GTM API
      const gtm = google.tagmanager({ version: 'v2', auth: oauth2Client });      
      
      // Grab current workspace available custom template names list
      // Simo . This needs to be updated to use fields ( not sure how to use them )
      const results = await gtm.accounts.containers.workspaces.templates.list({ parent: ["accounts",accountId,"containers",containerId,"workspaces",workspaceId].join('/')});      
      const templatesList = results.data.template.map(function(e){
        return e.name;
      });

      // TO-DO Refactor
      // This list of templates that contain the current template name and thay the end on _import_NUMBER
      // This will mean that we need to increase the counter and not just attaching the string to the name
      const templatesListAlreadyImported = templatesList.filter(function(tpl) {
        var reg = new RegExp('^'+bodyParams.name+'$|'+bodyParams.name+'_import_([0-9]+)$','gi');
        if(tpl.match(reg))  return tpl;    
      });   
      // Sort the list 
      templatesListAlreadyImported.sort();
      // If the current template to be imported is already in the container, let's build up the new name      
      if(templatesListAlreadyImported.length>1){
        // Increase number
        bodyParams.name = bodyParams.name+'_import_'+(parseInt(templatesListAlreadyImported.reverse()[0].split('_').reverse()[0])+1).toString();
      }else if(templatesListAlreadyImported.length===1){
        // Attach import string
        bodyParams.name = bodyParams.name+'_import_1';
      }      

      // Rename Template Name
      // Not the best way to do the rename for surejson.replace
      bodyParams.templateData = bodyParams.templateData.replace(/"displayName": "(\w+)"/,'"displayName": "'+bodyParams.name+'"');
      const created = await gtm.accounts.containers.workspaces.templates.create({ 
        parent: ["accounts",accountId,"containers",containerId,"workspaces",workspaceId].join('/'), resource: bodyParams
      });              
      if(created && created.status && created.status===200){
        res.json({
          status: 200,
          results: [created.data]
        });       
        // TO-DO Install counter increase
        /*
        template.installs += 1;
        await model.update(id, template); // Use a copy for the template, to avoid the name to be changed.
        */      
      }

    } catch (err) {
       res.status(200).send(err);
    }
  } catch (err) {
    res.status(401).send({
      status: 401,
      message: 'unauthorized request'
    });
  }
});
module.exports = router;