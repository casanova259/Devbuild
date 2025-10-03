import mongoose, { Schema } from "mongoose";

const AlumniSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fullName: {
        type: String,
        required: [true, 'Please provide full name'],
        trim: true,
        index: true
    },
    profilePicture: {
        type: String,
        default: 'default-profile.jpg'
    },
    phone: {
        type: String,
        trim: true
    },
    batchYear: {
        type: Number,
        required: [true, 'Please provide batch year'],
        index: true
    },
    degree: {
        type: String,
        required: [true, 'Please provide degree']
    },
    major: {
        type: String,
        trim: true
    },
    currentCity: {
        type: String,
        index: true
    },
    currentCountry: String,
    currentCompany: {
        type: String,
        index: true
    },
    jobTitle: String,
    industry: {
        type: String,
        index: true
    },
    linkedIn: String,
    skills: [String],
    workExperience: [{
        company: String,
        position: String,
        startDate: Date,
        endDate: Date,
        current: {
            type: Boolean,
            default: false
        },
        description: String
    }],
    availableForMentorship: {
        type: Boolean,
        default: false
    },
    mentorshipAreas: [String],
    willingToHire: {
        type: Boolean,
        default: false
    },
    openToNetworking: {
        type: Boolean,
        default: true
    },
    privacySettings: {
        showEmail: {
            type: Boolean,
            default: true
        },
        showPhone: {
            type: Boolean,
            default: false
        }
    }
}, { timestamps: true });

// Create text index for search
AlumniSchema.index({ 
    fullName: 'text', 
    currentCompany: 'text', 
    jobTitle: 'text',
    skills: 'text'
});

export const Alumni = mongoose.model("Alumni", AlumniSchema);