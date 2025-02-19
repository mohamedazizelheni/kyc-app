import request from 'supertest';
import app from '../src/index';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import path from 'path';

let mongoServer: MongoMemoryServer;
let userToken: string;
let adminToken: string;
let kycSubmissionId: string;

beforeAll(async () => {

  await mongoose.disconnect(); 
  // Start an in-memory MongoDB instance for testing
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  // Register a normal user
  await request(app)
    .post('/api/auth/register')
    .send({
      name: 'Normal User',
      email: 'user@example.com',
      password: 'password123',
    });

  // Login as normal user
  const userLoginRes = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'user@example.com',
      password: 'password123',
    });
  userToken = userLoginRes.body.token;

  // Register an admin user
  await request(app)
    .post('/api/auth/register')
    .send({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'Admin',
    });
  // Login as admin user
  const adminLoginRes = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'admin@example.com',
      password: 'password123',
    });
  adminToken = adminLoginRes.body.token;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('KYC Endpoints', () => {
  describe('User KYC Submission', () => {
    it('should not allow KYC submission without authentication', async () => {
      const res = await request(app)
        .post('/api/kyc')
        .attach('document', path.join(__dirname, 'testfile.txt'));
      expect(res.statusCode).toEqual(401);
      expect(res.body.message).toEqual('No token, authorization denied');
    });

    it('should allow authenticated user to submit KYC with a document', async () => {
      const res = await request(app)
        .post('/api/kyc')
        .set('Authorization', `Bearer ${userToken}`)
        .attach('document', path.join(__dirname, 'testfile.txt'));
      expect(res.statusCode).toEqual(201);
      expect(res.body.message).toEqual('KYC submission received');
      kycSubmissionId = res.body.submission._id;
    });

    it('should retrieve user KYC status', async () => {
      const res = await request(app)
        .get('/api/kyc/status')
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('status');
    });
  });

  describe('Admin KYC Management', () => {
    it('should not allow non-admin user to access admin KYC endpoint', async () => {
      const res = await request(app)
        .get('/api/kyc')
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.statusCode).toEqual(403);
      expect(res.body.message).toEqual('Access denied: Admins only');
    });

    it('should allow admin user to get all KYC submissions', async () => {
      const res = await request(app)
        .get('/api/kyc')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });

    it('should allow admin user to update KYC submission status', async () => {
      const res = await request(app)
        .patch(`/api/kyc/${kycSubmissionId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'approved' });
      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toEqual('KYC status updated');
      expect(res.body.submission.status).toEqual('approved');
    });
  });
});
