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
    const filterOptions = {
      sort: (req.query.sort) ? req.query.sort.split(',') : ['views'],
      templateTypes: (req.query.templateTypes) ? req.query.templateTypes.split(',') : ['all'],
      categories: (req.query.categories) ? req.query.categories.split(',') : ['all']
    };
    
    // Sanitizing refining values
    // Template Types
    filterOptions.templateTypes.forEach((e,i) => {
        if(Object.keys(enums.allowedFilterValues.templateTypes).indexOf(e)===-1) filterOptions.templateTypes.splice(i,1);
    });
      
    // User may remove the filter value manually and key will still exist, set default value
    if(filterOptions.templateTypes.length===0) filterOptions.templateTypes = ['all'];

    // Sort Types
    filterOptions.sort.forEach((e,i) =>{
        if(Object.keys(enums.allowedFilterValues.sort).indexOf(e)===-1) filterOptions.sort.splice(i,1);
    });
    // User may remove the filter value manually and key will still exist, set default value
    if(filterOptions.sort.length===0) filterOptions.sort = ['views'];

    // Categories
    filterOptions.categories.forEach((e,i) => {
        if(Object.keys(enums.allowedFilterValues.categories).indexOf(e)===-1) filterOptions.categories.splice(i,1);
    });
    // User may remove the filter value manually and key will still exist, set default value
    if(filterOptions.categories.length===0) filterOptions.categories = ['all'];      
    
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
