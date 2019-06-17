const {categories} = require('../helpers/enum');

const templateSchema = {
  name: 'string',
  author: 'string',
  author_url : 'string',
  author_slug : 'string',
  type: 'string',
  category: categories,
  license: 'string',
  json: 'string',
  slug: 'string',
  added_date: 'date',
  updated_date: 'date',
  downloads: 'number',
  installs: 'number',
  views: 'number',
  vendor_url : 'string',
  landing_url : 'string',
  git_url : 'string'
};

const checkEqual = (obj1, obj2) => JSON.stringify(Object.keys(obj1).sort()) === JSON.stringify(Object.keys(obj2).sort());

// Check that the object passed to this function conforms to the schema listed above
const toSchema = obj => {
  const result = {};
  Object.keys(obj).forEach(key => {
    if (!templateSchema.hasOwnProperty(key)) return;
    // Check date properties
    if (templateSchema[key] === 'date' && typeof obj[key].getMonth === 'function') {
      result[key] = obj[key];
    // Check against enum
    } else if (typeof templateSchema[key].hasOwnProperty === 'function' && templateSchema[key].hasOwnProperty(obj[key])) {
      result[key] = obj[key];
    // Check against primitives (e.g. string, number)
    } else if (typeof obj[key] === templateSchema[key]) {
      result[key] = obj[key];
    }
  });
  return checkEqual(templateSchema, result) ? result : {
    error: {
      delta: Object.keys(templateSchema).filter(x => !Object.keys(result).includes(x))
    }
  };
};

module.exports = {
  toSchema
};
