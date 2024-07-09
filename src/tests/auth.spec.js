process.env.DATABASE_URL = 'postgresql://postgres:UyVqXRBgJsgnPptebbKGYTMYeVvXnyFH@roundhouse.proxy.rlwy.net:13115/railway';

const request = require('supertest');
const app = require('../app');
const sequelize = require('../config/database');
const jwt = require('jsonwebtoken'); // Ensure jwt is imported

jest.setTimeout(60000);

beforeAll(async () => {
  await sequelize.sync({ force: false });
});

afterAll(async () => {
  await sequelize.close();
});

describe('POST /auth/register', () => {
  it('should register a user successfully', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password',
        phone: '1234567890'
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.data).toHaveProperty('accessToken');
  });

  it('should fail if email field is missing', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        password: 'password',
        phone: '1234567890'
      });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('message', 'All fields are required');
  });
});

describe('Token Generation', () => {
  it('should generate a valid JWT token with correct expiry', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password',
        phone: '1234567890'
      });

    const token = response.body.data.accessToken;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    expect(decodedToken).toHaveProperty('userId');
    expect(decodedToken.exp).toBeGreaterThan(Math.floor(Date.now() / 1000));
  });
});

describe('Organisation Access Restrictions', () => {
  it('should restrict access to organisations user does not belong to', async () => {
    // Assumes a setup where this user is not part of the organisation
    const response = await request(app)
      .get('/api/organisations/1') // Example org ID
      .set('Authorization', `Bearer invalidToken`);

    expect(response.statusCode).toBe(403);
    expect(response.body).toHaveProperty('message', 'You are not authorized to access this resource.');
  });
});

describe('Organisation Functionality', () => {
  let accessToken;

  beforeAll(async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        email: 'john@example.com',
        password: 'password'
      });

    accessToken = response.body.data.accessToken;
  });

  it('should create an organisation successfully', async () => {
    const response = await request(app)
      .post('/api/organisations')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: "John's New Organisation",
        description: 'New Organisation for testing'
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.data).toHaveProperty('orgId');
    expect(response.body.data).toHaveProperty('name', "John's New Organisation");
    expect(response.body.data).toHaveProperty('description', 'New Organisation for testing');
  });

  it('should fetch all organisations user belongs to', async () => {
    const response = await request(app)
      .get('/api/organisations')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.data).toHaveProperty('organisations');
  });

  it('should fetch a single organisation by orgId', async () => {
    const createResponse = await request(app)
      .post('/api/organisations')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: "Another Organisation",
        description: 'Another Organisation for testing'
      });

    const { orgId } = createResponse.body.data;

    const response = await request(app)
      .get(`/api/organisations/${orgId}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.data).toHaveProperty('orgId', orgId);
    expect(response.body.data).toHaveProperty('name', "Another Organisation");
    expect(response.body.data).toHaveProperty('description', 'Another Organisation for testing');
  });
});
