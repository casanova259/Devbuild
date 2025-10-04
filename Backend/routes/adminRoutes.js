import express from 'express';
import { protect } from './middleware/auth.js';
import { isAdmin } from './middleware/admin.js';
import {
    getDashboardStats,
    getAllUsers,
    approveUser,
    deleteUser
} from '../controllers/adminController.js';

const router = express.Router();

router.use(protect);
router.use(isAdmin); // All admin routes require admin role

router.get('/dashboard-stats', getDashboardStats);
router.get('/users', getAllUsers);
router.put('/users/:id/approve', approveUser);
router.delete('/users/:id', deleteUser);

export default router;