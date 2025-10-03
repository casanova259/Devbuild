import mongoose, { Schema } from "mongoose";

const AnnouncementSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Please provide announcement title'],
        trim: true
    },
    content: {
        type: String,
        required: [true, 'Please provide announcement content']
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    targetAudience: {
        type: String,
        enum: ['all', 'filtered'],
        default: 'all'
    },
    filters: {
        batchYears: [Number],
        industries: [String],
        locations: [String]
    }
}, { timestamps: true });

export const Announcement = mongoose.model("Announcement", AnnouncementSchema);