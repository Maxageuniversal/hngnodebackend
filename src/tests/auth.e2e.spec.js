const request = require('supertest');
const app = require('../app');
const sequelize = require('../config/database');
const jwt = require('jsonwebtoken');

jest.setTimeout(60000); // Increase Jest timeout for longer tests

beforeAll(async () => {
  await sequelize.sync({ force: true }); // Ensure database is reset before tests
});

afterAll(async () => {
  await sequelize.close(); // Close database connection after all tests
});

describe('POST /auth/register', () => {
  it('should register a user successfully', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        phone: '+1234567890',
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('status', 'success');
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('accessToken');
    expect(res.body.data).toHaveProperty('user');
    expect(res.body.data.user).toHaveProperty('userId');
    expect(res.body.data.user).toHaveProperty('firstName', 'John');
  });

  it('should fail if required fields are missing', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      });

    expect(res.statusCode).toEqual(422);
    expect(res.body).toHaveProperty('status', 'Bad request');
    expect(res.body).toHaveProperty('message');
    expect(res.body).toHaveProperty('errors');
  });
});

describe('Token Generation', () => {
  it('should generate a valid JWT token with correct expiry', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        phone: '+1234567890',
      });

    const token = res.body.data.accessToken;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    expect(decodedToken).toHaveProperty('userId');
    expect(decodedToken.exp).toBeGreaterThan(Math.floor(Date.now() / 1000));
  });
});