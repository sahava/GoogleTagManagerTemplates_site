const express = require('express');
const router = express.Router();
const dataLayerHelper = require('../helpers/dataLayer');

router.get('/', (req, res) => {
  dataLayerHelper.mergeDataLayer({
    page: {
      type: 'about',
      title: 'About - GTM Templates'
    }
  });

  res.render('about', {
    title: dataLayerHelper.get().page.title,
    dataLayer: dataLayerHelper.get(),
    category: 'about',
    user: req.user
  });
});

router.get('/privacy', (req, res) => {
  dataLayerHelper.mergeDataLayer({
    page: {
      type: 'privacy',
      title: 'Privacy Policy and Terms of Service - GTM Templates'
    }
  });

  res.render('privacy', {
    title: dataLayerHelper.get().page.title,
    dataLayer: dataLayerHelper.get(),
    category: 'about',
    user: req.user
  });
});

module.exports = router;
