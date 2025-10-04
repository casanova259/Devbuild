import express from 'express';
import { protect } from '../middleware/auth.js';
import { isAdmin } from '../middleware/admin.js';
import {
    createEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    deleteEvent,
    rsvpEvent,
    getEventAttendees,
    getMyEvents,
    getUpcomingEvents,
    getPastEvents
} from '../controllers/eventController.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Public event routes
router.get('/', getAllEvents);
router.get('/upcoming', getUpcomingEvents);
router.get('/past', getPastEvents);
router.get('/my-events', getMyEvents);
router.get('/:id', getEventById);
router.get('/:id/attendees', getEventAttendees);
router.post('/:id/rsvp', rsvpEvent);

// Admin only routes
router.post('/', isAdmin, createEvent);
router.put('/:id', isAdmin, updateEvent);
router.delete('/:id', isAdmin, deleteEvent);

export default router;