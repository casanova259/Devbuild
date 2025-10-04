import express from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validator.js';
import { protect } from '../middleware/auth.js';
import {
    register,
    verifyEmail,
    login,
    refreshToken,
    forgotPassword,
    resetPassword,
    getMe,
    logout,
    changePassword
} from '../controllers/authController.js';

const router = express.Router();

// Public routes
router.post('/register', [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('fullName').notEmpty().withMessage('Full name is required'),
    body('batchYear').isInt({ min: 1950, max: 2030 }).withMessage('Please provide a valid batch year'),
    body('degree').notEmpty().withMessage('Degree is required'),
    validate
], register);

router.get('/verify-email/:token', verifyEmail);

router.post('/login', [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
    validate
], login);

router.post('/refresh-token', refreshToken);

router.post('/forgot-password', [
    body('email').isEmail().withMessage('Please provide a valid email'),
    validate
], forgotPassword);

router.put('/reset-password/:resettoken', [
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    validate
], resetPassword);

// Protected routes
router.use(protect); // All routes below are protected

router.get('/me', getMe);
router.post('/logout', logout);

router.put('/change-password', [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
    validate
], changePassword);

export default router;