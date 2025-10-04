import express from 'express';
import { protect } from '../middleware/auth.js';
import {
    sendMessage,
    getMyMessages,
    getConversation,
    markAsRead,
    deleteMessage,
    getUnreadCount
} from '../controllers/messageController.js';

const router = express.Router();

router.use(protect);

router.post('/', sendMessage);
router.get('/', getMyMessages);
router.get('/unread-count', getUnreadCount);
router.get('/conversation/:userId', getConversation);
router.put('/:id/read', markAsRead);
router.delete('/:id', deleteMessage);

export default router;