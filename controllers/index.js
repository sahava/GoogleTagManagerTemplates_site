const express = require('express');
const model = require('../models/template-db');
const router = express.Router();
const gtmTplParser = require('../helpers/gtm-custom-template-parser');
const dataLayerHelper = require('../helpers/dataLayer');
const enums = require('../helpers/enum');

router.get('/', async (req, res, next) => {
  try {
    // Fetch templates
    // TODO: Control pagination with const {rows, hasMore} hasMore    
    const {templates} = await model.list(0, 0);
    const parsedTemplates = templates.map(gtmTplParser.parseTemplate);
    const filterOptions = {
        sort: req.query.sort || 'all',
        tagTypes: (req.query.tagTypes || 'all').split(','),
        categories: (req.query.categories || 'all').split(',')
    };

    // Render dataLayer and page
    // Build DataLayer    
    dataLayerHelper.mergeDataLayer({
      page: {
        type: 'home page',
        title: 'Home - GTM Templates',
        filters: {
            sort:  filterOptions.sort, 
            tagTypes:  filterOptions.tagTypes,
            categories: filterOptions.categories
        },
        qs: Object.keys(filterOptions).map(key => key + '=' + filterOptions[key]).join('&')
      }
    });
    dataLayerHelper.mergeDataLayer(dataLayerHelper.buildEEC('impressions',{list: 'home page'}, templates));
    const dataLayer = dataLayerHelper.get();
    res.render('index', {
      title: dataLayer.page.title,
      dataLayer: dataLayer,
      templates: parsedTemplates,
      category: 'home page',
      user: req.user,
      filters: dataLayer.page.filters,
      qs: dataLayer.page.qs,
      categories: enums.categories
    });

  } catch(err) {
    next(err);
  }
});

module.exports = router;
