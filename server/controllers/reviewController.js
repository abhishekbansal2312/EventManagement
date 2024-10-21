const Review = require("../models/Review"); // Adjust the path to your Review model
const mongoose = require("mongoose"); // Ensure you import mongoos

exports.createReview = async (req, res) => {
  const { studentId, title, rating, comment } = req.body;

  // Validate input fields
  if (!studentId || !rating || !comment) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Validate that studentId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    return res.status(400).json({ message: "Invalid student ID format" });
  }

  try {
    // Create a new review
    const review = new Review({ studentId, title, rating, comment });
    await review.save();

    // Populate the student details after saving the review
    const populatedReview = await Review.findById(review._id).populate(
      "studentId",
      "name"
    );

    // Return the populated review with student details
    res.status(201).json(populatedReview);
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update getAllReviews to include title
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().populate("studentId", "name");
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Like a review
exports.likeReview = async (req, res) => {
    const { studentId } = req.body;
    const { id } = req.params;
  
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid review ID" });
    }
  
    try {
      const review = await Review.findById(id);
      if (!review) return res.status(404).json({ message: "Review not found" });
  
      // Check if the student has already liked the review
      if (review.likedBy.includes(studentId)) {
        return res.status(400).json({ message: "You have already liked this review" });
      }
  
      // Remove from dislikedBy if exists
      if (review.dislikedBy.includes(studentId)) {
        review.dislikedBy.pull(studentId);
        review.dislikes -= 1;
      }
  
      // Add to likedBy and increment likes
      review.likedBy.push(studentId);
      review.likes += 1;
      await review.save();
  
      // Populate the student details in the updated review
      const populatedReview = await Review.findById(review._id).populate("studentId", "name");
  
      res.status(200).json(populatedReview);
    } catch (error) {
      console.error("Error liking review:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };

  exports.dislikeReview = async (req, res) => {
    const { studentId } = req.body;
    const { id } = req.params;
  
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid review ID" });
    }
  
    try {
      const review = await Review.findById(id);
      if (!review) return res.status(404).json({ message: "Review not found" });
  
      // Check if the student has already disliked the review
      if (review.dislikedBy.includes(studentId)) {
        return res.status(400).json({ message: "You have already disliked this review" });
      }
  
      // Remove from likedBy if exists
      if (review.likedBy.includes(studentId)) {
        review.likedBy.pull(studentId);
        review.likes -= 1;
      }
  
      // Add to dislikedBy and increment dislikes
      review.dislikedBy.push(studentId);
      review.dislikes += 1;
      await review.save();
  
      // Populate the student details in the updated review
      const populatedReview = await Review.findById(review._id).populate("studentId", "name");
  
      res.status(200).json(populatedReview);
    } catch (error) {
      console.error("Error disliking review:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };

  exports.approveReview = async (req, res) => {
    const { id } = req.params;
  
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid review ID" });
    }
  
    try {
      // Approve the review
      const review = await Review.findByIdAndUpdate(
        id,
        { approved: true },
        { new: true }
      );
  
      if (!review) {
        return res.status(404).json({ message: "Review not found" });
      }
  
      // Populate the studentId field with student details
      const populatedReview = await Review.findById(review._id).populate("studentId", "name");
  
      res.status(200).json(populatedReview);
    } catch (error) {
      console.error("Error approving review:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  

  exports.disapproveReview = async (req, res) => {
    const { id } = req.params;
  
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid review ID" });
    }
  
    try {
      // Disapprove the review
      const review = await Review.findByIdAndUpdate(
        id,
        { approved: false },
        { new: true }
      );
  
      if (!review) {
        return res.status(404).json({ message: "Review not found" });
      }
  
      // Populate the studentId field with student details
      const populatedReview = await Review.findById(review._id).populate("studentId", "name");
  
      res.status(200).json(populatedReview);
    } catch (error) {
      console.error("Error disapproving review:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  
// Delete a review
exports.deleteReview = async (req, res) => {
  const { id } = req.params;

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid review ID" });
  }

  try {
    const review = await Review.findByIdAndDelete(id);
    if (!review) return res.status(404).json({ message: "Review not found" });

    res.status(204).send(); // No content
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
