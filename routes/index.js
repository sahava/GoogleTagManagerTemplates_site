const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
           const sqlite3 = require('sqlite3').verbose();
           let db = new sqlite3.Database('./db/templates.db', (err) => {
                if (err) {
                    console.error(err.message);
                }
                console.log('Connected to the database.');
           });  
             db.all(`SELECT * FROM templates`, [], (err, rows) => {
              if (err) {
                throw err;
              }
             let dataLayer = {
                 page: { type: 'home page' }
             };                 
             res.render('index', { title: 'Express', dataLayer: dataLayer, 'templates' : rows});
            
            });    
});           
           
router.get('/about', (req, res, next) => res.render('about', { title: 'about' }));

router.get('/category', (req, res, next) => res.render('category', { title: 'category' }));

router.get('/template/:id/:name', (req, res, next) => {
            const id = req.params.id,
                name = req.params.name;
               const sqlite3 = require('sqlite3').verbose();
               let db = new sqlite3.Database('./db/templates.db', (err) => {
                    if (err) {
                        console.error(err.message);
                    }
                    console.log('Connected to the database.');
               });  


        
   
             db.all(`SELECT * FROM templates WHERE id="${id}"`, [], (err, rows) => {
              if (err) {
                throw err;
              }
              let template = rows[0];
              let data = rows[0].json.split(/___(.+)___/);
              data.shift();              
              template.info = data[1];
              template.parameters = data[3];
              template.permissions = data[5];   
              template.code = data[7];  
              template.notes = data[9];  
              template.logo = JSON.parse(data[1]).brand.thumbnail;
              template.views = rows[0].views+1; 
              template.downloads = rows[0].downloads; 
              db.run('UPDATE templates SET views=? WHERE id=?', [rows[0].views+1,id], function(err){
              });        
              let dataLayer = {
                  page: { type: 'custom template page' },
                  template: {
                      info: JSON.parse(template.info),
                      // parameters: JSON.parse(template.parameters),
                      // permissions: JSON.parse(template.permissions),
                      // code: JSON.parse(template.code),
                      notes: template.notes.trim(),
                      logo: template.logo,
                  } 
              };                        
              res.render('template', { title: name + ' Custom Template', dataLayer: dataLayer, 'template' : rows[0]});           
            }); 
    
        
});

router.get('/search', (req, res, next) => res.render('search', { title: 'search' }));

module.exports = router;
