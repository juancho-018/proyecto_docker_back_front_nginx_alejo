const request = require('supertest');
const express = require('express');
const authRoutes = require('../src/routes/auth');
const User = require('../src/models/User');
const sequelize = require('../src/config/db');

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);

// Mock database connection
beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Auth Microservice', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.user).toHaveProperty('id');
  });

  it('should not register user with existing email', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({
        username: 'otheruser',
        email: 'test@example.com',
        password: 'password123'
      });
    expect(res.statusCode).toEqual(400);
  });

  it('should login an existing user', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });
});
