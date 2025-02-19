import { Router } from 'express';
import { getDashboardStats } from '../controllers/adminController';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware';

const router = Router();

// GET /api/admin/dashboard - returns KPI stats for the admin dashboard
router.get('/dashboard', authMiddleware, adminMiddleware, getDashboardStats);

export default router;
