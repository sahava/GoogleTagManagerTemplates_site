const express = require('express');
const model = require('../models/template-db');
const createError = require('http-errors');
const router = express.Router();
const gtmTplParser = require('../helpers/gtm-custom-template-parser');
const categories_details = {
    'analytics': {
        name: 'Analytics',
        slug: 'analytics',
        count: 1
    },
    'abtest': {
        name: 'A/B Tests',
        slug: 'abtest',
        count: 1
    },
    'pixels': {
        name: 'Marketing Pixel',
        slug: 'pixels',
        count: 1
    }
}; 
router.get('/:id/:name', async (req, res, next) => {
  try {
    const id = req.params.id;

    // If invalid ID, throw 404
    if (isNaN(parseInt(id, 10))) {
      next(createError(404));
      return;
    }

    // Fetch item that matches ID
    const [result] = await model.read(id);

    // If no such item exists
    if (!result) {
      next(createError(404));
      return;
    }

    // Compile template object
    const template = result;
    const parsed_tpl = gtmTplParser.parseTemplate(template.json, "json");

    if (parsed_tpl) {
      template.logo = parsed_tpl.info.brand.thumbnail;
      template.contexts = parsed_tpl.info.containerContexts.join(', ');
      template.displayName = parsed_tpl.info.displayName;
      template.description = parsed_tpl.info.description;
      template.type = parsed_tpl.info.type;
      template.permissions = parsed_tpl.permissions;
    }
    template.views += 1;

    // Increment template views
    await model.update(id, template);

    // Render dataLayer and page
    const dataLayer = {
      event: 'datalayer-initialized',
      page: {
        type: 'custom template page',
        title: template.displayName + ' Custom Template'
      },
      template: parsed_tpl
    };

    res.render('template', {
        title: dataLayer.page.title,
        dataLayer: dataLayer,
        categories_list: categories_details,
        template
    });

  } catch(err) {
     next(err);
  }
});

module.exports = router;
