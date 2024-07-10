// src/config/database.jsconst { Sequelize } = require('sequelize');const { Sequelize } = require('sequelize');
const { Sequelize } = require('sequelize');
require('dotenv').config(); // Ensure dotenv is correctly required for environment variables

// Update with your local PostgreSQL settings
const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  logging: false, // Disable logging to console
});

// Test the connection to the database
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

module.exports = sequelize;
