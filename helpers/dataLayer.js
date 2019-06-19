// NodeJS - GTM DataLayer Helper for GTM Templates
// Will help on having a standard core dataLayer values in all pages
// David Vallejo

let model= {
  'event': 'datalayer-initialized'
};

const mergeDataLayer = push => {
  model = {...model, ...push};
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
  return templates.map((tpl, index) => ({
    id: tpl.id,
    name: tpl.name.toLowerCase(),
    brand: tpl.brand ? tpl.brand.toLowerCase() : undefined,
    category: tpl.category.toLowerCase(),
    variant: tpl.type.toLowerCase(),
    list: listName ? listName.toLowerCase() : undefined,
    position: listName ? index.toString() : undefined,
    views: tpl.views.toString(),
    downloads: tpl.downloads.toString(),
    added_date: tpl.parsed_added_date,
    updated_date: tpl.parsed_updated_date,
    author: tpl.author ? tpl.author.toLowerCase() : undefined,
    license: tpl.license ? tpl.license.toLowerCase() : undefined,
  }));
};

const get = () => {
  return model;
};

module.exports = {
  get,
  mergeDataLayer,
  buildEEC
};
