const express = require('express');
const router = express.Router();
const dataLayerHelper = require('../helpers/dataLayer');
const {categories} = require('../helpers/enum');
const adminUid = ['Sov88pGOKFghLeVxdhMgswityPs2'];

const checkAdminUid = (req, res, next) => {
  if (!req.user || (req.user && adminUid.indexOf(req.user.uid) === -1)) {
    res.redirect(301, '/');
  } else {
    next();
  }
};

router.get('/', checkAdminUid, (req, res) => {
  res.redirect(301, '/admin/create');
});

router.get('/create', checkAdminUid, (req, res) => {
  const successIds = req.query.success;

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
    user: req.user,
    categories,
    success: successIds ? successIds.split(',') : undefined
  });
});


module.exports = router;
