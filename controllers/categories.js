const express = require('express');
const model = require('../models/template-db');
const createError = require('http-errors');
const router = express.Router();
const gtmTplParser = require('../helpers/gtm-custom-template-parser');
const dataLayerHelper = require('../helpers/dataLayer');
const enums = require('../helpers/enum');

router.get('/', async (req, res, next) => {
  try {
    const listCategories = await model.listOnlyCategories();
    const categoryCounts = listCategories.reduce((acc, cur) => {
      acc[cur.category] = acc[cur.category] ? acc[cur.category] + 1 : 1;
      return acc;
    }, {});

    const dataLayer = {
      event: 'datalayer-initialized',
      page: {
        type: 'categories listing page',
        title: 'Categories - GTMs Templates'
      },
      categories: enums.categories
    };

    res.render('categories', {
      title: dataLayer.page.title,
      dataLayer: dataLayer,
      categories: enums.categories,
      categoryCounts,
      category: 'categories'
    });
  } catch(err) {
    next(err);
  }
});

router.get('/:category/', async (req, res, next) => {
  try {
    const categorySlug = req.params.category;

    // If invalid category
    if (!enums.categories[categorySlug]) {
      next(createError(404, 'Category doesn\'t exist!'));
      return;
    }

    // Grab templates by category
    const templates = await model.listByCategory(categorySlug);

    // Parse logo and dates from template JSON
    const parsedTemplates = templates.map(gtmTplParser.parseTemplate);

    // Render dataLayer and page
    // Build DataLayer
    dataLayerHelper.mergeDataLayer({
      page: {
        type: 'templates listing page',
        title: 'Category: ' + enums.categories[categorySlug] + ' - GTM Templates',
        category: categorySlug,
        count: parsedTemplates.length
      }
    });
    dataLayerHelper.mergeDataLayer(dataLayerHelper.buildEEC('impressions',{list: 'plp: ' + categorySlug}, parsedTemplates));

    res.render('category', {
      title: dataLayerHelper.get().page.title,
      dataLayer: dataLayerHelper.get(),
      templates: parsedTemplates,
      category: enums.categories[categorySlug],
      count: parsedTemplates.length
    });
  } catch(err) {
    next(err);
  }
});

module.exports = router;
