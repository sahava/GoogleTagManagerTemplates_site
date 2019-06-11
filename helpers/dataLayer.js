// NodeJS - GTM DataLayer Helper for GTM Templates
// Will help on having a standard core dataLayer values in all pages
// David Vallejo

'use strict';
let model= {
    'event': 'datalayer-initialized'
};

const mergeDataLayer = (push) => {
    model = {...model, ...push};
};

const buildEEC = (action,actionField,products) => {
    let ecommerce = {};
    switch (action) {
      case 'detail':
        ecommerce[action] = {
            actionField : actionField || {},
            products: mapProducts(products)
        };
        break;
      case 'impressions':
        ecommerce[action] = mapProducts(products,actionField.list);
        break;            
      default:
        break;
    }    
    return {ecommerce: ecommerce};
};

const mapProducts = (templates, listName) => {   
    const products = templates.map(function(tpl,index){
        return {
            id: tpl.id || undefined,
            name: tpl.name || undefined,
            price: tpl.price || undefined,
            brand: tpl.price || undefined,            
            category: tpl.category || undefined,
            variant: tpl.type || undefined,
            list: listName || undefined,  
            position: (listName) ? index.toString() : undefined,
            views: tpl.views.toString() || undefined,
            downloads: tpl.downloads.toString() || undefined,
            added_date: tpl.added_date || undefined,
            updated_date: tpl.updated_date || undefined,            
            author: tpl.author || undefined,
            license: tpl.license || undefined
        };        
    });
    return products;
};

const get = () => {
    return model;
};

module.exports = {
  get,
  mergeDataLayer,
  buildEEC
};