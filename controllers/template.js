    const express = require('express');
const model = require('../models/template-db');
const createError = require('http-errors');
const router = express.Router();
const gtmTplParser = require('../helpers/gtm-custom-template-parser');
const enums = require('../helpers/enum');
const dataLayerHelper = require('../helpers/dataLayer');

router.get('/:id/:name?', async (req, res, next) => {
  try {
    const id = req.params.id;
    // If invalid ID, throw 404
    if (isNaN(parseInt(id, 10))) {
      next(createError(404, 'Invalid template ID!'));
      return;
    }

    // Fetch item that matches ID
    const [template] = await model.read(id);

    // If no such item exists
    if (!template) {
      next(createError(404, 'Template doesn\'t exist!'));
      return;
    }

    // Compile template object
    const parsed_tpl = gtmTplParser.parseTemplate(JSON.parse(JSON.stringify(template)));

    // Increment template views
    template.views += 1;
    await model.update(id, template);

    // Build DataLayer
    dataLayerHelper.mergeDataLayer({
      page: {
        type: 'custom template page',
        title: parsed_tpl.displayName + ' Custom Template'
      },
      template: template
    });
    dataLayerHelper.mergeDataLayer(dataLayerHelper.buildEEC('detail',{},[template]));
 
    const dataLayer = dataLayerHelper.get();
    const schema = {
      "@context": "http://schema.org",
      "@type": "Product",        
      "aggregateRating": {
        "@type": "AggregateRating",
        "bestRating": "100",
        "ratingCount": "24",
        "ratingValue": "87"
      },
      "image": "/img",
      "name": template.name,
      "category": template.category,
      "model": template.type,
      "sku": template.id,
      "mpn": template.id,
      "description": template.description || 'N/A',    
      "brand": "Google Tag Manager",        
      "offers": {}
    };
    res.render('template', {
      title: dataLayer.page.title,
      dataLayer: dataLayer,
      categories_list: enums.categories,
      template: parsed_tpl,
      permissions: enums.permissions,
      permissions_icons: enums.permissions_icons,
      downloadUrl: `/api/template/tpl/${id}`,
      user: req.user,
      schema: schema
    });

  } catch(err) {
     next(err);
  }
});

module.exports = router;
