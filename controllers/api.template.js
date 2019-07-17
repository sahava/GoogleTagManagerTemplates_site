const express = require('express');
const _ = require('lodash');
const model = require('../models/template-db');
const createError = require('http-errors');
const router = express.Router();
const {dsKind} = require('../helpers/enum');
const {parseTemplate} = require('../helpers/gtm-custom-template-parser');

router.get('/tpl/:id', async (req, res, next) => {
  try {

    // List of allowed referrals for hotlinking protection
    const allowed_referrers = [
      'localhost',
      'gtm-templates-com.appspot.com',
      'www.gtmtemplates.com',
      'gtmtemplates.com'
    ];

    // Grab the current referrer hostname
    const referer_hostname= (req.headers.referer ? new URL(req.headers.referer).hostname : "");

    const id = req.params.id;
    const template_url = '/template/'+id;

    // If invalid ID, throw 404
    if (isNaN(parseInt(id, 10))) {
      next(createError(404, 'Invalid template ID!'));
      return;
    }

    // Fetch item that matches ID
    const [template] = await model.read(id);

    // Build up the Checksum String
    const templateChecksumString = `/* GTMTEMPLATESCOM_CHECKSUM:[${template.id}-${new Date(template.updated_date)*1}] */`; 

    // If no such item exists
    if (!template) {
      next(createError(404, 'Template doesn\'t exist!'));
      return;
    }

    // Check no referrer Check no-allowed-referrer
    if(allowed_referrers.indexOf(referer_hostname) === -1) {
      res.redirect(template_url);
      res.end();
    }

    // Increment template downloads
    template.downloads += 1;
    await model.update(id, template);

    // Attach the checksum data as a comment within the template code section. That part of the 
    // template should not change. Others may be updated by Google.
    if(template.json) template.json = template.json.replace("___SANDBOXED_JS_FOR_WEB_TEMPLATE___","___SANDBOXED_JS_FOR_WEB_TEMPLATE___\n\n"+templateChecksumString);

    res.setHeader('Content-Type', 'application/json');
    res.set('Content-Disposition', `attachment;filename=${template.slug}.tpl`);
    res.end(template.json);


  } catch(err) {
     next(err);
  }
});

router.post('/create', async (req, res, next) => {
  try {
    let templateJson = req.body;
    const kind = req.body.kind;

    templateJson.added_date = templateJson.updated_date = new Date();
    templateJson.downloads = templateJson.installs = templateJson.views = 0;
    templateJson = parseTemplate(templateJson);

    const entities = [];
    let entity = null;

    // Create new entities to target DB(s)
    switch (kind) {
      case 'production':
        [entity] = await model.create(templateJson, dsKind.PRODUCTION);
        entities.push(entity);
        break;
      case 'development':
        [entity] = await model.create(templateJson, dsKind.DEVELOPMENT);
        entities.push(entity);
        break;
      case 'both':
        [entity] = await model.create(templateJson, dsKind.PRODUCTION);
        entities.push(entity);
        [entity] = await model.create(templateJson, dsKind.DEVELOPMENT);
        entities.push(entity);
    }

    // Get created entity IDs
    const ids = entities.map(e => _.get(e, 'mutationResults[0].key.path[0].id'));

    // Redirect with success parameter
    res.redirect(301, `/admin/create?success=${ids.join()}`);

  } catch(err) {
    next(err);
  }
});

router.post('/update/:id', async (req, res, next) => {
  try {
    let templateJson = req.body;

    // Fetch item that matches ID
    const [template] = await model.read(req.params.id);

    for (let key in templateJson) {
      template[key] = templateJson[key]
    }

    template.updated_date = new Date();

    await model.update(template.id, template);

    // Redirect with success parameter
    res.redirect(301, `/admin/update/${template.id}?success=${template.id}`);

  } catch(err) {
    next(err);
  }
});

module.exports = router;
