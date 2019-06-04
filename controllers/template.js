const express = require('express');
const model = require('../models/template-db');
const createError = require('http-errors');
const router = express.Router();
const gtmTplParser = require('../helpers/gtm-custom-template-parser');
                       
router.get('/:id/:name', async (req, res, next) => {
  try {
    const id = req.params.id,
        name = req.params.name;

    // Fetch item that matches ID
    const result = await model.read(id);

    // If no such item exists
    if (result.length === 0) {
      next(createError(404));
      return;
    }

    // Compile template object
    const template = result[0];
    const parsed_tpl = gtmTplParser.parseTemplate(template.json,"json");
     
    if (parsed_tpl) {
      template.logo = parsed_tpl.info.brand.thumbnail;
      template.contexts = parsed_tpl.info.containerContexts.join(', ');
      template.displayName = parsed_tpl.info.displayName;
      template.description = parsed_tpl.info.description;
      template.type = parsed_tpl.info.type;
      template.permissions = parsed_tpl.permissions;
    }
    
      
    template.views += 1;

    // Increment template views
    await model.updateViews(id, template.views);

    // Render dataLayer and page
    const dataLayer = {
      event: 'datalayer-initialized',
      page: {
        type: 'custom template page',
        title: name + ' Custom Template'
      },
      template: parsed_tpl
    };  
 
    res.render('template', {
        title: dataLayer.page.title,
        dataLayer: dataLayer,
        template
    });
 
  } catch(err) {
    next(err);
  }
});

module.exports = router;
