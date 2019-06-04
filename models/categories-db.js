const {dbToPromise} = require('../helpers/database-helper');

// List all categories
const list = () => {
  return dbToPromise('all', `SELECT * FROM categories`, []);
};

// Get templated via cateogry
const getTemplatesByCategoryId = id => {
  return dbToPromise('all', `SELECT * FROM templates WHERE category="${id}"`, []);
};


module.exports = {
  list,
  getTemplatesByCategoryId
};
