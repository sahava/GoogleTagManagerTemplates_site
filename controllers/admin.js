const express = require('express');
const router = express.Router();
const dataLayerHelper = require('../helpers/dataLayer');
const {categories} = require('../helpers/enum');
const createError = require('http-errors');
const model = require('../models/template-db');

const checkAdmin = (req, res, next) => {
  // Disable caching for admin
  res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.header('Pragma', 'no-cache');
  res.header('Expires', 0);
  if (!req.user || req.user.admin !== true) {
    res.redirect(301, '/');
  } else {
    next();
  }
};

router.get('/', checkAdmin, (req, res) => {
  res.redirect(301, '/admin/create');
});

router.get('/create', checkAdmin, (req, res) => {
  const successIds = req.query.success;

  dataLayerHelper.mergeDataLayer({
    page: {
      type: 'admin',
      title: 'Admin / Create - GTM Templates'
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

router.get('/update/:id', checkAdmin, async (req, res, next) => {
  try {
    const successId = req.query.success;
    const id = req.params.id;

    // If invalid ID, throw 404
    if (isNaN(parseInt(id, 10))) {
      next(createError(404, 'Invalid template ID!'));
      return;
    }

    let template = null;

    if (!successId) {
      // Fetch item that matches ID
      [template] = await model.read(id);

      // If no such item exists
      if (!template) {
        next(createError(404, 'Template doesn\'t exist!'));
        return;
      }
    }

    dataLayerHelper.mergeDataLayer({
      page: {
        type: 'admin',
        title: 'Admin / Update - GTM Templates'
      }
    });

    res.render('admin', {
      title: dataLayerHelper.get().page.title,
      dataLayer: dataLayerHelper.get(),
      category: 'admin',
      user: req.user,
      categories,
      tpl: template || {},
      success: successId ? [successId] : undefined
    });

  } catch(err) {
    next(err);
  }
});

module.exports = router;
