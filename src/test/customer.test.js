const app = require('../server');
const request = require('supertest');
const axios = require('axios');
axios.defaults.adapter = require('axios/lib/adapters/http');
jest.setTimeout(30000);


test('Get returns statusCode 200 and the proper body', async () => {
  const response = await request(app).get("/customers/23cdf0bd-22d7-4151-baed-64eca38680ef");
  expect(response.body).toHaveProperty(["id"]);
  expect(response.body).toHaveProperty(["signature"]);
  expect(response.body).toHaveProperty(["customer_name"]);
  expect(response.body).toHaveProperty(["customer_key"]);
  expect(response.statusCode).toBe(200);
})

test('Get returns statusCode 404 NOT FOUND', async () => {
  const response = await request(app).get("/customers/23cdf0bd-22d7-4151-baed-64eca38680efffff");
  expect(response.statusCode).toBe(404);
})

test('post returns statusCode 200 and proper body', async () => {
  const response = await request(app).post('/customers').send({
    customer_key: 232122,
    customer_name: "sssssss"
  });
  expect(response.body).toHaveProperty(["id"]);
  expect(response.body).toHaveProperty(["signature"]);
  expect(response.body).toHaveProperty(["customer_name"]);
  expect(response.body).toHaveProperty(["customer_key"]);
  expect(response.statusCode).toBe(200);
})

test('post returns statusCode 400 for incorrect body', async () => {
  const response = await request(app).post('/customers')
  expect(response.statusCode).toBe(400);
})

test('put returns statusCode 200 and proper body', async () => {
  const response = await request(app).put('/customers/23cdf0bd-22d7-4151-baed-64eca38680ef').send({
    customer_key: 232122,
    customer_name: "sssssss"
  });
  expect(response.body).toHaveProperty(["id"]);
  expect(response.body).toHaveProperty(["signature"]);
  expect(response.body).toHaveProperty(["customer_name"]);
  expect(response.body).toHaveProperty(["customer_key"]);
  expect(response.statusCode).toBe(200);
})

test('put returns statusCode 404 NOT FOUND', async () => {
  const response = await request(app).put('/customers/23cdf0bd-22d7-4151-baed-64eca38680effffffff').send({
    customer_key: 232122,
    customer_name: "sssssss"
  });
  expect(response.statusCode).toBe(404);
})

test('put returns statusCode 400 for incorrect body', async () => {
  const response = await request(app).put('/customers/23cdf0bd-22d7-4151-baed-64eca38680ef');
  expect(response.statusCode).toBe(400);
})

