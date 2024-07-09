// src/tests/auth.e2e.spec.js
const request = require('supertest');
const app = require('../app');
const sequelize = require('../config/database');
const jwt = require('jsonwebtoken');

jest.setTimeout(60000);

beforeAll(async () => {
  await sequelize.sync({ force: false });
});

afterAll(async () => {
  await sequelize.close();
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

describe('Organisation Access Restrictions', () => {
  it('should restrict access to organisations user does not belong to', async () => {
    const res = await request(app)
      .get('/api/organisations/1')
      .set('Authorization', `Bearer invalidToken`);

    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty('message', 'You are not authorized to access this resource.');
  });
});

describe('Organisation Functionality', () => {
  let accessToken;

  beforeAll(async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'john.doe@example.com',
        password: 'password123',
      });

    accessToken = res.body.data.accessToken;
  });

  it('should create an organisation successfully', async () => {
    const res = await request(app)
      .post('/api/organisations')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: "John's New Organisation",
        description: 'New Organisation for testing',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.data).toHaveProperty('orgId');
    expect(res.body.data).toHaveProperty('name', "John's New Organisation");
    expect(res.body.data).toHaveProperty('description', 'New Organisation for testing');
  });

  it('should fetch all organisations user belongs to', async () => {
    const res = await request(app)
      .get('/api/organisations')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('organisations');
  });

  it('should fetch a single organisation by orgId', async () => {
    const createRes = await request(app)
      .post('/api/organisations')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Another Organisation',
        description: 'Another Organisation for testing',
      });

    const { orgId } = createRes.body.data;

    const res = await request(app)
      .get(`/api/organisations/${orgId}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('orgId', orgId);
    expect(res.body.data).toHaveProperty('name', 'Another Organisation');
    expect(res.body.data).toHaveProperty('description', 'Another Organisation for testing');
  });
});
