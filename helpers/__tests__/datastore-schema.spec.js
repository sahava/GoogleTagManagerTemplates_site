const {toSchema} = require('../datastore-schema');
const mocks = require('../__mocks__/helpers.mocks');
const {parseTemplate} = require('../../helpers/gtm-custom-template-parser');

describe('Test datastore-schema.js', () => {
  test('Should return schema-compliant result with valid template object', () => {
    const result = toSchema(parseTemplate(mocks.validTemplate));
    expect(result).toBeTruthy();
  });
  test('Should return false with invalid template object', () => {
    const result = toSchema(parseTemplate(mocks.invalidTemplate));
    expect(result).toEqual({error: {delta: ['category']}});
  });
});
