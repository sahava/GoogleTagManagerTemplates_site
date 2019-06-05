const express = require('express');
const model = require('../models/template-db');
const createError = require('http-errors');
const router = express.Router();
const {categories} = require('../helpers/datastore-schema');

router.get('/', async (req, res) => {
  const dataLayer = {
    page: {
      type: 'categories listing page',
      title: 'Categories - GTMs Templates'
    },
    categories: categories
  };

  res.render('categories', {
    title: dataLayer.page.title,
    dataLayer: dataLayer,
    categories: categories
  });
});

router.get('/:category/', async (req, res, next) => {
  try {
    const category = req.params.category;
    // Grab All Templates
    const result = await model.listByCategory(category);
    // If no such item exists
    if (result.length === 0) {
      next(createError(404));
      return;
    }
    // Compile categories object
    const templates = result;
    // Render dataLayer and page
    const dataLayer = {
      page: {
        type: 'templates listing page',
        title: 'Templates by Category: ' + category +' GTMs Templates',
        category: category
      },
      templates: templates
    };
    res.render('category', {
      title: dataLayer.page.title,
      dataLayer: dataLayer,
      templates: templates,
      category: category
    });
  } catch(err) {
    next(err);
  }
});

module.exports = router;
