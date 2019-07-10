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

module.exports = router;
