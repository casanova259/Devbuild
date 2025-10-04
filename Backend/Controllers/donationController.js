import asyncHandler from '../utils/asyncHandler.js';
import { Donation } from '../models/Donation.js';
import { Alumni } from '../models/Alumni.js';

// @desc    Make a donation
// @route   POST /api/donations
// @access  Private
export const makeDonation = asyncHandler(async (req, res) => {
    const { amount, purpose, isAnonymous } = req.body;
    
    const alumni = await Alumni.findOne({ userId: req.user._id });
    if (!alumni) {
        return res.status(404).json({
            success: false,
            message: 'Alumni profile not found'
        });
    }

    const donation = await Donation.create({
        donorId: alumni._id,
        amount,
        purpose,
        isAnonymous: isAnonymous || false,
        paymentStatus: 'pending' // In real app, integrate with payment gateway
    });

    res.status(201).json({
        success: true,
        data: donation,
        message: 'Donation initiated successfully'
    });
});

// @desc    Get user's donation history
// @route   GET /api/donations/my-donations
// @access  Private
export const getMyDonations = asyncHandler(async (req, res) => {
    const alumni = await Alumni.findOne({ userId: req.user._id });
    if (!alumni) {
        return res.status(404).json({
            success: false,
            message: 'Alumni profile not found'
        });
    }

    const donations = await Donation.find({ donorId: alumni._id })
        .sort({ createdAt: -1 });

    const totalDonated = donations
        .filter(d => d.paymentStatus === 'completed')
        .reduce((sum, d) => sum + d.amount, 0);

    res.status(200).json({
        success: true,
        count: donations.length,
        totalDonated,
        data: donations
    });
});

// @desc    Get all donations (Admin only)
// @route   GET /api/donations/all
// @access  Private (Admin)
export const getAllDonations = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, purpose, paymentStatus } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    
    if (purpose) {
        query.purpose = purpose;
    }

    if (paymentStatus) {
        query.paymentStatus = paymentStatus;
    }

    const donations = await Donation.find(query)
        .populate({
            path: 'donorId',
            select: 'fullName profilePicture batchYear',
            match: { isAnonymous: false }
        })
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 });

    const total = await Donation.countDocuments(query);

    res.status(200).json({
        success: true,
        count: donations.length,
        total,
        data: donations
    });
});

// @desc    Get donation statistics (Admin only)
// @route   GET /api/donations/stats
// @access  Private (Admin)
export const getDonationStats = asyncHandler(async (req, res) => {
    const totalDonations = await Donation.countDocuments({ paymentStatus: 'completed' });
    
    const totalAmount = await Donation.aggregate([
        { $match: { paymentStatus: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const donationsByPurpose = await Donation.aggregate([
        { $match: { paymentStatus: 'completed' } },
        { $group: { _id: '$purpose', count: { $sum: 1 }, amount: { $sum: '$amount' } } }
    ]);

    const topDonors = await Donation.aggregate([
        { $match: { paymentStatus: 'completed', isAnonymous: false } },
        { $group: { _id: '$donorId', totalAmount: { $sum: '$amount' }, count: { $sum: 1 } } },
        { $sort: { totalAmount: -1 } },
        { $limit: 10 },
        { $lookup: { from: 'alumni', localField: '_id', foreignField: '_id', as: 'donor' } }
    ]);

    res.status(200).json({
        success: true,
        data: {
            totalDonations,
            totalAmount: totalAmount[0]?.total || 0,
            donationsByPurpose,
            topDonors
        }
    });
});

// @desc    Get top donors leaderboard
// @route   GET /api/donations/top-donors
// @access  Private
export const getTopDonors = asyncHandler(async (req, res) => {
    const { limit = 10 } = req.query;

    const topDonors = await Donation.aggregate([
        { $match: { paymentStatus: 'completed', isAnonymous: false } },
        { $group: { _id: '$donorId', totalAmount: { $sum: '$amount' } } },
        { $sort: { totalAmount: -1 } },
        { $limit: Number(limit) },
        { 
            $lookup: { 
                from: 'alumni', 
                localField: '_id', 
                foreignField: '_id', 
                as: 'donor',
                pipeline: [
                    { $project: { fullName: 1, profilePicture: 1, batchYear: 1, currentCompany: 1 } }
                ]
            } 
        },
        { $unwind: '$donor' }
    ]);

    res.status(200).json({
        success: true,
        count: topDonors.length,
        data: topDonors
    });
});