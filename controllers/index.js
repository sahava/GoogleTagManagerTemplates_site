const express = require('express');
const model = require('../models/template-db');
const router = express.Router();


/* GET home page. */
router.get('/', async (req, res, next) => {
  try {

    // Fetch templates
    const rows = await model.list();

    // Render dataLayer and page
    const dataLayer = {
      page: {type: 'home page', title: 'Home - GTM Templates'}
    };
    res.render('index', {
      title: dataLayer.page.title,
      dataLayer: dataLayer,
      templates: rows
    });
  } catch(err) {
    next(err);
  }
});

router.get('/categories', (req, res) => {
    let dataLayer = {
        page: { type: 'categories listing page',title: 'Categories - GTM Templates'  }
    };
    res.render('categories', { title: dataLayer.page.title, dataLayer: dataLayer  });
});

router.get('/search', (req, res) => {
    let dataLayer = {
        page: { type: 'search results page', title: 'Search - GTM Templates' }
    };
    res.render('search', { title: dataLayer.page.title, dataLayer: dataLayer })
});

module.exports = router;
