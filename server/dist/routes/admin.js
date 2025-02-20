"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin dashboard and KPI endpoints
 */
const express_1 = require("express");
const adminController_1 = require("../controllers/adminController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
/**
 * @swagger
 * /api/admin/dashboard:
 *   get:
 *     summary: Get dashboard KPI statistics for admin
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns key performance indicators for the admin dashboard
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalUsers:
 *                   type: integer
 *                 totalKycSubmissions:
 *                   type: integer
 *                 pendingCount:
 *                   type: integer
 *                 approvedCount:
 *                   type: integer
 *                 rejectedCount:
 *                   type: integer
 *       401:
 *         description: Unauthorized
 *       403:
 *         description:
 *              Access denied: Admins only
 */
router.get('/dashboard', authMiddleware_1.authMiddleware, authMiddleware_1.adminMiddleware, adminController_1.getDashboardStats);
exports.default = router;
