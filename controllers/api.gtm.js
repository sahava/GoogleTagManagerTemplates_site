const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const {google} = require('googleapis');
const {oauth2Client} = require('./middleware/google-auth');


router.post('/getAccounts', async (req, res) => {
    try {
        const gtm = google.tagmanager({version: 'v2', auth: oauth2Client});
        const results = await gtm.accounts.list();
        let accounts = [];
        results.data.account.forEach(function(e){            
            accounts.push(`<div class="radio radio-info">
                <input data-account-name="${e.name}" class="form-check-input" type="radio" name="accountId" id="accountId_${e.accountId}" value="${e.accountId}">
                <label class="form-check-label" for="accountId_${e.accountId}">
                    ${e.name} <small>( ${e.accountId} )</small>
                </label>
                </div>`);                
        });              
        res.send(accounts.join(''));
    }catch(err){
        res.status(401).send('UNAUTHORIZED REQUEST');
    }
});

router.post('/getContainers/:accountId?', async (req, res, next) => {
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
            const gtm = google.tagmanager({version: 'v2', auth: oauth2Client});                
            const results = await gtm.accounts.containers.list({parent: 'accounts/'+accountId});
            let containers = [];
            results.data.container.forEach(function(e){
                containers.push(`<div class="radio radio-info">
                    <input data-container-name="${e.name}" data-container-public-id="${e.publicId}" class="form-check-input" type="radio" name="containerId" id="containerId_${e.containerId}" value="${e.containerId}">
                    <label class="form-check-label" for="containerId_${e.accountId}">
                        ${e.name} <small>( ${e.publicId} )</small>
                    </label>
                    </div>`);
            });  
            res.send(containers.join(''));                 
        } catch(err) {
        }                    
    } catch (err) {
        res.status(401).send('UNAUTHORIZED REQUEST');
    }
});

router.post('/getWorkspaces/:accountId?/:containerId?/', async (req, res, next) => {
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
            const gtm = google.tagmanager({version: 'v2', auth: oauth2Client});              
            const results = await gtm.accounts.containers.workspaces.list({parent: 'accounts/'+accountId+'/containers/'+containerId});
            let workspaces = [];
            results.data.workspace.forEach(function(e){
                
                workspaces.push(`<div class="radio radio-info">
                    <input data-workspace-name="${e.name}"  class="form-check-input" type="radio" name="workspaceId" id="workspaceId_${e.workspaceId}" value="${e.workspaceId}">
                    <label class="form-check-label" for="containerId_${e.workspaceId}">
                        ${e.name}
                    </label>
                    </div>`);
            });  
            res.send(workspaces.join(''));                 
        } catch(err) {
            // console.error(err)
        }                    
    } catch (err) {
        res.status(401).send('UNAUTHORIZED REQUEST');
    }
});
module.exports = router;