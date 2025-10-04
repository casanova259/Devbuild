import express from 'express';
import { protect } from '../middleware/auth.js';
import {
    requestMentorship,
    getAvailableMentors,
    getMyMentorshipRequests,
    respondToRequest
} from '../controllers/mentorshipController.js';

const router = express.Router();

router.use(protect);

router.get('/mentors', getAvailableMentors);
router.post('/request', requestMentorship);
router.get('/requests', getMyMentorshipRequests);
router.put('/:id/respond', respondToRequest);

export default router;