// src/tests/auth.spec.js

process.env.DATABASE_URL = 'postgresql://postgres:UyVqXRBgJsgnPptebbKGYTMYeVvXnyFH@roundhouse.proxy.rlwy.net:13115/railway'; // Add this line

const request = require('supertest');
const app = require('../app');
const sequelize = require('../config/database');

jest.setTimeout(60000); // Set timeout to 60 seconds

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
    // Test logic for token generation and expiry
  });
});

describe('Organisation Access Restrictions', () => {
  it('should restrict access to organisations user does not belong to', async () => {
    // Test logic to ensure users cannot access organisations they don't belong to
  });
});
// src/tests/auth.spec.js

describe('Organisation Functionality', () => {
    let accessToken;
  
    beforeAll(async () => {
      // Log in the user to get accessToken for protected routes
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
      // Add more assertions for organisation details if needed
    });
  
    it('should fetch a single organisation by orgId', async () => {
      // Create an organisation first
      const createResponse = await request(app)
        .post('/api/organisations')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ 
          name: "Another Organisation",
          description: 'Another Organisation for testing'
        });
  
      const { orgId } = createResponse.body.data;
  
      // Fetch the created organisation
      const response = await request(app)
        .get(`/api/organisations/${orgId}`)
        .set('Authorization', `Bearer ${accessToken}`);
  
      expect(response.statusCode).toBe(200);
      expect(response.body.data).toHaveProperty('orgId', orgId);
      expect(response.body.data).toHaveProperty('name', "Another Organisation");
      expect(response.body.data).toHaveProperty('description', 'Another Organisation for testing');
    });
  
    // Add more tests for other organisation functionality as per your requirements
  });
  