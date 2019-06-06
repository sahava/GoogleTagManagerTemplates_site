const express = require('express');
const model = require('../models/template-db');
const router = express.Router();
const gtmTplParser = require('../helpers/gtm-custom-template-parser');

router.get('/', async (req, res, next) => {
  try {

    // Fetch templates
    // TODO: Control pagination with const {rows, hasMore} hasMore
    const {templates} = await model.list(9, 0);

    // Render dataLayer and page
    const dataLayer = {
      event: 'datalayer-initialized',
      page: {type: 'home page', title: 'Home - GTM Templates'}
    };

    const parsedTemplates = templates.map(gtmTplParser.parseTemplate);

    res.render('index', {
      title: dataLayer.page.title,
      dataLayer: dataLayer,
      templates: parsedTemplates
    });

  } catch(err) {
    next(err);
  }
});

module.exports = router;
