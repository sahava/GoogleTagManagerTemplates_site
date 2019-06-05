const request = require('supertest');
const app = require('../../app');

describe('Test / controller', () => {
  test('It should respond 200 status to GET request', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
  });
});

describe('Test /categories controller', () => {
  test('It should respond 200 status to GET request', async () => {
    const response = await request(app).get('/categories');
    expect(response.statusCode).toBe(200);
  });
});

describe('Test /search controller', () => {
  test('It should respond 200 status to GET request', async () => {
    const response = await request(app).get('/search');
    expect(response.statusCode).toBe(200);
  });
});

describe('Test /template controller', () => {

  test('It should respond 200 status to GET request for valid template', async () => {
    const response = await request(app).get('/template/5641906755207168/yandex-metrica');
    expect(response.statusCode).toBe(200);
  });

  test('It should respond 404 status to GET request for non-existent template', async () => {
    const response = await request(app).get('/template/abc/test-template');
    expect(response.statusCode).toBe(404);
  });

});
