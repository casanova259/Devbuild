import asyncHandler from '../utils/asyncHandler.js';
import { User } from '../models/User.js';
import { Alumni } from '../models/Alumni.js';
import { Event } from '../models/Event.js';
import { Donation } from '../models/Donation.js';

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard-stats
// @access  Private (Admin)
export const getDashboardStats = asyncHandler(async (req, res) => {
    const totalUsers = await User.countDocuments();
    const totalAlumni = await Alumni.countDocuments();
    const approvedAlumni = await User.countDocuments({ role: 'alumni', isApproved: true });
    const pendingApprovals = await User.countDocuments({ role: 'alumni', isApproved: false, isVerified: true });
    const totalEvents = await Event.countDocuments();
    const upcomingEvents = await Event.countDocuments({ eventDate: { $gte: new Date() } });
    const totalDonations = await Donation.countDocuments({ paymentStatus: 'completed' });
    const totalDonationAmount = await Donation.aggregate([
        { $match: { paymentStatus: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const recentRegistrations = await Alumni.find()
        .populate('userId', 'email createdAt')
        .sort({ createdAt: -1 })
        .limit(5);

    res.status(200).json({
        success: true,
        data: {
            stats: {
                totalUsers,
                totalAlumni,
                approvedAlumni,
                pendingApprovals,
                totalEvents,
                upcomingEvents,
                totalDonations,
                totalDonationAmount: totalDonationAmount[0]?.total || 0
            },
            recentRegistrations
        }
    });
});

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
export const getAllUsers = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, role, isApproved } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    
    if (role) {
        query.role = role;
    }

    if (isApproved !== undefined) {
        query.isApproved = isApproved === 'true';
    }

    const users = await User.find(query)
        .select('-password -refreshToken')
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.status(200).json({
        success: true,
        count: users.length,
        total,
        data: users
    });
});

// @desc    Approve user registration
// @route   PUT /api/admin/users/:id/approve
// @access  Private (Admin)
export const approveUser = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndUpdate(
        req.params.id,
        { isApproved: true },
        { new: true }
    ).select('-password -refreshToken');

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }

    res.status(200).json({
        success: true,
        data: user,
        message: 'User approved successfully'
    });
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
export const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }

    // Delete associated alumni profile if exists
    await Alumni.findOneAndDelete({ userId: req.params.id });
    
    // Delete user
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        message: 'User deleted successfully'
    });
});