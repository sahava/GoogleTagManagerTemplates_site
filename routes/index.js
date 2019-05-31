const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => res.render('index', { title: 'Express' }));

router.get('/about', (req, res, next) => res.render('about', { title: 'about' }));

router.get('/category', (req, res, next) => res.render('category', { title: 'category' }));

router.get('/template/:id/:name', (req, res, next) => {
        if(err) throw err;
        const id = req.params.id,
            name = req.params.name;
        res.render('template', { title: name + ' Custom Template'});
});

router.get('/search', (req, res, next) => res.render('search', { title: 'search' }));

module.exports = router;
