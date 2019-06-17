const request = require('supertest');
const app = require('../../app');

describe('Test /', () => {

  test('It should respond 200 status to GET request for /', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
  });

});

describe('Test /categories/', () => {

  test('It should respond 200 status to GET request for /categories/', async () => {
    const response = await request(app).get('/categories/');
    expect(response.statusCode).toBe(200);
  });

  test('It should respond 200 status to GET request for /categories/analytics/', async () => {
    const response = await request(app).get('/categories/analytics/');
    expect(response.statusCode).toBe(200);
  });

  test('It should respond 404 status to GET request for /categories/non-existent/', async () => {
    const response = await request(app).get('/categories/non-existent/');
    expect(response.statusCode).toBe(404);
  });

});

describe('Test /search/', () => {

  test('It should respond 200 status to GET request for /search/', async () => {
    const response = await request(app).get('/search/');
    expect(response.statusCode).toBe(200);
  });

  test('It should respond 200 status to GET request for /search?q=something', async () => {
    const response = await request(app).get('/search/?q=something');
    expect(response.statusCode).toBe(200);
  });

});

describe('Test /users/', () => {

  test('It should respond 301 status to GET request for /admin/', async () => {
    const response = await request(app).get('/admin/');
    expect(response.statusCode).toBe(301);
  });

});

describe('Test /template/', () => {

  test('It should respond 404 status to GET request for /template/', async () => {
    const response = await request(app).get('/template/');
    expect(response.statusCode).toBe(404);
  });

  test('It should respond 200 status to GET request for specific template', async () => {
    const response = await request(app).get('/template/5681034041491456/yandex-metrica/');
    expect(response.statusCode).toBe(200);
  });

  test('It should respond 404 status to GET request for invalid template ID format', async () => {
    const response = await request(app).get('/template/abc123/');
    expect(response.statusCode).toBe(404);
  });

  test('It should respond 404 status to GET request for invalid template ID', async () => {
    const response = await request(app).get('/template/1234567890/');
    expect(response.statusCode).toBe(404);
  })

});
