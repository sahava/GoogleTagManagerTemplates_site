const express = require('express');
const model = require('../models/template-db');
const router = express.Router();
const enums = require('../helpers/enum');

const xmlbuilder = require('xmlbuilder');
router.get('/', async (req, res, next) => {
  try {
    const feedType = 'atom';
    if(feedType==='atom'){
      const {templates} = await model.list(0, null);      
      const entries = templates.map(function(tpl){
        const entryModel = {
          'title': `${tpl.name}`,
          'id': `tpl:gtmtemplates.com,${tpl.id}`,
          'updated': `${new Date(tpl.updated_date).toISOString()}`,
          'published': `${new Date(tpl.added_date).toISOString()}`,
          'link' : `https://www.gtmtemplates.com/template/${tpl.id}/${tpl.slug}`,
          'author': {
            'name': `${tpl.author}`
          }
        };        
        return entryModel;
      });
      const feedObj = { 
        'feed': {
          '@xmlns': `http://www.w3.org/2005/Atom`,
          'title': { '@type': 'text', '#text': 'GTMTemplates - Updates Feed' },
          'subtitle': { '@type': 'html', '#text': 'Feed for latest updated/added templates' },
          'updated': `${new Date().toISOString()}`,
          'rights': `Copyright (c) {${new Date("Y")}, Simo Ahava`,
          'id': `tpls:gtmtemplates.com`,
          'entry': [entries]
        }
      };
      const feed = xmlbuilder.create(feedObj, { encoding: 'utf-8' });
      const xml = feed.end({ pretty: true });
      // Set Proper Content Type
      res.set('Content-Type', 'application/atom+xml');
      res.status(200).send(xml);    
    }
  } catch(err) {
     next(err);
  }
});

module.exports = router;
