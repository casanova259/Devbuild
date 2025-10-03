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
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('fullName').notEmpty(),
    body('batchYear').isInt(),
    body('degree').notEmpty(),
    validate
], register);

router.get('/verify-email/:token', verifyEmail);
router.post('/login', [
    body('email').isEmail(),
    body('password').notEmpty(),
    validate
], login);
router.post('/refresh-token', refreshToken);
router.post('/forgot-password', [
    body('email').isEmail(),
    validate
], forgotPassword);
router.post('/reset-password/:token', [
    body('password').isLength({ min: 6 }),
    validate
], resetPassword);

// Protected routes
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);
router.put('/change-password', protect, [
    body('currentPassword').notEmpty(),
    body('newPassword').isLength({ min: 6 }),
    validate
], changePassword);

export default router;