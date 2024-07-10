const request = require('supertest');
const app = require('../app'); // Ensure you export your app instance from src/app.js
const { sequelize } = require('../config/database');

let server;

beforeAll(async () => {
  // Start the server before running tests
  const PORT = process.env.TEST_PORT || 3001;
  server = app.listen(PORT, () => {
    console.log(`Test server running on port ${PORT}`);
  });

  await sequelize.sync({ force: true }); // Recreate database schema for tests
});

afterAll(async () => {
  // Close the server and database connection after tests
  await sequelize.close();
  if (server) {
    server.close();
  }
});

describe('Auth Endpoints', () => {
  let user;

  beforeAll(() => {
    user = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'password',
      phone: '1234567890',
    };
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send(user);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('accessToken');
  });

  it('should login an existing user', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: user.email,
        password: user.password,
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('accessToken');
  });

  it('should not register a user with the same email', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send(user);
    expect(res.statusCode).toEqual(400);
  });

  it('should not login with incorrect password', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: user.email,
        password: 'wrongpassword',
      });
    expect(res.statusCode).toEqual(401);
  });
});

afterAll((done) => {
  server.close(done);
});