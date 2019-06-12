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
    if(action==='impressions'){
        return { productsImpressions: ecommerce.impressions };
    }
    return {ecommerce: ecommerce};
};

const mapProducts = (templates, listName) => {   
    const products = templates.map(function(tpl,index){
        return {
            id: tpl.id || undefined,
            name: tpl.name.toLowerCase() || undefined,
            // price: tpl.price || undefined,
            brand: (tpl.brand) ? tpl.brand.toLowerCase() : undefined,            
            category: (tpl.category) ? tpl.category.toLowerCase() : undefined,    
            variant: (tpl.type) ? tpl.type.toLowerCase() : undefined,    
            list: (tpl.listName) ? tpl.listName.toLowerCase() : undefined,    
            position: (listName) ? index.toString() : undefined,            
            views: (tpl.views) ? tpl.views.toString().toLowerCase() : undefined,
            downloads: (tpl.downloads) ? tpl.downloads.toString().toLowerCase() : undefined,
            added_date: tpl.added_date || undefined,
            updated_date: tpl.updated_date || undefined,            
            author: (tpl.author) ? tpl.author.toLowerCase() : undefined,    
            license: (tpl.license) ? tpl.license.toLowerCase() : undefined,    
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