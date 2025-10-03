import mongoose, { Schema } from "mongoose";

const DonationSchema = new Schema({
    donorId: {
        type: Schema.Types.ObjectId,
        ref: 'Alumni',
        required: true
    },
    amount: {
        type: Number,
        required: [true, 'Please provide donation amount'],
        min: 1
    },
    purpose: {
        type: String,
        required: [true, 'Please specify donation purpose'],
        enum: ['scholarship', 'infrastructure', 'research', 'general', 'other']
    },
    isAnonymous: {
        type: Boolean,
        default: false
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    transactionId: String,
    receiptUrl: String,
    donatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

export const Donation = mongoose.model("Donation", DonationSchema);