// NodeJS - GTM DataLayer Helper for GTM Templates
// Will help on having a standard core dataLayer values in all pages
// David Vallejo

let model= {
  'event': 'datalayer-initialized'
};

const mergeDataLayer = push => {
  model = {...model, ...push};
};

const buildEEC = (action, actionField, products) => {
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
        productsImpressions: mapProducts(products)
      };
  }
  return {ecommerce: ecommerce};
};

const mapProducts = (templates, listName) => {
  return templates.map((tpl, index) => ({
    id: tpl.id || undefined,
    name: tpl.name.toLowerCase() || undefined,
    brand: (tpl.brand) ? tpl.brand.toLowerCase() : undefined,
    category: (tpl.category) ? [tpl.type.toLowerCase(),tpl.category.toLowerCase()].join('/') : undefined,
    variant: (tpl.type) ? tpl.type.toLowerCase() : undefined,
    list: (tpl.listName) ? tpl.listName.toLowerCase() : undefined,
    position: (listName) ? index.toString() : undefined,
    views: (tpl.views) ? tpl.views.toString().toLowerCase() : undefined,
    downloads: (tpl.downloads) ? tpl.downloads.toString().toLowerCase() : undefined,
    added_date: tpl.parsed_added_date || undefined,
    updated_date: tpl.parsed_updated_date || undefined,
    author: (tpl.author) ? tpl.author.toLowerCase() : undefined,
    license: (tpl.license) ? tpl.license.toLowerCase() : undefined,
  }));
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
