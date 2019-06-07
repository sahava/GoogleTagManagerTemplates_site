const {toSchema} = require('../datastore-schema');
const mocks = require('../__mocks__/helpers.mocks');

describe('Test datastore-schema.js', () => {
  test('Should return schema-compliant result with valid template object', () => {
    const result = toSchema(mocks.validTemplate);
    expect(result).toBeTruthy();
  });
  test('Should return false with invalid template object', () => {
    const result = toSchema(mocks.invalidTemplate);
    expect(result).toBe(false);
  });
});
