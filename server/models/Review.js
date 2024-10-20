const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // Reference to User model
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true,
        minlength: 1, // Ensure at least one character
        maxlength: 500 // Limit comment length to prevent overly long comments
    },
    approved: {
        type: Boolean,
        default: false // Reviews are initially not approved
    },
    likes: {
        type: Number,
        default: 0
    },
    dislikedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Reference to User model; changed from 'Student' to 'User'
    }],
    likedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Reference to User model; changed from 'Student' to 'User'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Review', reviewSchema);
