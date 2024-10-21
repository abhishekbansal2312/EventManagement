const express = require('express');
const reviewController = require('../controllers/reviewController'); // Adjust the path to your controller

const router = express.Router();
const authenticateToken = require("../middlewares/verifyToken");
const authenticateAdmin = require("../middlewares/authenticateAdmin");


// Create a new review
router.post('/',authenticateToken, reviewController.createReview);

// Get all reviews
router.get('/', reviewController.getAllReviews);


// Like a review
router.post('/:id/like',authenticateToken, reviewController.likeReview);

// Dislike a review
router.post('/:id/dislike',authenticateToken, reviewController.dislikeReview);

// Approve a review (Admin functionality)
router.patch('/:id/approve',authenticateAdmin, reviewController.approveReview);


router.patch('/:id/disapprove',authenticateAdmin, reviewController.disapproveReview);

// Delete a review
router.delete('/:id',authenticateAdmin, reviewController.deleteReview);

module.exports = router;
