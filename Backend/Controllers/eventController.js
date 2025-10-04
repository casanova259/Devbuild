import asyncHandler from '../utils/asyncHandler.js';
import { Event } from '../models/Event.js';
import { Alumni } from '../models/Alumni.js';
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';

// @desc    Create new event
// @route   POST /api/events
// @access  Private (Admin only)
export const createEvent = asyncHandler(async (req, res) => {
    const eventData = {
        ...req.body,
        createdBy: req.user._id
    };

    const event = await Event.create(eventData);

    res.status(201).json({
        success: true,
        data: event,
        message: 'Event created successfully'
    });
});

// @desc    Get all events with filters
// @route   GET /api/events
// @access  Private
export const getAllEvents = asyncHandler(async (req, res) => {
    const {
        eventType,
        upcoming,
        past,
        search,
        page = 1,
        limit = 10
    } = req.query;

    let query = {};
    const now = new Date();

    // Filter by event type
    if (eventType) {
        query.eventType = eventType;
    }

    // Filter by upcoming/past events
    if (upcoming === 'true') {
        query.eventDate = { $gte: now };
    } else if (past === 'true') {
        query.eventDate = { $lt: now };
    }

    // Search in title and description
    if (search) {
        query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
        ];
    }

    const skip = (page - 1) * limit;

    const events = await Event.find(query)
        .populate('createdBy', 'email role')
        .populate('attendees.alumniId', 'fullName profilePicture')
        .skip(skip)
        .limit(Number(limit))
        .sort({ eventDate: 1 });

    const total = await Event.countDocuments(query);

    res.status(200).json({
        success: true,
        count: events.length,
        total,
        pages: Math.ceil(total / limit),
        currentPage: Number(page),
        data: events
    });
});

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Private
export const getEventById = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id)
        .populate('createdBy', 'email role')
        .populate('attendees.alumniId', 'fullName profilePicture batchYear currentCompany');

    if (!event) {
        return res.status(404).json({
            success: false,
            message: 'Event not found'
        });
    }

    res.status(200).json({
        success: true,
        data: event
    });
});

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private (Admin only)
export const updateEvent = asyncHandler(async (req, res) => {
    let event = await Event.findById(req.params.id);

    if (!event) {
        return res.status(404).json({
            success: false,
            message: 'Event not found'
        });
    }

    event = await Event.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    ).populate('createdBy', 'email role');

    res.status(200).json({
        success: true,
        data: event,
        message: 'Event updated successfully'
    });
});

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private (Admin only)
export const deleteEvent = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);

    if (!event) {
        return res.status(404).json({
            success: false,
            message: 'Event not found'
        });
    }

    await Event.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        message: 'Event deleted successfully'
    });
});

// @desc    RSVP to event
// @route   POST /api/events/:id/rsvp
// @access  Private
export const rsvpEvent = asyncHandler(async (req, res) => {
    const { status } = req.body; // going, maybe, not-going
    const eventId = req.params.id;

    // Get user's alumni profile
    const alumni = await Alumni.findOne({ userId: req.user._id });
    if (!alumni) {
        return res.status(404).json({
            success: false,
            message: 'Alumni profile not found'
        });
    }

    const event = await Event.findById(eventId);
    if (!event) {
        return res.status(404).json({
            success: false,
            message: 'Event not found'
        });
    }

    // Check if user already RSVP'd
    const existingRsvp = event.attendees.find(
        attendee => attendee.alumniId.toString() === alumni._id.toString()
    );

    if (existingRsvp) {
        // Update existing RSVP
        existingRsvp.status = status;
        existingRsvp.registeredAt = new Date();
    } else {
        // Add new RSVP
        event.attendees.push({
            alumniId: alumni._id,
            status,
            registeredAt: new Date()
        });
    }

    await event.save();

    res.status(200).json({
        success: true,
        data: { status },
        message: `RSVP updated to "${status}"`
    });
});

// @desc    Get event attendees
// @route   GET /api/events/:id/attendees
// @access  Private
export const getEventAttendees = asyncHandler(async (req, res) => {
    const { status } = req.query; // Filter by RSVP status

    const event = await Event.findById(req.params.id)
        .populate({
            path: 'attendees.alumniId',
            select: 'fullName profilePicture batchYear currentCompany jobTitle'
        });

    if (!event) {
        return res.status(404).json({
            success: false,
            message: 'Event not found'
        });
    }

    let attendees = event.attendees;

    // Filter by status if provided
    if (status) {
        attendees = attendees.filter(attendee => attendee.status === status);
    }

    res.status(200).json({
        success: true,
        count: attendees.length,
        data: attendees
    });
});

// @desc    Get user's events (RSVP'd events)
// @route   GET /api/events/my-events
// @access  Private
export const getMyEvents = asyncHandler(async (req, res) => {
    const { upcoming, past } = req.query;

    // Get user's alumni profile
    const alumni = await Alumni.findOne({ userId: req.user._id });
    if (!alumni) {
        return res.status(404).json({
            success: false,
            message: 'Alumni profile not found'
        });
    }

    let query = { 'attendees.alumniId': alumni._id };
    const now = new Date();

    // Filter by upcoming/past
    if (upcoming === 'true') {
        query.eventDate = { $gte: now };
    } else if (past === 'true') {
        query.eventDate = { $lt: now };
    }

    const events = await Event.find(query)
        .populate('createdBy', 'email role')
        .sort({ eventDate: 1 });

    res.status(200).json({
        success: true,
        count: events.length,
        data: events
    });
});

// @desc    Get upcoming events
// @route   GET /api/events/upcoming
// @access  Private
export const getUpcomingEvents = asyncHandler(async (req, res) => {
    const { limit = 5 } = req.query;
    const now = new Date();

    const events = await Event.find({ eventDate: { $gte: now } })
        .populate('createdBy', 'email role')
        .limit(Number(limit))
        .sort({ eventDate: 1 });

    res.status(200).json({
        success: true,
        count: events.length,
        data: events
    });
});

// @desc    Get past events
// @route   GET /api/events/past
// @access  Private
export const getPastEvents = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const now = new Date();
    const skip = (page - 1) * limit;

    const events = await Event.find({ eventDate: { $lt: now } })
        .populate('createdBy', 'email role')
        .skip(skip)
        .limit(Number(limit))
        .sort({ eventDate: -1 });

    const total = await Event.countDocuments({ eventDate: { $lt: now } });

    res.status(200).json({
        success: true,
        count: events.length,
        total,
        pages: Math.ceil(total / limit),
        currentPage: Number(page),
        data: events
    });
});