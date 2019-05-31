var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/about', function(req, res, next) {
  res.render('about', { title: 'about' });
});

router.get('/category', function(req, res, next) {
  res.render('category', { title: 'category' });
});

router.get('/template/:id/:name', function(req, res, next) {
    var fs = require('fs');
    var template_json;
    fs.readFile('public/templates/yandex_metrica.tpl', 'utf8', function(err, contents) {
        if(err) throw err;
        var id = req.params.id,
            name = req.params.name;    
        res.render('template', { title: name + ' Custom Template'});        
    }); 

});

router.get('/search', function(req, res, next) {
  res.render('search', { title: 'search' });
});

module.exports = router;
