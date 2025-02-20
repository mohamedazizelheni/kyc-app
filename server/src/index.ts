import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger';
import fs from 'fs';
import path from 'path';

import authRoutes from './routes/auth';
import kycRoutes from './routes/kyc';
import adminRoutes from './routes/admin';
import { errorHandler } from './middleware/errorHandler';
import { seedAdmin } from './seed';

dotenv.config();

const app = express();
const PORT = process.env.PORT ;

const uploadsDir = path.join(__dirname, '..', 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Rate Limiting: limit each IP to 100 requests per 15 minutes
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  });
  app.use(limiter);

// Middleware setup
app.use(helmet());
app.use(cors());
app.use(express.json());

// Serve static files from the uploads folder (for accessing uploaded documents)
app.use('/uploads', express.static('uploads'));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log('MongoDB connected')
    seedAdmin();
  })
  .catch((err) => console.error('MongoDB connection error:', err));

// routes
app.use('/api/auth', authRoutes);
app.use('/api/kyc', kycRoutes);
app.use('/api/admin', adminRoutes);

// Swagger API Docs
if (process.env.NODE_ENV !== 'production') {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

app.get('/', (req, res) => {
  res.send('API is working');
});

app.use((req, res, next) => {
    const error = new Error('Route not found');
    res.status(404);
    next(error);
});

// Global Error Handling 
app.use(errorHandler);

// start the server if not in test mode
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  }

export default app;
