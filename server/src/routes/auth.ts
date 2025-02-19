// server/src/routes/auth.ts
import { Router } from 'express';
import { register, login } from '../controllers/authController';
import { check } from 'express-validator';
import { validate } from '../middleware/validateRequest';

const router = Router();

router.post(
  '/register',
  [
    check('name').notEmpty().withMessage('Name is required'),
    check('email').isEmail().withMessage('Valid email is required'),
    check('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
  ],
  validate,
  register
);

router.post(
  '/login',
  [
    check('email').isEmail().withMessage('Valid email is required'),
    check('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  login
);

export default router;
