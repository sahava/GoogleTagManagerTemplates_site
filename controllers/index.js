const express = require('express');
const model = require('../models/template-db');
const router = express.Router();
const gtmTplParser = require('../helpers/gtm-custom-template-parser');
const dataLayerHelper = require('../helpers/dataLayer');
const enums = require('../helpers/enum');

router.get('/', async (req, res, next) => {
  try {
    // Fetch templates
    const {templates} = await model.list(0, null);
    const filterOptions = gtmTplParser.sanitize({
      sort: req.query.sort ? req.query.sort.split(',') : ['views'],
      templateTypes: req.query.templateTypes ? req.query.templateTypes.split(',') : ['all'],
      categories: req.query.categories ? req.query.categories.split(',') : ['all']
    });

    
    const parsedTemplates = gtmTplParser.filterAndSort(
      templates.map(gtmTplParser.parseTemplate),
      filterOptions
    );

    // Render dataLayer and page
    // Build DataLayer
    dataLayerHelper.mergeDataLayer({
      page: {
        type: 'home page',
        title: 'Home - GTM Templates',
        filters: {
          sort: filterOptions.sort,
          templateTypes: filterOptions.templateTypes,
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
      categories: enums.categories,
      allowedFilterValues: enums.allowedFilterValues        
    });

  } catch(err) {
    next(err);
  }
});

module.exports = router;
