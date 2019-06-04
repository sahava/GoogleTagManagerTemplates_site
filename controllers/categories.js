const express = require('express');
const model = require('../models/categories-db');
const createError = require('http-errors');
const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    // Grab All Categories
    const result = await model.list();

    // If no such item exists
    if (result.length === 0) {
      next(createError(404));
      return;
    }
      
    // Compile categories object
    const categories = result;
    // Render dataLayer and page
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
  } catch(err) {
    next(err);
  }
});

router.get('/:id/:slug', async (req, res, next) => {
  try {      
    const id = req.params.id;
    const slug = req.params.slug;
    // Grab All Templates
    const result = await model.getTemplatesByCategoryId(id);
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
        title: 'Templates by Category: ' + slug +' GTMs Templates',
        category: slug
      },
      templates: templates
    };
    
    res.render('category', {
      title: dataLayer.page.title,
      dataLayer: dataLayer,
      templates: templates,
      category: slug
    });
  } catch(err) {
    next(err);
  }
});

module.exports = router;
