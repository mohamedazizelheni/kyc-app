"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Endpoints for Auth
 */
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const express_validator_1 = require("express-validator");
const validateRequest_1 = require("../middleware/validateRequest");
const router = (0, express_1.Router)();
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: User already exists or validation error
 */
router.post('/register', [
    (0, express_validator_1.check)('name').notEmpty().withMessage('Name is required'),
    (0, express_validator_1.check)('email').isEmail().withMessage('Valid email is required'),
    (0, express_validator_1.check)('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
], validateRequest_1.validate, authController_1.register);
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Returns JWT token
 *       400:
 *         description: Invalid credentials
 */
router.post('/login', [
    (0, express_validator_1.check)('email').isEmail().withMessage('Valid email is required'),
    (0, express_validator_1.check)('password').notEmpty().withMessage('Password is required'),
], validateRequest_1.validate, authController_1.login);
exports.default = router;
