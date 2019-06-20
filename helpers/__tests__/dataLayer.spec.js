const dataLayer = require('../dataLayer');
const mocks = require('../__mocks__/helpers.mocks');
const {parseTemplate} = require('../../helpers/gtm-custom-template-parser');

describe('Test dataLayer.js', () => {

  test('Should return the basic model with get()', () => {
    const result = dataLayer.get();
    expect(result).toMatchObject({event: 'datalayer-initialized'});
  });

  test('Should merge object with current dataLayer model', () => {
    dataLayer.mergeDataLayer({key: 'value'});
    expect(dataLayer.get()).toMatchObject({event: 'datalayer-initialized', key: 'value'});
  });

  test('Should build EEC detail object from template', () => {
    const products = [parseTemplate(mocks.validTemplate)];
    const expected = {
      ecommerce: {
        detail: {
          actionField: {
            list: 'some-list'
          },
          products: [{
            id: '5641906755207168',
            name: 'yandex metrica',
            brand: undefined,
            category: 'tag/analytics',
            variant: 'tag',
            list: undefined,
            position: undefined,
            views: '119',
            downloads: '0',
            added_date: '05 jun 2019',
            updated_date: '05 jun 2019',
            author: 'david vallejo',
            license: 'mit'
          }]
        }
      }
    };

    const result = dataLayer.buildEEC('detail', {list: 'some-list'}, products);
    expect(result).toMatchObject(expected);
  });

  test('Should build EEC detail object without actionField from template', () => {
    const products = [parseTemplate(mocks.validTemplate)];
    const expected = {
      ecommerce: {
        detail: {
          actionField: {},
          products: [{
            id: '5641906755207168',
            name: 'yandex metrica',
            brand: undefined,
            category: 'tag/analytics',
            variant: 'tag',
            list: undefined,
            position: undefined,
            views: '119',
            downloads: '0',
            added_date: '05 jun 2019',
            updated_date: '05 jun 2019',
            author: 'david vallejo',
            license: 'mit'
          }]
        }
      }
    };

    const result = dataLayer.buildEEC('detail', undefined, products);
    expect(result).toMatchObject(expected);
  });

  test('Should build EEC impressions object from template', () => {
    const products = [parseTemplate(mocks.validTemplate)];
    const expected = {
      productsImpressions: [{
        id: '5641906755207168',
        name: 'yandex metrica',
        brand: undefined,
        category: 'tag/analytics',
        variant: 'tag',
        list: undefined,
        position: undefined,
        views: '119',
        downloads: '0',
        added_date: '05 jun 2019',
        updated_date: '05 jun 2019',
        author: 'david vallejo',
        license: 'mit'
      }]
    };

    const result = dataLayer.buildEEC('impressions', null, products);
    expect(result).toMatchObject(expected);

  });

  test('Should process all possible parameters of the product object', () => {
    const template = mocks.validTemplate;
    template.brand = 'some-brand';
    delete template.author;
    delete template.license;
    delete template.category;

    const products = [parseTemplate(template)];
    const expected = {
      productsImpressions: [{
        id: '5641906755207168',
        name: 'yandex metrica',
        brand: 'some-brand',
        category: undefined,
        variant: 'tag',
        list: 'some-list',
        position: '0',
        views: '119',
        downloads: '0',
        added_date: '05 jun 2019',
        updated_date: '05 jun 2019',
        author: undefined,
        license: undefined
      }]
    };

    const result = dataLayer.buildEEC('impressions', null, products, 'some-list');
    expect(result).toMatchObject(expected);

  });
});
