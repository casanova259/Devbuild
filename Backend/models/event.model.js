import mongoose, { Schema } from "mongoose";

const EventSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Please provide event title'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please provide event description']
    },
    eventDate: {
        type: Date,
        required: [true, 'Please provide event date']
    },
    eventTime: String,
    location: {
        type: String,
        required: [true, 'Please provide event location']
    },
    eventType: {
        type: String,
        enum: ['reunion', 'webinar', 'networking', 'workshop', 'other'],
        default: 'other'
    },
    bannerImage: String,
    maxAttendees: Number,
    registrationDeadline: Date,
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    attendees: [{
        alumniId: {
            type: Schema.Types.ObjectId,
            ref: 'Alumni'
        },
        status: {
            type: String,
            enum: ['going', 'maybe', 'not-going'],
            default: 'going'
        },
        registeredAt: {
            type: Date,
            default: Date.now
        }
    }]
}, { timestamps: true });

export const Event = mongoose.model("Event", EventSchema);