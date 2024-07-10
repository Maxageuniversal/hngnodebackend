// src/tests/setupTests.js
require('dotenv').config();
const { sequelize } = require('../config/database');
const app = require('../app'); // Ensure you export your app instance from src/app.js
let server;

beforeAll(async () => {
  // Start the server before running tests
  const PORT = process.env.TEST_PORT || 3001;
  server = app.listen(PORT, () => {
    console.log(`Test server running on port ${PORT}`);
  });

  await sequelize.sync({ force: true }); // Recreate database schema for tests
});

// Example of closing server after tests
afterAll(async () => {
    await new Promise((resolve) => server.close(resolve));
  });
  
