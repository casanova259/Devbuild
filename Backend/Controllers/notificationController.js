import asyncHandler from '../utils/asyncHandler.js';
import { Notification } from '../models/Notification.js';

// @desc    Get user's notifications
// @route   GET /api/notifications
// @access  Private
export const getMyNotifications = asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, isRead } = req.query;
    const skip = (page - 1) * limit;

    let query = { userId: req.user._id };
    
    if (isRead !== undefined) {
        query.isRead = isRead === 'true';
    }

    const notifications = await Notification.find(query)
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 });

    const total = await Notification.countDocuments(query);

    res.status(200).json({
        success: true,
        count: notifications.length,
        total,
        data: notifications
    });
});

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
export const markAsRead = asyncHandler(async (req, res) => {
    const notification = await Notification.findOneAndUpdate(
        { _id: req.params.id, userId: req.user._id },
        { isRead: true },
        { new: true }
    );

    if (!notification) {
        return res.status(404).json({
            success: false,
            message: 'Notification not found'
        });
    }

    res.status(200).json({
        success: true,
        message: 'Notification marked as read'
    });
});

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/mark-all-read
// @access  Private
export const markAllAsRead = asyncHandler(async (req, res) => {
    await Notification.updateMany(
        { userId: req.user._id, isRead: false },
        { isRead: true }
    );

    res.status(200).json({
        success: true,
        message: 'All notifications marked as read'
    });
});

// @desc    Get unread notification count
// @route   GET /api/notifications/unread-count
// @access  Private
export const getUnreadCount = asyncHandler(async (req, res) => {
    const count = await Notification.countDocuments({
        userId: req.user._id,
        isRead: false
    });

    res.status(200).json({
        success: true,
        data: { unreadCount: count }
    });
});