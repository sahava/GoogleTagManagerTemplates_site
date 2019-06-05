const categories = ["analytics", "abtests", "pixels"];

const templateSchema = {
  name: 'string',
  author: 'string',
  category: categories,
  json: 'string',
  slug: 'string',
  added_date: 'date',
  updated_date: 'date',
  downloads: 'number',
  views: 'number',
  votes: 'number'
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
    // Check against enums
    } else if (Array.isArray(templateSchema[key]) && templateSchema[key].indexOf(obj[key]) > -1) {
      result[key] = obj[key];
    // Check against primitives (e.g. string, number)
    } else if (typeof obj[key] === templateSchema[key]) {
      result[key] = obj[key];
    }
  });
  return checkEqual(templateSchema, result) ? result : false;
};

module.exports = {
  toSchema,
  categories
};
