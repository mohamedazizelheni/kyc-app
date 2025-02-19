import { Router } from 'express';
import multer from 'multer';
import { check } from 'express-validator';
import {
  submitKyc,
  getUserKycStatus,
  getAllKycSubmissions,
  updateKycStatus,
} from '../controllers/kycController';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware';
import { validate } from '../middleware/validateRequest';

const router = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Ensure the 'uploads' folder exists in your server root
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

// User routes for KYC submission
router.post(
  '/',
  authMiddleware,
  upload.single('document'),
  // Custom validation: Ensure that a file is attached.
  (req, res, next) => {
    if (!req.file) {
      return res.status(400).json({ message: 'Document file is required' });
    }
    next();
  },
  submitKyc
);

router.get('/status', authMiddleware, getUserKycStatus);

// Admin routes for managing submissions
router.get('/', authMiddleware, adminMiddleware, getAllKycSubmissions);

router.patch(
  '/:id',
  authMiddleware,
  adminMiddleware,
  [
    // Validate that 'status' is either 'approved' or 'rejected'
    check('status')
      .isIn(['approved', 'rejected'])
      .withMessage('Status must be either approved or rejected'),
  ],
  validate,
  updateKycStatus
);

export default router;
