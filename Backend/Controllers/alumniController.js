import asyncHandler from '../utils/asyncHandler.js';
import { Alumni } from '../models/Alumni.js';
import { User } from '../models/User.js';
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';

// @desc    Get all alumni with search and filters
// @route   GET /api/alumni
// @access  Private
export const getAllAlumni = asyncHandler(async (req, res) => {
    const {
        search,
        batchYear,
        industry,
        city,
        country,
        availableForMentorship,
        willingToHire,
        page = 1,
        limit = 10
    } = req.query;

    // Build query object
    let query = {};
    
    // Text search across multiple fields
    if (search) {
        query.$text = { $search: search };
    }

    // Filter by batch year
    if (batchYear) {
        query.batchYear = batchYear;
    }

    // Filter by industry
    if (industry) {
        query.industry = { $regex: industry, $options: 'i' };
    }

    // Filter by city
    if (city) {
        query.currentCity = { $regex: city, $options: 'i' };
    }

    // Filter by country
    if (country) {
        query.currentCountry = { $regex: country, $options: 'i' };
    }

    // Filter by mentorship availability
    if (availableForMentorship !== undefined) {
        query.availableForMentorship = availableForMentorship === 'true';
    }

    // Filter by hiring willingness
    if (willingToHire !== undefined) {
        query.willingToHire = willingToHire === 'true';
    }

    // Pagination
    const skip = (page - 1) * limit;

    // Execute query
    const alumni = await Alumni.find(query)
        .populate('userId', 'email isVerified isApproved')
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 });

    // Get total count for pagination
    const total = await Alumni.countDocuments(query);

    res.status(200).json({
        success: true,
        count: alumni.length,
        total,
        pages: Math.ceil(total / limit),
        currentPage: Number(page),
        data: alumni
    });
});

// @desc    Get single alumni by ID
// @route   GET /api/alumni/:id
// @access  Private
export const getAlumniById = asyncHandler(async (req, res) => {
    const alumni = await Alumni.findById(req.params.id)
        .populate('userId', 'email role isVerified isApproved');

    if (!alumni) {
        return res.status(404).json({
            success: false,
            message: 'Alumni not found'
        });
    }

    res.status(200).json({
        success: true,
        data: alumni
    });
});

// @desc    Get current user's alumni profile
// @route   GET /api/alumni/profile/me
// @access  Private
export const getMyProfile = asyncHandler(async (req, res) => {
    const alumni = await Alumni.findOne({ userId: req.user._id })
        .populate('userId', 'email role isVerified isApproved');

    if (!alumni) {
        return res.status(404).json({
            success: false,
            message: 'Alumni profile not found'
        });
    }

    res.status(200).json({
        success: true,
        data: alumni
    });
});

// @desc    Update current user's alumni profile
// @route   PUT /api/alumni/profile/me
// @access  Private
export const updateMyProfile = asyncHandler(async (req, res) => {
    const updateData = { ...req.body };
    
    // Remove fields that shouldn't be updated directly
    delete updateData.userId;
    delete updateData._id;

    const alumni = await Alumni.findOneAndUpdate(
        { userId: req.user._id },
        updateData,
        { new: true, runValidators: true }
    ).populate('userId', 'email role isVerified isApproved');

    if (!alumni) {
        return res.status(404).json({
            success: false,
            message: 'Alumni profile not found'
        });
    }

    res.status(200).json({
        success: true,
        data: alumni,
        message: 'Profile updated successfully'
    });
});

// @desc    Upload profile picture
// @route   POST /api/alumni/profile/upload-picture
// @access  Private
export const uploadProfilePicture = asyncHandler(async (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: 'Please upload an image'
        });
    }

    try {
        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'alumni_profiles',
            width: 500,
            height: 500,
            crop: 'fill'
        });

        // Update alumni profile with new image URL
        const alumni = await Alumni.findOneAndUpdate(
            { userId: req.user._id },
            { profilePicture: result.secure_url },
            { new: true }
        );

        // Delete local file
        fs.unlinkSync(req.file.path);

        res.status(200).json({
            success: true,
            data: {
                profilePicture: result.secure_url
            },
            message: 'Profile picture uploaded successfully'
        });
    } catch (error) {
        // Delete local file in case of error
        if (req.file && req.file.path) {
            fs.unlinkSync(req.file.path);
        }
        
        return res.status(500).json({
            success: false,
            message: 'Error uploading image'
        });
    }
});

// @desc    Delete profile picture
// @route   DELETE /api/alumni/profile/delete-picture
// @access  Private
export const deleteProfilePicture = asyncHandler(async (req, res) => {
    const alumni = await Alumni.findOneAndUpdate(
        { userId: req.user._id },
        { profilePicture: 'default-avatar.jpg' },
        { new: true }
    );

    res.status(200).json({
        success: true,
        message: 'Profile picture deleted successfully'
    });
});

// @desc    Advanced search alumni
// @route   POST /api/alumni/search
// @access  Private
export const searchAlumni = asyncHandler(async (req, res) => {
    const {
        keywords,
        batchYears,
        industries,
        locations,
        skills,
        availableForMentorship,
        willingToHire,
        page = 1,
        limit = 10
    } = req.body;

    let query = {};
    let aggregatePipeline = [];

    // Text search
    if (keywords) {
        query.$text = { $search: keywords };
    }

    // Filter by multiple batch years
    if (batchYears && batchYears.length > 0) {
        query.batchYear = { $in: batchYears };
    }

    // Filter by multiple industries
    if (industries && industries.length > 0) {
        query.industry = { $in: industries.map(ind => new RegExp(ind, 'i')) };
    }

    // Filter by skills
    if (skills && skills.length > 0) {
        query.skills = { $in: skills.map(skill => new RegExp(skill, 'i')) };
    }

    // Location-based search (city or country)
    if (locations && locations.length > 0) {
        const locationQuery = locations.map(loc => ([
            { currentCity: { $regex: loc, $options: 'i' } },
            { currentCountry: { $regex: loc, $options: 'i' } }
        ])).flat();
        
        query.$or = locationQuery;
    }

    // Mentorship and hiring filters
    if (availableForMentorship !== undefined) {
        query.availableForMentorship = availableForMentorship;
    }

    if (willingToHire !== undefined) {
        query.willingToHire = willingToHire;
    }

    // Pagination
    const skip = (page - 1) * limit;

    const alumni = await Alumni.find(query)
        .populate('userId', 'email isVerified isApproved')
        .skip(skip)
        .limit(Number(limit))
        .sort(keywords ? { score: { $meta: 'textScore' } } : { createdAt: -1 });

    const total = await Alumni.countDocuments(query);

    res.status(200).json({
        success: true,
        count: alumni.length,
        total,
        pages: Math.ceil(total / limit),
        currentPage: Number(page),
        data: alumni
    });
});

// @desc    Get alumni by batch year
// @route   GET /api/alumni/batch/:year
// @access  Private
export const getAlumniByBatch = asyncHandler(async (req, res) => {
    const { year } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    const alumni = await Alumni.find({ batchYear: year })
        .populate('userId', 'email isVerified isApproved')
        .skip(skip)
        .limit(Number(limit))
        .sort({ fullName: 1 });

    const total = await Alumni.countDocuments({ batchYear: year });

    res.status(200).json({
        success: true,
        count: alumni.length,
        total,
        pages: Math.ceil(total / limit),
        currentPage: Number(page),
        data: alumni
    });
});

// @desc    Get alumni by industry
// @route   GET /api/alumni/industry/:industry
// @access  Private
export const getAlumniByIndustry = asyncHandler(async (req, res) => {
    const { industry } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    const alumni = await Alumni.find({ 
        industry: { $regex: industry, $options: 'i' }
    })
        .populate('userId', 'email isVerified isApproved')
        .skip(skip)
        .limit(Number(limit))
        .sort({ fullName: 1 });

    const total = await Alumni.countDocuments({ 
        industry: { $regex: industry, $options: 'i' }
    });

    res.status(200).json({
        success: true,
        count: alumni.length,
        total,
        pages: Math.ceil(total / limit),
        currentPage: Number(page),
        data: alumni
    });
});