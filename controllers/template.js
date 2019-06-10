const express = require('express');
const model = require('../models/template-db');
const createError = require('http-errors');
const router = express.Router();
const gtmTplParser = require('../helpers/gtm-custom-template-parser');
const enums = require('../helpers/enum');

router.get('/:id/:name?', async (req, res, next) => {
  try {
    const id = req.params.id;

    // If invalid ID, throw 404
    if (isNaN(parseInt(id, 10))) {
      next(createError(404, 'Invalid template ID!'));
      return;
    }

    // Fetch item that matches ID
    const [template] = await model.read(id);

    // If no such item exists
    if (!template) {
      next(createError(404, 'Template doesn\'t exist!'));
      return;
    }

    // Compile template object
    const parsed_tpl = gtmTplParser.parseTemplate(JSON.parse(JSON.stringify(template)));

    // Increment template views
    template.views += 1;
    await model.update(id, template);

    // Render dataLayer and page
    const dataLayer = {
      event: 'datalayer-initialized',
      page: {
        type: 'custom template page',
        title: parsed_tpl.displayName + ' Custom Template'
      },
      template: parsed_tpl
    };

    res.render('template', {
      title: dataLayer.page.title,
      dataLayer: dataLayer,
      categories_list: enums.categories,
      template: parsed_tpl,
      permissions: enums.permissions,
      downloadUrl: `/api/template/tpl/${id}`
    });

  } catch(err) {
     next(err);
  }
});

module.exports = router;
