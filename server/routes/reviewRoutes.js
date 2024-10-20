const express = require('express');
const reviewController = require('../controllers/reviewController'); // Adjust the path to your controller

const router = express.Router();

// Create a new review
router.post('/', reviewController.createReview);

// Get all reviews
router.get('/', reviewController.getAllReviews);


// Like a review
router.post('/:id/like', reviewController.likeReview);

// Dislike a review
router.post('/:id/dislike', reviewController.dislikeReview);

// Approve a review (Admin functionality)
router.patch('/:id/approve', reviewController.approveReview);


router.patch('/:id/disapprove', reviewController.disapproveReview);

// Delete a review
router.delete('/:id', reviewController.deleteReview);

module.exports = router;
