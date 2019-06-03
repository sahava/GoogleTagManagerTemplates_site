const request = require('supertest');
const app = require('../../app');

describe('Test the root', () => {
  test('It should respond 200 status to GET request', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
  });
});

