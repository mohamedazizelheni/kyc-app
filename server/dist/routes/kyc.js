"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @swagger
 * tags:
 *   name: KYC
 *   description: Endpoints for KYC submission and management
 */
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const express_validator_1 = require("express-validator");
const kycController_1 = require("../controllers/kycController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const validateRequest_1 = require("../middleware/validateRequest");
const router = (0, express_1.Router)();
// Configure multer for file uploads
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Ensure the 'uploads' folder exists in your server root
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});
const upload = (0, multer_1.default)({ storage });
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
router.post('/', authMiddleware_1.authMiddleware, upload.single('document'), 
// Custom validation: Ensure that a file is attached.
(req, res, next) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Document file is required' });
    }
    next();
}, kycController_1.submitKyc);
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
router.get('/status', authMiddleware_1.authMiddleware, kycController_1.getUserKycStatus);
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
router.get('/', authMiddleware_1.authMiddleware, authMiddleware_1.adminMiddleware, kycController_1.getAllKycSubmissions);
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
router.patch('/:id', authMiddleware_1.authMiddleware, authMiddleware_1.adminMiddleware, [
    // Validate that 'status' is either 'approved' or 'rejected'
    (0, express_validator_1.check)('status')
        .isIn(['approved', 'rejected'])
        .withMessage('Status must be either approved or rejected'),
], validateRequest_1.validate, kycController_1.updateKycStatus);
exports.default = router;
