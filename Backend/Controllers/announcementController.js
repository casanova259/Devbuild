import asyncHandler from '../utils/asyncHandler.js';
import { Announcement } from '../models/Announcement.js';
import { Alumni } from '../models/Alumni.js';

// @desc    Create announcement (Admin only)
// @route   POST /api/announcements
// @access  Private (Admin)
export const createAnnouncement = asyncHandler(async (req, res) => {
    const announcementData = {
        ...req.body,
        createdBy: req.user._id
    };

    const announcement = await Announcement.create(announcementData);

    res.status(201).json({
        success: true,
        data: announcement,
        message: 'Announcement created successfully'
    });
});

// @desc    Get all announcements
// @route   GET /api/announcements
// @access  Private
export const getAllAnnouncements = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const announcements = await Announcement.find()
        .populate('createdBy', 'email role')
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 });

    const total = await Announcement.countDocuments();

    res.status(200).json({
        success: true,
        count: announcements.length,
        total,
        pages: Math.ceil(total / limit),
        currentPage: Number(page),
        data: announcements
    });
});

// @desc    Get single announcement
// @route   GET /api/announcements/:id
// @access  Private
export const getAnnouncementById = asyncHandler(async (req, res) => {
    const announcement = await Announcement.findById(req.params.id)
        .populate('createdBy', 'email role');

    if (!announcement) {
        return res.status(404).json({
            success: false,
            message: 'Announcement not found'
        });
    }

    res.status(200).json({
        success: true,
        data: announcement
    });
});

// @desc    Delete announcement (Admin only)
// @route   DELETE /api/announcements/:id
// @access  Private (Admin)
export const deleteAnnouncement = asyncHandler(async (req, res) => {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
        return res.status(404).json({
            success: false,
            message: 'Announcement not found'
        });
    }

    await Announcement.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        message: 'Announcement deleted successfully'
    });
});

// @desc    Get announcements for current user (filtered)
// @route   GET /api/announcements/my-announcements
// @access  Private
export const getMyAnnouncements = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    // Get user's alumni profile
    const alumni = await Alumni.findOne({ userId: req.user._id });
    
    let query = {
        $or: [
            { targetAudience: 'all' },
            {
                targetAudience: 'filtered',
                $or: [
                    { 'filters.batchYears': { $in: [alumni?.batchYear] } },
                    { 'filters.industries': { $in: [alumni?.industry] } },
                    { 'filters.locations': { $in: [alumni?.currentCity, alumni?.currentCountry] } }
                ]
            }
        ]
    };

    const announcements = await Announcement.find(query)
        .populate('createdBy', 'email role')
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 });

    const total = await Announcement.countDocuments(query);

    res.status(200).json({
        success: true,
        count: announcements.length,
        total,
        pages: Math.ceil(total / limit),
        currentPage: Number(page),
        data: announcements
    });
});