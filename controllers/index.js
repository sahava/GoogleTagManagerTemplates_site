const express = require('express');
const model = require('../models/template-db');
const router = express.Router();
const gtmTplParser = require('../helpers/gtm-custom-template-parser');
const dataLayerHelper = require('../helpers/dataLayer');
const enums = require('../helpers/enum');

router.get('/', async (req, res, next) => {
  try {
    // Fetch templates
    // TODO: Control pagination with const {rows, hasMore} hasMore    
    const {templates} = await model.list(0, 0);    
    // Needs let for filtering
    let parsedTemplates = templates.map(gtmTplParser.parseTemplate);
    const filterOptions = {
        sort: req.query.sort || 'all',
        tagTypes: (req.query.tagTypes || 'all').split(','),
        categories: (req.query.categories || 'all').split(',')
    };
            
    // Filter Templates
    parsedTemplates= parsedTemplates.filter(template => {      
        let showTemplate = false;        
        if (filterOptions.categories.indexOf(template.category)>-1 && filterOptions.tagTypes.indexOf(template.type.toLocaleLowerCase())>-1)
            showTemplate = true;
        else if(filterOptions.categories.indexOf(template.category)>-1 && filterOptions.tagTypes.indexOf("all")>-1)
            showTemplate = true;
        else if(filterOptions.tagTypes.indexOf(template.type.toLocaleLowerCase())>-1 && filterOptions.categories.indexOf("all")>-1)
            showTemplate = true;
        if(showTemplate===true) return template;
       },filterOptions       
    );

    // Sort Templates
    parsedTemplates= parsedTemplates.sort((a, b) => {            
        switch(filterOptions.sort) {                   
            case "views":
                return b.views - a.views;                                 
            case "downloads":
                return b.downloads - a.downloads; 
            case "oldest":
                return a.added_date - b.added_date; 
            case "newest":
                return b.added_date - a.added_date; 
          default:
            break;
        }
    },filterOptions);
      
    // Render dataLayer and page
    // Build DataLayer    
    dataLayerHelper.mergeDataLayer({
      page: {
        type: 'home page',
        title: 'Home - GTM Templates',
        filters: {
            sort:  filterOptions.sort, 
            tagTypes:  filterOptions.tagTypes,
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
      categories: enums.categories
    });

  } catch(err) {
    next(err);
  }
});

module.exports = router;