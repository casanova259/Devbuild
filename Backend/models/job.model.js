import mongoose, { Schema } from "mongoose";

const JobSchema = new Schema({
    postedBy: {
        type: Schema.Types.ObjectId,
        ref: 'Alumni',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Please provide job title'],
        trim: true
    },
    company: {
        type: String,
        required: [true, 'Please provide company name']
    },
    location: String,
    jobType: {
        type: String,
        enum: ['full-time', 'part-time', 'internship', 'contract'],
        required: true
    },
    description: {
        type: String,
        required: [true, 'Please provide job description']
    },
    requirements: String,
    applicationLink: String,
    isActive: {
        type: Boolean,
        default: true
    },
    postedAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: Date
}, { timestamps: true });

export const Job = mongoose.model("Job", JobSchema);