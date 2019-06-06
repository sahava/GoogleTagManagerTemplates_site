const express = require('express');
const model = require('../models/template-db');
const createError = require('http-errors');
const router = express.Router();
const gtmTplParser = require('../helpers/gtm-custom-template-parser');
const enums = require('../helpers/enum');

router.get('/', (req, res) => {

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
    categories: enums.categories
  });
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
    const dataLayer = {
      event: 'datalayer-initialized',
      page: {
        type: 'templates listing page',
        title: 'Category: ' + enums.categories[categorySlug] +' - GTM Templates',
        category: categorySlug,
        count: parsedTemplates.length
      },
      templates: parsedTemplates
    };
    res.render('category', {
      title: dataLayer.page.title,
      dataLayer: dataLayer,
      templates: parsedTemplates,
      category: enums.categories[categorySlug],
      count: parsedTemplates.length
    });
  } catch(err) {
    next(err);
  }
});

module.exports = router;
