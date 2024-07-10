const request = require('supertest');
const app = require('../app'); // Assuming your Express app is configured in app.js

describe('POST /auth/register', () => {
  it('should register a user successfully', async () => {
    const newUser = {
      email: 'test@example.com',
      password: 'password',
      firstName: 'John',
      lastName: 'Doe',
    };

    const response = await request(app)
      .post('/auth/register')
      .send(newUser);

    expect(response.statusCode).toBe(201); // Expecting a 201 Created status code
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('accessToken');
  });

  it('should fail if email field is missing', async () => {
    const newUser = {
      password: 'password',
      firstName: 'John',
      lastName: 'Doe',
    };

    const response = await request(app)
      .post('/auth/register')
      .send(newUser);

    expect(response.statusCode).toBe(422); // Expecting a 422 Unprocessable Entity status code for missing email
    expect(response.body).toHaveProperty('status', 'error');
    expect(response.body).toHaveProperty('message', 'Registration unsuccessful');
  });
});
