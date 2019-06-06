const express = require('express');
const model = require('../models/template-db');
const router = express.Router();
const gtmTplParser = require('../helpers/gtm-custom-template-parser');
const enums = require('../helpers/enum');


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
    
    rows.forEach(function(e){
          const parsed_tpl = gtmTplParser.parseTemplate(e.json, "json");
          e.was_added_on = new Date(e.added_date).toISOString().split("T")[0];          
          e.logo = parsed_tpl.info.brand.thumbnail;
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

router.get('/search', async (req, res, next) => {
    try {
        // GEt Query 
        const query = req.query.q;
        // Grab templates by category
        // const templates = await model.search();  
        const {rows} = await model.list(9, 0);
        let dataLayer = {
            event: 'datalayer-initialized',
            page: { 
                type: 'search results page', 
                title: 'Search - GTM Templates',
                query: query,
                count: rows.length
            }
        };
        res.render('search', { 
            title: dataLayer.page.title, 
            dataLayer: dataLayer,
            categories: enums.categories,
            templates: rows,
            count: rows.length,
            query: query
        });        
    } catch(err) {
     next(err);
    }

});

module.exports = router;
