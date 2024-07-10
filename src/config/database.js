const { Sequelize } = require('sequelize');
require('dotenv').config();

console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_PORT:", process.env.DB_PORT);
console.log("DB_DATABASE:", process.env.DB_DATABASE);
console.log("DB_USERNAME:", process.env.DB_USERNAME);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);

const sequelize = new Sequelize(
  String(process.env.DB_DATABASE),
  String(process.env.DB_USERNAME),
  String(process.env.DB_PASSWORD),
  {
    host: String(process.env.DB_HOST),
    dialect: 'postgres',
    port: parseInt(process.env.DB_PORT, 10),
  }
);

module.exports = sequelize;
