import mongoose, { Schema } from "mongoose";

const MentorshipSchema = new Schema({
    mentorId: {
        type: Schema.Types.ObjectId,
        ref: 'Alumni',
        required: true
    },
    menteeId: {
        type: Schema.Types.ObjectId,
        ref: 'Alumni',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'declined', 'active', 'completed'],
        default: 'pending'
    },
    requestMessage: {
        type: String,
        trim: true
    },
    areas: [String],
    requestedAt: {
        type: Date,
        default: Date.now
    },
    acceptedAt: Date,
    completedAt: Date
}, { timestamps: true });

export const Mentorship = mongoose.model("Mentorship", MentorshipSchema);