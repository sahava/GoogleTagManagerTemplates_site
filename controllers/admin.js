const express = require('express');
const router = express.Router();
const dataLayerHelper = require('../helpers/dataLayer');
const adminUid = ['Sov88pGOKFghLeVxdhMgswityPs2'];

router.get('/', (req, res) => {
  if (!req.user || (req.user && adminUid.indexOf(req.user.uid) === -1)) {
    res.redirect(301, '/');
  }
  dataLayerHelper.mergeDataLayer({
    page: {
      type: 'admin',
      title: 'Admin - GTM Templates'
    }
  });

  res.render('admin', {
    title: dataLayerHelper.get().page.title,
    dataLayer: dataLayerHelper.get(),
    category: 'admin',
    user: req.user
  });
});

module.exports = router;
