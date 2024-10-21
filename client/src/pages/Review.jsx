import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import ReviewItem from "../components/ReviewItem";
import ReviewForm from "../components/ReviewForm";

const Review = (darkMode) => {
  const [reviews, setReviews] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState(""); // Add state for student name
  const [error, setError] = useState(null);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingCounts, setRatingCounts] = useState({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  });
  const [isAdmin, setIsAdmin] = useState(false);

  const getStudentDetailsFromToken = () => {
    const token = Cookies.get("authtoken");
    if (token) {
      const decoded = jwtDecode(token);
      return decoded ? { id: decoded.id, name: decoded.name } : null; // Assuming the name is included in the token
    }
    return null;
  };

  const fetchReviews = async () => {
    try {
      const response = await fetch("http://localhost:4600/api/reviews", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to fetch reviews");
      const data = await response.json();
      setReviews(data);
      calculateAverageRating(data);
    } catch (error) {
      console.error("Error fetching reviews:", error.message);
      setError(error.message);
    }
  };

  const calculateAverageRating = (data) => {
    const approvedReviews = data.filter((review) => review.approved); // Filter approved reviews
    const totalRatings = approvedReviews.reduce((acc, review) => acc + review.rating, 0);
    const avgRating = (totalRatings / approvedReviews.length).toFixed(2) || 0;
    setAverageRating(avgRating);

    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    approvedReviews.forEach((review) => {
      counts[review.rating] = (counts[review.rating] || 0) + 1;
    });
    setRatingCounts(counts);
  };

  const handleSubmit = async (reviewData) => {
    const { rating, comment } = reviewData;

    try {
      const response = await fetch("http://localhost:4600/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ studentId, name: studentName, rating, comment }), // Include name
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to create review");
      const newReview = await response.json();
      setReviews((prevReviews) => [...prevReviews, newReview]);
      calculateAverageRating([...reviews, newReview]);
    } catch (error) {
      console.error("Error creating review:", error.message);
      setError(error.message);
    }
  };

  // Delete review function
  const handleDelete = async (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        const response = await fetch(`http://localhost:4600/api/reviews/${reviewId}`, {
          method: "DELETE",
          credentials: "include",
        });

        if (!response.ok) throw new Error("Failed to delete review");
        
        // Update state to remove deleted review
        setReviews((prevReviews) => prevReviews.filter((review) => review._id !== reviewId));
      } catch (error) {
        console.error("Error deleting review:", error.message);
        setError(error.message);
      }
    }
  };

  const handleLike = async (reviewId) => {
    try {
        const response = await fetch(`http://localhost:4600/api/reviews/${reviewId}/like`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ studentId }), // Ensure the correct studentId is sent
        });

        if (!response.ok) throw new Error('Failed to like review');
        const updatedReview = await response.json();
        // Update your reviews state here with the updatedReview
        setReviews((prevReviews) =>
          prevReviews.map((review) => 
            review._id === updatedReview._id ? updatedReview : review
          )
        );
    } catch (error) {
        console.error('Error liking review:', error);
    }
};

const handleDislike = async (reviewId) => {
    try {
        const response = await fetch(`http://localhost:4600/api/reviews/${reviewId}/dislike`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ studentId }), // Ensure the correct studentId is sent
        });

        if (!response.ok) throw new Error('Failed to dislike review');
        const updatedReview = await response.json();
        // Update your reviews state here with the updatedReview
        setReviews((prevReviews) =>
          prevReviews.map((review) => 
            review._id === updatedReview._id ? updatedReview : review
          )
        );
    } catch (error) {
        console.error('Error disliking review:', error);
    }
};

const handleApprove = async (reviewId) => {
    try {
        const response = await fetch(`http://localhost:4600/api/reviews/${reviewId}/approve`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) throw new Error('Failed to approve review');
        const updatedReview = await response.json();

        // Update the state with the new review data
        setReviews((prevReviews) =>
          prevReviews.map((review) => 
            review._id === updatedReview._id ? updatedReview : review
          )
        );
    } catch (error) {
        console.error('Error approving review:', error);
    }
};

const handleDisapprove = async (reviewId) => {
    try {
        const response = await fetch(`http://localhost:4600/api/reviews/${reviewId}/disapprove`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) throw new Error('Failed to disapprove review');
        const updatedReview = await response.json();

        // Update the state with the new review data
        setReviews((prevReviews) =>
            prevReviews.map((review) =>
                review._id === updatedReview._id ? updatedReview : review
            )
        );
    } catch (error) {
        console.error('Error disapproving review:', error);
    }
};

  useEffect(() => {
    const studentDetailsFromToken = getStudentDetailsFromToken();
    setStudentId(studentDetailsFromToken ? studentDetailsFromToken.id : "");
    setStudentName(studentDetailsFromToken ? studentDetailsFromToken.name : ""); // Set student name
    fetchReviews();

    const authtoken = Cookies.get("authtoken");
    if (authtoken) {
      const decodedToken = jwtDecode(authtoken);
      setIsAdmin(decodedToken.role === "admin");
    }
  }, []);

  return (
    <div className="container mx-auto p-8 rounded-lg flex flex-col bg-white w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* First Column: Two Rows */}
        <div className="flex flex-col gap-6">


          {/* Row 1: Average Rating Display */}
          <div className="p-6 rounded-lg shadow-sm flex flex-col justify-center items-center text-center bg-yellow-100">
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">Average Rating</h3>
            <div className="text-4xl font-bold text-yellow-500">{averageRating} / 5</div>

            {/* Display Total Number of Ratings */}
            <p className="text-gray-600 mt-2">
              {reviews.filter((review) => review.approved).length} Total Rating{reviews.filter((review) => review.approved).length !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Row 2: Average Rating Breakdown */}
          <div className="p-6 rounded-lg shadow-sm">
  <h3 className="text-xl font-semibold text-gray-800 mb-4">Average Rating Breakdown</h3>
  {/* Total Number of Ratings */}
  {[1, 2, 3, 4, 5].map((star) => (
    <div className="flex justify-between items-center mb-4" key={star}>
      <span className="text-gray-600">
        {star} Star{star > 1 ? 's' : ''}
        <span className="ml-1">{'⭐️'.repeat(star)}</span> {/* Displaying stars */}
      </span>
      <span className="text-gray-600">{ratingCounts[star] || 0}</span>
    </div>
  ))}
</div>



          
        </div>

        {/* Second Column: Review Form */}
        <div className="p-6 rounded-lg shadow-sm bg-gray-100">
          <ReviewForm onSubmit={handleSubmit} />
          {error && <p className="text-red-500">{error}</p>}
        </div>


      </div>



      {/* Review List */}
<div className="space-y-4">
  <h3 className="text-xl font-semibold text-gray-800 mb-4">Reviews</h3>
  {reviews.length > 0 ? (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* Using grid to create two columns */}
      {reviews
        .filter((review) => isAdmin || review.approved) // Only show approved reviews for regular users
        .map((review) => (
          <ReviewItem
            key={review._id}
            review={review}
            isAdmin={isAdmin}
            onDelete={handleDelete}
            onApprove={handleApprove}
            onDisapprove={handleDisapprove}
            onLike={handleLike}
            onDislike={handleDislike}
          />
        ))}
    </div>
  ) : (
    <p>No reviews found.</p>
  )}
</div>

    </div>
  );
};

export default Review;
