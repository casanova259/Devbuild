import express from 'express';
import { protect } from '../middleware/auth.js';
import { isAdmin } from '../middleware/admin.js';
import {
    makeDonation,
    getMyDonations,
    getAllDonations,
    getDonationStats,
    getTopDonors
} from '../controllers/donationController.js';

const router = express.Router();

router.use(protect);

router.post('/', makeDonation);
router.get('/my-donations', getMyDonations);
router.get('/top-donors', getTopDonors);

// Admin only
router.get('/all', isAdmin, getAllDonations);
router.get('/stats', isAdmin, getDonationStats);

export default router;