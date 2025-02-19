/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin dashboard and KPI endpoints
 */
import { Router } from 'express';
import { getDashboardStats } from '../controllers/adminController';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware';

const router = Router();

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
router.get('/dashboard', authMiddleware, adminMiddleware, getDashboardStats);

export default router;
