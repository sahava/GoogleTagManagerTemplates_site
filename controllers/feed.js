const express = require('express');
//const model = require('../models/template-db');
//const createError = require('http-errors');
const router = express.Router();
/*const gtmTplParser = require('../helpers/gtm-custom-template-parser');
const enums = require('../helpers/enum');
const dataLayerHelper = require('../helpers/dataLayer');
*/
router.get('/atom', async (req, res, next) => {
  try {


    // If no such item exists
    /*if (!template) {
      next(createError(404, 'Template doesn\'t exist!'));
      return;
    }
    */



  } catch(err) {
     next(err);
  }
});

module.exports = router;
