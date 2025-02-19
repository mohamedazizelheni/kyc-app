import request from 'supertest';
import app from '../src/index';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  // Disconnect from any existing MongoDB connections
  await mongoose.disconnect();
  // Start an in-memory MongoDB instance for testing
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  // Disconnect and stop the in-memory MongoDB instance
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Auth Endpoints', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.message).toEqual('User registered successfully');
  });

  it('should not register a user with duplicate email', async () => {
    // First, register the user
    await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'duplicate@example.com',
        password: 'password123',
      });

    // Try to register the same user again
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'duplicate@example.com',
        password: 'password123',
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual('User already exists');
  });

  it('should login with valid credentials', async () => {
    // First, register a user
    await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Login User',
        email: 'login@example.com',
        password: 'password123',
      });

    // Then, attempt login
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'login@example.com',
        password: 'password123',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });
});
