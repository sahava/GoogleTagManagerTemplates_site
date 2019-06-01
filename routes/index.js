const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => res.render('index', { title: 'Express' }));

router.get('/about', (req, res) => res.render('about', { title: 'about' }));

router.get('/category', (req, res) => res.render('category', { title: 'category' }));

router.get('/template/:id/:name', (req, res) => {
  const name = req.params.name;
  res.render('template', { title: name + ' Custom Template'});
});

router.get('/search', (req, res) => res.render('search', { title: 'search' }));

module.exports = router;
