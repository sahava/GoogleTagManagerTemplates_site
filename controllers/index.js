const express = require('express');
const model = require('../models/template-db');
const router = express.Router();
const gtmTplParser = require('../helpers/gtm-custom-template-parser');
const dataLayerHelper = require('../helpers/dataLayer');
const enums = require('../helpers/enum');

router.get('/', async (req, res, next) => {
  try {
    // Fetch templates
    const {templates} = await model.list(0, 0);
    const filterOptions = {
      sort: req.query.sort || 'all',
      templateTypes: (req.query.templateTypes || 'all').split(','),
      categories: (req.query.categories || 'all').split(',')
    };

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
          sort:  filterOptions.sort,
          templateTypes:  filterOptions.templateTypes,
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
