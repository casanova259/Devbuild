import mongoose, { Schema } from "mongoose";

const MessageSchema = new Schema({
    senderId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiverId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: [true, 'Message content cannot be empty'],
        trim: true
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// Index for faster queries
MessageSchema.index({ senderId: 1, receiverId: 1 });

export const Message = mongoose.model("Message", MessageSchema);