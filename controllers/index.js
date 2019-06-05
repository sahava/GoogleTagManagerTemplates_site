const express = require('express');
const model = require('../models/template-db');
const router = express.Router();
const gtmTplParser = require('../helpers/gtm-custom-template-parser');


/* GET home page. */
router.get('/', async (req, res, next) => {
  try {

    // Fetch templates
    // TODO: Control pagination with const {rows, hasMore} hasMore
    const {rows} = await model.list(9, 0);

    // Render dataLayer and page
    const dataLayer = {
      event: 'datalayer-initialized',
      page: {type: 'home page', title: 'Home - GTM Templates'}
    };
    const parsed_tpl = gtmTplParser.parseTemplate(rows[0].json, "json");

/*    if (parsed_tpl) {
      template.logo = parsed_tpl.info.brand.thumbnail;
      template.contexts = parsed_tpl.info.containerContexts.join(', ');
      template.displayName = parsed_tpl.info.displayName;
      template.description = parsed_tpl.info.description;
      template.type = parsed_tpl.info.type;
      template.permissions = parsed_tpl.permissions;
    }
    */
    rows.forEach(function(e){
          const parsed_tpl = gtmTplParser.parseTemplate(rows[0].json, "json");
          e.logo = parsed_tpl.info.brand.thumbnail
    });  
    //console.log(parsed_tpl);      
    res.render('index', {
      title: dataLayer.page.title,
      dataLayer: dataLayer,
      templates: rows
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
