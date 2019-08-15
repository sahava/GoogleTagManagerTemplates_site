const express = require('express');
const router = express.Router();
const {gtmClient, checkLoggedIn, checkAccountId, checkContainerId, checkWorkspaceId} = require('./middleware/google-auth');
const model = require('../models/template-db');
const gtmTplParser = require('../helpers/gtm-custom-template-parser');

const sortByName = (a, b) => {
  if (a.name > b.name) return 1;
  if (a.name < b.name) return -1;
  return 0;
};

router.get('/getAccounts', checkLoggedIn, async (req, res) => {
  try {
    const results = await gtmClient.accounts.list({
      fields: 'account(accountId,name)'
    });
    const sortedList = results.data.account ? results.data.account.sort(sortByName) : [];
    res.json({
      status: 200,
      results: sortedList
    });
  } catch (err) {
    res.status(401).send({
      status: 401,
      message: 'Unauthorized request.'
    });
  }
});

router.get('/getContainers/:accountId?', checkLoggedIn, checkAccountId, async (req, res) => {
  try {
    let error = null;
    const accountId = req.params.accountId;
    try {
      const results = await gtmClient.accounts.containers.list({
        parent: `accounts/${accountId}`,
        fields: 'container(containerId,name,publicId)'
      });
      const sortedList = results.data.container ? results.data.container.sort(sortByName) : [];
      res.json({
        status: 200,
        results: sortedList
      });
    } catch (err) {
      if(err && err.errors && err.errors[0])
        error = err.errors[0].message;
      else
        error = 'Something went wrong.';
      res.status(500).send({
        status: 500,
        error_code: '999',
        message: error
      });
    }
  } catch (err) {
    res.status(401).send({
      status: 401,
      message: 'Unauthorized request.'
    });
  }
});

router.get('/getWorkspaces/:accountId?/:containerId?', checkLoggedIn, checkContainerId, async (req, res) => {
  try {
    const accountId = req.params.accountId;
    const containerId = req.params.containerId;
    try {
      const results = await gtmClient.accounts.containers.workspaces.list({
        parent: `accounts/${accountId}/containers/${containerId}`,
        fields: 'workspace(workspaceId,name)'
      });
      const sortedList = results.data.workspace ? results.data.workspace.sort(sortByName) : [];
      res.json({
        status: 200,
        results: sortedList
      });
    } catch (err) {
      res.status(500).send({
        status: 500,
        message: 'Something went wrong.'
      });
    }
  } catch (err) {
    res.status(401).send({
      status: 401,
      message: 'Unauthorized request.'
    });
  }
});

router.get('/installTemplate/:templateId?/:accountId?/:containerId?/:workspaceId?', checkLoggedIn, checkWorkspaceId, async (req, res) => {
  try {
    const templateId = req.params.templateId;
    const accountId = req.params.accountId;
    const containerId = req.params.containerId;
    const workspaceId = req.params.workspaceId;

    try {
      // Fetch item that matches ID
      const [template] = await model.read(templateId);
      // If no such item exists
      if (!template) {
        res.status(404).send({
          status: 404,
          error_code: '006',
          message: 'Template ID doesn\'t exist!'
        });
      }

      const parsed_tpl = gtmTplParser.parseTemplate(JSON.parse(JSON.stringify(template)));
      const bodyParams = {
        name: parsed_tpl.info.displayName,
        templateData: parsed_tpl.json
      };

      // Grab current workspace available custom template names lis
      const templatesList = await gtmClient.accounts.containers.workspaces.templates.list({
        parent: `accounts/${accountId}/containers/${containerId}/workspaces/${workspaceId}`,
        fields: 'template(name)'
      });

      // Avoid naming conflict by adding "_import_N" to template name, where N is first number that doesn't have a match
      let newName = bodyParams.name;
      let importCount = 1;
      while (templatesList.data.template.filter(tpl => tpl.name === newName).length) {
        newName = bodyParams.name + `_import_${importCount++}`;
      }
      bodyParams.name = newName;
      console.log(bodyParams.name);
      // Rename template in JSON
      bodyParams.templateData = bodyParams.templateData.replace(/"displayName": "[^"]+"/g, `"displayName": "${bodyParams.name}"`);
      console.log(bodyParams.templateData);
      const created = await gtmClient.accounts.containers.workspaces.templates.create({
        parent: `accounts/${accountId}/containers/${containerId}/workspaces/${workspaceId}`,
        resource: bodyParams
      });
      console.log(created);
      if(created && created.status && created.status === 200){
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
      message: 'Unauthorized request.'
    });
  }
});
module.exports = router;
