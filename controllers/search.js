const express = require('express');
const model = require('../models/template-db');
const router = express.Router();
const enums = require('../helpers/enum');
const gtmTplParser = require('../helpers/gtm-custom-template-parser');
const dataLayerHelper = require('../helpers/dataLayer');
const axios = require('axios');

router.get('/', async (req, res, next) => {
  try {
    const query = req.query.query || '';
    let resp = {};
    // Do query
    if (query) {
      resp = await axios.get(`https://search-dot-gtm-templates-com.appspot.com/?q=${escape(query)}`, {
        headers: {
          'X-Incoming-AppId': process.env.NODE_ENV === 'production' ? 'gtm-templates-com' : 'localhost'
        }
      });
    }

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
      filterOptions,
      resp.data ? resp.data.results : undefined
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
        qs: Object.keys(filterOptions).filter(key => key !== 'queryResults').map(key => key + '=' + filterOptions[key]).join('&')
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
