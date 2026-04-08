const { Sequelize } = require('sequelize');
require('dotenv').config();

// Ensure the password is a real string regardless of environment
const dbPass = process.env.DB_PASS !== undefined ? String(process.env.DB_PASS) : '';

const sequelize = new Sequelize(
  process.env.DB_NAME || 'shoes_products',
  process.env.DB_USER || 'postgres',
  dbPass,
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: false,
  }
);

module.exports = sequelize;
