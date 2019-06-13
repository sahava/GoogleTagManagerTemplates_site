const express = require('express');
const model = require('../models/template-db');
const router = express.Router();
const enums = require('../helpers/enum');
const gtmTplParser = require('../helpers/gtm-custom-template-parser');
const dataLayerHelper = require('../helpers/dataLayer');

router.get('/', async (req, res, next) => {
  try {
    const query = escape(req.query.q);
    const {templates} = await model.list();
    const parsedTemplates = templates.map(gtmTplParser.parseTemplate);

    // Render dataLayer and page
    // Build DataLayer
    dataLayerHelper.mergeDataLayer({
      page: {
        type: 'search results page',
        title: 'Search - GTM Templates',
        query: query,
        count: parsedTemplates.length
      }
    });
    dataLayerHelper.mergeDataLayer(dataLayerHelper.buildEEC('impressions',{list: 'home page'}, parsedTemplates));
    res.render('search', {
      title: dataLayerHelper.get().page.title,
      dataLayer: dataLayerHelper.get(),
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
