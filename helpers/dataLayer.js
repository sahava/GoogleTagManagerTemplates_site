// NodeJS - GTM DataLayer Helper for GTM Templates
// Will help on having a standard core dataLayer values in all pages
// David Vallejo
const _ = require('lodash');

let model= {
  'event': 'datalayer-initialized'
};

const mergeDataLayer = push => {
  model = {...model, ...push};
};

const normalize = tpl => {
  for (let prop in tpl) {
    if (tpl.hasOwnProperty(prop)) {
      tpl[prop] = tpl[prop].toString().toLowerCase()
    }
  }
  return tpl;
};

const buildEEC = (action, actionField, products, listName) => {
  const ecommerce = {};
  switch (action) {
    case 'detail':
      ecommerce[action] = {
        actionField: actionField || {},
        products: mapProducts(products)
      };
      break;
    case 'impressions':
      return {
        productsImpressions: mapProducts(products, listName)
      };
  }
  return {ecommerce: ecommerce};
};

const mapProducts = (templates, listName) => {
  return _.cloneDeep(templates).map((tpl, index) => {
    const ntpl = normalize(tpl);
    return {
      id: ntpl.id,
      name: ntpl.name,
      brand: ntpl.brand,
      category: ntpl.category ? [ntpl.type, ntpl.category].join('/') : undefined,
      variant: ntpl.type,
      list: listName ? listName.toLowerCase() : undefined,
      position: listName ? index.toString() : undefined,
      views: tpl.views,
      downloads: tpl.downloads,
      added_date: tpl.parsed_added_date,
      updated_date: tpl.parsed_updated_date,
      author: tpl.author,
      license: tpl.license
    };
  });
};

const get = () => {

  // Bypass caching . Tricky, I know, it works
  const _model = JSON.parse(JSON.stringify(model));
  model = {
    'event': 'datalayer-initialized'
  };
  return _model;
};

module.exports = {
  get,
  mergeDataLayer,
  buildEEC
};
