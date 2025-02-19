/**
 * @swagger
 * tags:
 *   name: KYC
 *   description: Endpoints for KYC submission and management
 */
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

/**
 * @swagger
 * /api/kyc:
 *   post:
 *     summary: Submit a KYC document
 *     tags: [KYC]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               document:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: KYC submission received
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 submission:
 *                   type: object
 *       400:
 *         description: Document file is required or validation error
 *       401:
 *         description: Unauthorized
 */
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

/**
 * @swagger
 * /api/kyc/status:
 *   get:
 *     summary: Get the authenticated user's KYC status
 *     tags: [KYC]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns the KYC submission status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: No submission found
 */
router.get('/status', authMiddleware, getUserKycStatus);

/**
 * @swagger
 * /api/kyc:
 *   get:
 *     summary: Retrieve all KYC submissions (Admin only)
 *     tags: [KYC]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all KYC submissions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: 
 *              Access denied: Admins only
 */
router.get('/', authMiddleware, adminMiddleware, getAllKycSubmissions);

/**
 * @swagger
 * /api/kyc/{id}:
 *   patch:
 *     summary: Update a KYC submission status (Admin only)
 *     tags: [KYC]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the KYC submission to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [approved, rejected]
 *     responses:
 *       200:
 *         description: KYC status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 submission:
 *                   type: object
 *       400:
 *         description: Invalid status or validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: 
 *              Access denied: Admins only
 *       404:
 *         description: Submission not found
 */
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
