const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
           const sqlite3 = require('sqlite3').verbose();
           let db = new sqlite3.Database('./db/templates.db', () => {
           //     console.error('Can\'t open database',err);
           });  
             db.all(`SELECT * FROM templates`, [], (err, rows) => {
              if (err) {
                throw err;
              }
             let dataLayer = {
                 page: { type: 'home page',title: 'Home - GTM Templates' }
             };                 
             res.render('index', { title: dataLayer.page.title, dataLayer: dataLayer, 'templates' : rows});            
            });    
});   

router.get('/about', (req, res) => {
    let dataLayer = {
        page: { type: 'about page', title: 'About - GTM Templates' }
    };  
    res.render('about', { title: dataLayer.page.title, dataLayer: dataLayer });  
});

router.get('/contact', (req, res) => {
    let dataLayer = {
        page: { type: 'contact page', title: 'Contact - GTM Templates' }
    };      
    res.render('contact', { title: dataLayer.page.title, dataLayer: dataLayer });   
});

router.get('/categories', (req, res) => {
    let dataLayer = {
        page: { type: 'categories listing page',title: 'Categories - GTM Templates'  }
    };       
    res.render('categories', { title: dataLayer.page.title, dataLayer: dataLayer  });
});    

           
router.get('/template/:id/:name', (req, res) => {
            const id = req.params.id,
                name = req.params.name;
               const sqlite3 = require('sqlite3').verbose();
               let db = new sqlite3.Database('./db/templates.db', (err) => {
                    if (err) {
                        // console.error(err.message);
                    }
                    // console.log('Connected to the database.');
               });  


        
   
             db.all(`SELECT * FROM templates WHERE id="${id}"`, [], (err, rows) => {
              if (err) {
                throw err;
              }
              let template = {};
              if(rows){
                  template = rows[0];
                  let data = rows[0].json.split(/___(.+)___/);
                  data.shift();              
                  template.info = data[1] || {};
                  template.parameters = data[3];
                  template.permissions = data[5];   
                  template.code = data[7];  
                  template.notes = data[9] || '';  
                  if(data[1]){
                    template.logo = JSON.parse(data[1]).brand.thumbnail;                      
                    template.contexts = JSON.parse(data[1]).containerContexts.join(', ');                       
                  } 
                  template.views = rows[0].views+1; 
                  template.downloads = rows[0].downloads; 
                     
              }
              db.run('UPDATE templates SET views=? WHERE id=?', [template.views,id]);        
              let dataLayer = {
                  page: { type: 'custom template page', title: name + ' Custom Template' },
                  template: {
                      info: template.info,
                      // parameters: JSON.parse(template.parameters),
                      // permissions: JSON.parse(template.permissions),
                      // code: JSON.parse(template.code),
                      notes: template.notes.trim(),
                      logo: template.logo,
                  } 
              };                        
              res.render('template', { title: dataLayer.page.title, dataLayer: dataLayer, 'template' : rows[0]});     
            }); 
    
        
});

router.get('/search', (req, res) => {
    let dataLayer = {
        page: { type: 'search results page', title: 'Search - GTM Templates' }
    };      
    res.render('search', { title: dataLayer.page.title, dataLayer: dataLayer })   
});

module.exports = router;