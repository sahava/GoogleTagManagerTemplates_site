const express = require('express');
const model = require('../models/template-db');
const router = express.Router();
const enums = require('../helpers/enum');
const gtmTplParser = require('../helpers/gtm-custom-template-parser');

router.get('/', async (req, res, next) => {
  try {
    const query = req.query.q;
    const {templates} = await model.list();
    const parsedTemplates = templates.map(gtmTplParser.parseTemplate);
    const dataLayer = {
      event: 'datalayer-initialized',
      page: {
        type: 'search results page',
        title: 'Search - GTM Templates',
        query: query,
        count: parsedTemplates.length
      }
    };
    res.render('search', {
      title: dataLayer.page.title,
      dataLayer: dataLayer,
      categories: enums.categories,
      templates: parsedTemplates,
      count: parsedTemplates.length,
      query: query
    });
  } catch(err) {
    next(err);
  }
});

module.exports = router;
