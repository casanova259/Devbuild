import mongoose, { Schema } from "mongoose";

const NotificationSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['event', 'announcement', 'message', 'mentorship', 'donation', 'profile'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    link: String,
    isRead: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// Index for faster queries
NotificationSchema.index({ userId: 1, isRead: 1 });

export const Notification = mongoose.model("Notification", NotificationSchema);