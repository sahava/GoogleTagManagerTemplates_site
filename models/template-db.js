const {Datastore} = require('@google-cloud/datastore');
const {toSchema} = require('../helpers/datastore-schema');
const createError = require('http-errors');
const modelHelper = require('../helpers/model');

// Config
const ds = new Datastore();
const kind = process.env.NODE_ENV === 'production' ? 'Template' : 'Template_dev';
const doNotIndex = ['json','slug'];

// Append ID from datastore object to application object
const fromDatastore = obj => {
  obj.id = obj[Datastore.KEY].id;
  return obj;
};

// Translates application object to datastore object
const toDatastore = (obj, nonIndexed) => {
  nonIndexed = nonIndexed || [];
  const results = [];
  Object.keys(obj).forEach(k => {
    if (obj[k] === undefined) {
      return;
    }
    results.push({
      name: k,
      value: obj[k],
      excludeFromIndexes: nonIndexed.indexOf(k) > -1
    });
  });
  return results;
};

// List all templates
const list = async (limit, token) => {
  const q = ds
    .createQuery([kind])
    .limit(limit)
    .order('name')
    .start(token);

  const [rows, nextQuery] = await ds.runQuery(q);
  return {
    templates: rows.map(fromDatastore),
    hasMore: nextQuery.moreResults !== Datastore.NO_MORE_RESULTS
      ? nextQuery.endCursor
      : false
  };
};

// List templates by category
const listByCategory = async category => {
  const stored = await modelHelper.getMemcache(`category_${category}`);

  // If in memcache, use it
  if (stored.value) {
    return JSON.parse(stored.value);
  }
  
  // Otherwise do the query
  const q = ds
    .createQuery([kind])
    .filter('category', '=', category)
    .order('views', {
      descending: true
    });

  let [rows] = await ds.runQuery(q);
  rows = rows.map(fromDatastore);

  // Write to memcache
  await modelHelper.setMemcache(`category_${category}`, JSON.stringify(rows));

  return rows;
};

// Get only categories
const listOnlyCategories = async () => {
  const q = ds
    .createQuery([kind])
    .select(['category']);

  const [rows] = await ds.runQuery(q);
  return rows
};

// Get template with ID
const read = async id => {
  const key = ds.key([kind, parseInt(id, 10)])
  const result = await ds.get(key) || [];
  return result.filter(obj => obj).map(fromDatastore);
};

// Delete template with ID
const _delete = async id => {
  const key = ds.key([kind, parseInt(id, 10)]);
  return await ds.delete(key);
};

// Update template
const update = async (id, data) => {
  // Only update if the data object is complete and matches the defined schema
  const updateData = toSchema(data);
  if (!updateData) {
    throw createError(500, 'Incorrect data schema');
  }

  let key;
  if (id) {
    key = ds.key([kind, parseInt(id, 10)]);
  } else {
    key = ds.key([kind]);
  }
  const entity = {
    key,
    data: toDatastore(updateData, doNotIndex)
  };
  return await ds.save(entity);
};

// Create new template
const create = data => {
  return update(null, data);
};

module.exports = {
  list,
  listByCategory,
  listOnlyCategories,
  read,
  create,
  update,
  delete: _delete
};
