import asyncHandler from '../utils/asyncHandler.js';
import { Mentorship } from '../models/Mentorship.js';
import { Alumni } from '../models/Alumni.js';

// @desc    Request mentorship from a mentor
// @route   POST /api/mentorship/request
// @access  Private
export const requestMentorship = asyncHandler(async (req, res) => {
    const { mentorId, requestMessage, areas } = req.body;
    
    const mentee = await Alumni.findOne({ userId: req.user._id });
    if (!mentee) {
        return res.status(404).json({
            success: false,
            message: 'Mentee profile not found'
        });
    }

    const mentorship = await Mentorship.create({
        mentorId,
        menteeId: mentee._id,
        requestMessage,
        areas
    });

    res.status(201).json({
        success: true,
        data: mentorship,
        message: 'Mentorship request sent successfully'
    });
});

// @desc    Get available mentors
// @route   GET /api/mentorship/mentors
// @access  Private
export const getAvailableMentors = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, industry, skills } = req.query;
    const skip = (page - 1) * limit;

    let query = { availableForMentorship: true };

    if (industry) {
        query.industry = { $regex: industry, $options: 'i' };
    }

    if (skills) {
        const skillsArray = skills.split(',');
        query.skills = { $in: skillsArray };
    }

    const mentors = await Alumni.find(query)
        .populate('userId', 'email')
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 });

    const total = await Alumni.countDocuments(query);

    res.status(200).json({
        success: true,
        count: mentors.length,
        total,
        data: mentors
    });
});

// @desc    Get mentorship requests (for mentors)
// @route   GET /api/mentorship/requests
// @access  Private
export const getMyMentorshipRequests = asyncHandler(async (req, res) => {
    const mentor = await Alumni.findOne({ userId: req.user._id });
    if (!mentor) {
        return res.status(404).json({
            success: false,
            message: 'Mentor profile not found'
        });
    }

    const requests = await Mentorship.find({ mentorId: mentor._id })
        .populate('menteeId', 'fullName profilePicture batchYear currentCompany')
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: requests.length,
        data: requests
    });
});

// @desc    Respond to mentorship request
// @route   PUT /api/mentorship/:id/respond
// @access  Private
export const respondToRequest = asyncHandler(async (req, res) => {
    const { status } = req.body; // 'accepted' or 'declined'
    
    const mentorship = await Mentorship.findByIdAndUpdate(
        req.params.id,
        { 
            status,
            ...(status === 'accepted' && { acceptedAt: new Date() })
        },
        { new: true }
    ).populate('menteeId', 'fullName profilePicture');

    if (!mentorship) {
        return res.status(404).json({
            success: false,
            message: 'Mentorship request not found'
        });
    }

    res.status(200).json({
        success: true,
        data: mentorship,
        message: `Mentorship request ${status}`
    });
});