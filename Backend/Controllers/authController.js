import asyncHandler from '../utils/asyncHandler.js';
import { User } from '../models/User.js';
import { Alumni } from '../models/Alumni.js';
import sendEmail from '../utils/sendEmail.js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req, res) => {
    const { email, password, fullName, batchYear, degree } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({
            success: false,
            message: 'User already exists'
        });
    }

    // Create user
    const user = await User.create({
        email,
        password,
        role: 'alumni'
    });

    // Create alumni profile
    await Alumni.create({
        userId: user._id,
        fullName,
        batchYear,
        degree
    });

    // Generate verification token
    const verificationToken = user.generateVerificationToken();
    await user.save();

    // Create verification URL
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

    // Email message
    const message = `
        <h2>Alumni Network - Email Verification</h2>
        <p>Please click the link below to verify your email address:</p>
        <a href="${verificationUrl}" target="_blank">Verify Email</a>
        <p>This link will expire in 24 hours.</p>
    `;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Alumni Network - Verify Your Email',
            message
        });

        res.status(201).json({
            success: true,
            message: 'User registered successfully. Please check your email to verify your account.'
        });
    } catch (error) {
        user.verificationToken = undefined;
        user.verificationTokenExpire = undefined;
        await user.save();
        
        return res.status(500).json({
            success: false,
            message: 'Email could not be sent'
        });
    }
});

// @desc    Verify email
// @route   GET /api/auth/verify-email/:token
// @access  Public
export const verifyEmail = asyncHandler(async (req, res) => {
    const { token } = req.params;

    const user = await User.findOne({
        verificationToken: token,
        verificationTokenExpire: { $gt: Date.now() }
    });

    if (!user) {
        return res.status(400).json({
            success: false,
            message: 'Invalid or expired verification token'
        });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpire = undefined;
    await user.save();

    res.status(200).json({
        success: true,
        message: 'Email verified successfully'
    });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Check if user exists and get password
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.isPasswordCorrect(password))) {
        return res.status(401).json({
            success: false,
            message: 'Invalid credentials'
        });
    }

    // Check if email is verified
    if (!user.isVerified) {
        return res.status(401).json({
            success: false,
            message: 'Please verify your email before logging in'
        });
    }

    // Check if user is approved (for alumni)
    if (user.role === 'alumni' && !user.isApproved) {
        return res.status(401).json({
            success: false,
            message: 'Your account is pending approval from admin'
        });
    }

    // Generate tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Save refresh token to database
    user.refreshToken = refreshToken;
    await user.save();

    // Get user profile data
    let profileData = null;
    if (user.role === 'alumni') {
        profileData = await Alumni.findOne({ userId: user._id });
    }

    res.status(200).json({
        success: true,
        data: {
            user: {
                _id: user._id,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified,
                isApproved: user.isApproved
            },
            profile: profileData,
            accessToken,
            refreshToken
        }
    });
});

// @desc    Refresh access token
// @route   POST /api/auth/refresh-token
// @access  Public
export const refreshToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({
            success: false,
            message: 'Refresh token is required'
        });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decoded._id);

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(401).json({
                success: false,
                message: 'Invalid refresh token'
            });
        }

        const newAccessToken = user.generateAccessToken();

        res.status(200).json({
            success: true,
            data: {
                accessToken: newAccessToken
            }
        });
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid refresh token'
        });
    }
});

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }

    // Generate reset token
    const resetToken = user.generateResetPasswordToken();
    await user.save();

    // Create reset URL
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    const message = `
        <h2>Alumni Network - Password Reset</h2>
        <p>You have requested a password reset. Please click the link below:</p>
        <a href="${resetUrl}" target="_blank">Reset Password</a>
        <p>This link will expire in 30 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
    `;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Alumni Network - Password Reset',
            message
        });

        res.status(200).json({
            success: true,
            message: 'Email sent with password reset instructions'
        });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        return res.status(500).json({
            success: false,
            message: 'Email could not be sent'
        });
    }
});

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:resettoken
// @access  Public
export const resetPassword = asyncHandler(async (req, res) => {
    const { resettoken } = req.params;
    const { password } = req.body;

    // Get hashed token
    const resetPasswordToken = crypto.createHash('sha256').update(resettoken).digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
        return res.status(400).json({
            success: false,
            message: 'Invalid or expired reset token'
        });
    }

    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    user.refreshToken = undefined; // Invalidate refresh token
    await user.save();

    res.status(200).json({
        success: true,
        message: 'Password reset successful'
    });
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
    let profileData = null;
    if (req.user.role === 'alumni') {
        profileData = await Alumni.findOne({ userId: req.user._id });
    }

    res.status(200).json({
        success: true,
        data: {
            user: req.user,
            profile: profileData
        }
    });
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    user.refreshToken = undefined;
    await user.save();

    res.status(200).json({
        success: true,
        message: 'Logged out successfully'
    });
});

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');

    // Check current password
    if (!(await user.isPasswordCorrect(currentPassword))) {
        return res.status(400).json({
            success: false,
            message: 'Current password is incorrect'
        });
    }

    user.password = newPassword;
    user.refreshToken = undefined; // Invalidate refresh token
    await user.save();

    res.status(200).json({
        success: true,
        message: 'Password changed successfully'
    });
});