const express = require('express');
const model = require('../models/template-db');
const router = express.Router();
const gtmTplParser = require('../helpers/gtm-custom-template-parser');
const dataLayerHelper = require('../helpers/dataLayer');

router.get('/', async (req, res, next) => {
  try {

    // Fetch templates
    // TODO: Control pagination with const {rows, hasMore} hasMore
    const {templates} = await model.list(9, 0);      
    const parsedTemplates = templates.map(gtmTplParser.parseTemplate);
    // Render dataLayer and page
    // Build DataLayer
    dataLayerHelper.mergeDataLayer({
        page: {
          type: 'home page',
          title: 'Home - GTM Templates'
      }
    });      
    dataLayerHelper.mergeDataLayer(dataLayerHelper.buildEEC('impressions',{list: 'home page'},templates));             
    res.render('index', {
      title: dataLayerHelper.get().page.title,
      dataLayer: dataLayerHelper.get(),
      templates: parsedTemplates,
      category: 'home page'
    });

  } catch(err) {
    next(err);
  }
});

module.exports = router;