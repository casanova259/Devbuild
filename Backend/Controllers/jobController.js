import asyncHandler from '../utils/asyncHandler.js';
import { Job } from '../models/Job.js';
import { Alumni } from '../models/Alumni.js';

// @desc    Create job posting
// @route   POST /api/jobs
// @access  Private
export const createJob = asyncHandler(async (req, res) => {
    const alumni = await Alumni.findOne({ userId: req.user._id });
    if (!alumni) {
        return res.status(404).json({
            success: false,
            message: 'Alumni profile not found'
        });
    }

    const jobData = {
        ...req.body,
        postedBy: alumni._id
    };

    const job = await Job.create(jobData);

    res.status(201).json({
        success: true,
        data: job,
        message: 'Job posted successfully'
    });
});

// @desc    Get all active jobs
// @route   GET /api/jobs
// @access  Private
export const getAllJobs = asyncHandler(async (req, res) => {
    const { jobType, location, search, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    let query = { isActive: true };

    if (jobType) {
        query.jobType = jobType;
    }

    if (location) {
        query.location = { $regex: location, $options: 'i' };
    }

    if (search) {
        query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { company: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
        ];
    }

    const jobs = await Job.find(query)
        .populate('postedBy', 'fullName profilePicture currentCompany')
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 });

    const total = await Job.countDocuments(query);

    res.status(200).json({
        success: true,
        count: jobs.length,
        total,
        data: jobs
    });
});

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Private
export const getJobById = asyncHandler(async (req, res) => {
    const job = await Job.findById(req.params.id)
        .populate('postedBy', 'fullName profilePicture currentCompany jobTitle');

    if (!job) {
        return res.status(404).json({
            success: false,
            message: 'Job not found'
        });
    }

    res.status(200).json({
        success: true,
        data: job
    });
});

// @desc    Update job (owner only)
// @route   PUT /api/jobs/:id
// @access  Private
export const updateJob = asyncHandler(async (req, res) => {
    const alumni = await Alumni.findOne({ userId: req.user._id });
    
    let job = await Job.findById(req.params.id);

    if (!job) {
        return res.status(404).json({
            success: false,
            message: 'Job not found'
        });
    }

    // Check ownership
    if (job.postedBy.toString() !== alumni._id.toString()) {
        return res.status(403).json({
            success: false,
            message: 'Not authorized to update this job'
        });
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: job,
        message: 'Job updated successfully'
    });
});

// @desc    Delete job (owner/admin only)
// @route   DELETE /api/jobs/:id
// @access  Private
export const deleteJob = asyncHandler(async (req, res) => {
    const job = await Job.findById(req.params.id);

    if (!job) {
        return res.status(404).json({
            success: false,
            message: 'Job not found'
        });
    }

    await Job.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        message: 'Job deleted successfully'
    });
});

// @desc    Get jobs posted by current user
// @route   GET /api/jobs/my-jobs
// @access  Private
export const getMyJobs = asyncHandler(async (req, res) => {
    const alumni = await Alumni.findOne({ userId: req.user._id });
    if (!alumni) {
        return res.status(404).json({
            success: false,
            message: 'Alumni profile not found'
        });
    }

    const jobs = await Job.find({ postedBy: alumni._id })
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: jobs.length,
        data: jobs
    });
});