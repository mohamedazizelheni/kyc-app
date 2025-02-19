import request from 'supertest';
import app from '../src/index';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  await mongoose.disconnect();
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Global Enhancements', () => {
  it('should return 404 for a non-existent route', async () => {
    const res = await request(app).get('/non-existent-route').set('Accept', 'application/json');
    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toEqual('Route not found');
  });

  it('should return validation errors for invalid registration input', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: '', email: 'invalid', password: '123' });
    expect(res.statusCode).toEqual(400);
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors.length).toBeGreaterThan(0);
  });
});
