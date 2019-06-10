const express = require('express');
const model = require('../models/template-db');
const createError = require('http-errors');
const router = express.Router();
// const url = require('url');

router.get('/tpl/:id', async (req, res, next) => {
  try {
    const allowed_referrers = ["localhost","gtm-templates-com.appspot.com","www.gtmtemplates.com","gtmtemplates.com"];
        
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

    // Check no referrer
    if(!req.headers.referer){        
        res.writeHead(302, {
          'Location': '/template/'+template.id+'/'+template.slug
        });     
        res.end();  
    }      
    // Check no-allowed-referrer
    const referer_hostname= new URL(req.headers.referer).hostname;      
    if(allowed_referrers.indexOf(referer_hostname)===-1){           
        res.writeHead(302, {
          'Location': '/template/'+template.id+'/'+template.slug
        });     
        res.end();  
    }   
      
    // Increment template downloads
    template.downloads += 1;
    await model.update(id, template);
      
    res.setHeader('Content-Type', 'application/json');
    res.set('Content-Disposition', `attachment;filename=${template.slug}.tpl`);
    res.end(template.json);

  } catch(err) {
     next(err);
  }
});

module.exports = router;
