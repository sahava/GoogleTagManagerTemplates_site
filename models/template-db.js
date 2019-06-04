const {dbToPromise} = require('../helpers/database-helper');

// List all templates
const list = () => {
  return dbToPromise('all', `SELECT * FROM templates`, []);
};

// Get template with ID
const read = id => {
  return dbToPromise('all', `SELECT * FROM templates WHERE id="${id}"`, []);
};

// Update template with new view count
const updateViews = (id, views) => {
  return dbToPromise('run', 'UPDATE templates SET views=? WHERE id=?', [views, id]);
};

module.exports = {
  list,
  read,
  updateViews
};
