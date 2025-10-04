import asyncHandler from '../utils/asyncHandler.js';
import { Message } from '../models/Message.js';
import { Alumni } from '../models/Alumni.js';

// @desc    Send message to another user
// @route   POST /api/messages
// @access  Private
export const sendMessage = asyncHandler(async (req, res) => {
    const { receiverId, content } = req.body;

    const message = await Message.create({
        senderId: req.user._id,
        receiverId,
        content
    });

    const populatedMessage = await Message.findById(message._id)
        .populate('senderId', 'email')
        .populate('receiverId', 'email');

    res.status(201).json({
        success: true,
        data: populatedMessage,
        message: 'Message sent successfully'
    });
});

// @desc    Get all messages for current user
// @route   GET /api/messages
// @access  Private
export const getMyMessages = asyncHandler(async (req, res) => {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const messages = await Message.find({
        $or: [
            { senderId: req.user._id },
            { receiverId: req.user._id }
        ]
    })
        .populate('senderId', 'email')
        .populate('receiverId', 'email')
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: messages.length,
        data: messages
    });
});

// @desc    Get conversation between two users
// @route   GET /api/messages/conversation/:userId
// @access  Private
export const getConversation = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const messages = await Message.find({
        $or: [
            { senderId: req.user._id, receiverId: userId },
            { senderId: userId, receiverId: req.user._id }
        ]
    })
        .populate('senderId', 'email')
        .populate('receiverId', 'email')
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: 1 });

    // Mark messages as read
    await Message.updateMany(
        { senderId: userId, receiverId: req.user._id, isRead: false },
        { isRead: true }
    );

    res.status(200).json({
        success: true,
        count: messages.length,
        data: messages
    });
});

// @desc    Mark message as read
// @route   PUT /api/messages/:id/read
// @access  Private
export const markAsRead = asyncHandler(async (req, res) => {
    const message = await Message.findOneAndUpdate(
        { _id: req.params.id, receiverId: req.user._id },
        { isRead: true },
        { new: true }
    );

    if (!message) {
        return res.status(404).json({
            success: false,
            message: 'Message not found'
        });
    }

    res.status(200).json({
        success: true,
        message: 'Message marked as read'
    });
});

// @desc    Delete message
// @route   DELETE /api/messages/:id
// @access  Private
export const deleteMessage = asyncHandler(async (req, res) => {
    const message = await Message.findOneAndDelete({
        _id: req.params.id,
        $or: [
            { senderId: req.user._id },
            { receiverId: req.user._id }
        ]
    });

    if (!message) {
        return res.status(404).json({
            success: false,
            message: 'Message not found'
        });
    }

    res.status(200).json({
        success: true,
        message: 'Message deleted successfully'
    });
});

// @desc    Get unread message count
// @route   GET /api/messages/unread-count
// @access  Private
export const getUnreadCount = asyncHandler(async (req, res) => {
    const count = await Message.countDocuments({
        receiverId: req.user._id,
        isRead: false
    });

    res.status(200).json({
        success: true,
        data: { unreadCount: count }
    });
});