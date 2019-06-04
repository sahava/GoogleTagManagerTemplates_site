const express = require('express');
const model = require('../models/template-db');
const createError = require('http-errors');
const router = express.Router();

router.get('/:id/:name', async (req, res, next) => {
  try {
    const id = req.params.id,
        name = req.params.name;

    // Fetch item that matches ID
    const result = await model.read(id);

    // If no such item exists
    if (result.length === 0) {
      next(createError(404));
      return;
    }

    // Compile template object
    const template = result[0];
    let data = template.json.split(/___(.+)___/).slice(1);
    template.info = data[1] || {};
    template.parameters = data[3];
    template.permissions = data[5];
    template.code = data[7];
    template.notes = data[9] || '';
    if (data[1]) {
      template.logo = JSON.parse(data[1]).brand.thumbnail;
      template.contexts = JSON.parse(data[1]).containerContexts.join(', ');
    }
    template.views += 1;

    // Increment template views
    await model.updateViews(id, template.views);

    // Render dataLayer and page
    const dataLayer = {
      page: {
        type: 'custom template page',
        title: name + ' Custom Template'
      },
      template: {
        info: template.info,
        // parameters: JSON.parse(template.parameters),
        // permissions: JSON.parse(template.permissions),
        // code: JSON.parse(template.code),
        notes: template.notes.trim(),
        logo: template.logo
      }
    };
    res.render('template', {
      title: dataLayer.page.title,
      dataLayer: dataLayer,
      template
    });
  } catch(err) {
    next(err);
  }
});

module.exports = router;
