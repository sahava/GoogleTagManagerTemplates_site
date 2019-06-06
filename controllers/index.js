const express = require('express');
const model = require('../models/template-db');
const router = express.Router();
const gtmTplParser = require('../helpers/gtm-custom-template-parser');


/* GET home page. */
router.get('/', async (req, res, next) => {
  try {

    // Fetch templates
    // TODO: Control pagination with const {rows, hasMore} hasMore
    const {templates} = await model.list(9, 0);

    // Render dataLayer and page
    const dataLayer = {
      event: 'datalayer-initialized',
      page: {type: 'home page', title: 'Home - GTM Templates'}
    };

    const parsedTemplates = templates.map(gtmTplParser.parseTemplate);

    //console.log(parsed_tpl);
    res.render('index', {
      title: dataLayer.page.title,
      dataLayer: dataLayer,
      templates: parsedTemplates
    });

  } catch(err) {
    next(err);
  }
});

router.get('/search', (req, res) => {
    let dataLayer = {
        event: 'datalayer-initialized',
        page: { type: 'search results page', title: 'Search - GTM Templates' }
    };
    res.render('search', { title: dataLayer.page.title, dataLayer: dataLayer })
});

module.exports = router;
