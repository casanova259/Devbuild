import express from 'express';
import { protect } from '../middleware/auth.js';
import { isAdmin } from '../middleware/admin.js';
import {
    createAnnouncement,
    getAllAnnouncements,
    getAnnouncementById,
    deleteAnnouncement,
    getMyAnnouncements
} from '../controllers/announcementController.js';

const router = express.Router();

router.use(protect);

router.get('/', getAllAnnouncements);
router.get('/my-announcements', getMyAnnouncements);
router.get('/:id', getAnnouncementById);

// Admin only
router.post('/', isAdmin, createAnnouncement);
router.delete('/:id', isAdmin, deleteAnnouncement);

export default router;