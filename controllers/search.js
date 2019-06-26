const express = require('express');
const model = require('../models/template-db');
const router = express.Router();
const enums = require('../helpers/enum');
const gtmTplParser = require('../helpers/gtm-custom-template-parser');
const dataLayerHelper = require('../helpers/dataLayer');

router.get('/', async (req, res, next) => {
  try {
    const query = req.query.query ? escape(req.query.query) : 'all';
    // Fetch templates
    const {templates} = await model.list(0, null);
    const filterOptions = gtmTplParser.sanitize({
      sort: req.query.sort ? req.query.sort.split(',') : ['views'],
      templateTypes: req.query.templateTypes ? req.query.templateTypes.split(',') : ['all'],
      categories: req.query.categories ? req.query.categories.split(',') : ['all'],
      query: [query]
    });
    const parsedTemplates = gtmTplParser.filterAndSort(
      templates.map(gtmTplParser.parseTemplate),
      filterOptions
    );

    // Render dataLayer and page
    // Build DataLayer
    dataLayerHelper.mergeDataLayer({
      page: {
        type: 'search results page',
        title: 'Search - GTM Templates',
        query: query,
        count: parsedTemplates.length,
        filters: filterOptions,
        qs: Object.keys(filterOptions).map(key => key + '=' + filterOptions[key]).join('&')   
      }
    });
    dataLayerHelper.mergeDataLayer(dataLayerHelper.buildEEC('impressions',{list: 'home page'}, parsedTemplates));
      
    const dataLayer = dataLayerHelper.get();      
    res.render('search', {
      title: dataLayer.page.title,
      dataLayer: dataLayer,
      categories: enums.categories,
      templates: parsedTemplates,
      count: parsedTemplates.length,
      query: query,
      user: req.user,
      filters: dataLayer.page.filters,
      qs: dataLayer.page.qs,
      allowedFilterValues: enums.allowedFilterValues               
    });
  
  } catch(err) {
    next(err);
  }
});
module.exports = router;
