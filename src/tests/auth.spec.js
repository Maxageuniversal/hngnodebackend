const request = require('supertest');
const app = require('../app'); // Assuming your Express app is configured in app.js
const jwt = require('jsonwebtoken');

let server; // Declare server variable to store server reference

beforeAll(async () => {
  server = await app.listen(); // Start the server and store the reference
});

afterAll(done => {
  server.close(done); // Close the server after all tests are done
});

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

    // Assertion: HTTP status code should be 201 (Created)
    expect(response.statusCode).toBe(201);

    // Assertion: Response body should contain 'data' property
    expect(response.body).toHaveProperty('data');

    // Assertion: 'data' property should contain 'accessToken'
    expect(response.body.data).toHaveProperty('accessToken');
  }, 60000); // Set timeout to 60 seconds (60000 ms)

  it('should fail if email field is missing', async () => {
    const newUser = {
      password: 'password',
      firstName: 'John',
      lastName: 'Doe',
    };

    const response = await request(app)
      .post('/auth/register')
      .send(newUser);

    // Assertion: HTTP status code should be 422 (Unprocessable Entity)
    expect(response.statusCode).toBe(422);

    // Assertion: Response body should have 'status' as 'error'
    expect(response.body).toHaveProperty('status', 'error');

    // Assertion: Response body should have 'message' as 'Registration unsuccessful'
    expect(response.body).toHaveProperty('message', 'Registration unsuccessful');
  }, 60000); // Set timeout to 60 seconds (60000 ms)

  // Add more test cases as needed for other scenarios
});
