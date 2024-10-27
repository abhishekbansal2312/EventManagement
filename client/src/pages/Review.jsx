import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode"; // Ensure proper import here
import ReviewItem from "../components/ReviewItem";
import ReviewForm from "../components/ReviewForm";

const Review = ({ darkMode }) => {
  // Destructure darkMode prop
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
        headers: {
          "Content-Type": "application/json", // Added content type
        },
        credentials: "include", // Include credentials
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
    // Use approved reviews for calculation
    const approvedReviews = isAdmin
      ? data
      : data.filter((review) => review.approved);
    const totalRatings = approvedReviews.reduce(
      (acc, review) => acc + review.rating,
      0
    );
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
          "Content-Type": "application/json", // Added content type
        },
        body: JSON.stringify({ studentId, name: studentName, rating, comment }), // Include name
        credentials: "include", // Include credentials
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
        const response = await fetch(
          `http://localhost:4600/api/reviews/${reviewId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json", // Added content type
            },
            credentials: "include", // Include credentials
          }
        );

        if (!response.ok) throw new Error("Failed to delete review");

        setReviews((prevReviews) =>
          prevReviews.filter((review) => review._id !== reviewId)
        );
      } catch (error) {
        console.error("Error deleting review:", error.message);
        setError(error.message);
      }
    }
  };

  const handleLike = async (reviewId) => {
    try {
      const response = await fetch(
        `http://localhost:4600/api/reviews/${reviewId}/like`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Added content type
          },
          body: JSON.stringify({ studentId }), // Ensure the correct studentId is sent
          credentials: "include", // Include credentials
        }
      );

      if (!response.ok) throw new Error("Failed to like review");
      const updatedReview = await response.json();
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review._id === updatedReview._id ? updatedReview : review
        )
      );
    } catch (error) {
      console.error("Error liking review:", error);
    }
  };

  const handleDislike = async (reviewId) => {
    try {
      const response = await fetch(
        `http://localhost:4600/api/reviews/${reviewId}/dislike`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Added content type
          },
          body: JSON.stringify({ studentId }), // Ensure the correct studentId is sent
          credentials: "include", // Include credentials
        }
      );

      if (!response.ok) throw new Error("Failed to dislike review");
      const updatedReview = await response.json();
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review._id === updatedReview._id ? updatedReview : review
        )
      );
    } catch (error) {
      console.error("Error disliking review:", error);
    }
  };

  const handleApprove = async (reviewId) => {
    try {
      const response = await fetch(
        `http://localhost:4600/api/reviews/${reviewId}/approve`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json", // Added content type
          },
          credentials: "include", // Include credentials
        }
      );

      if (!response.ok) throw new Error("Failed to approve review");
      const updatedReview = await response.json();
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review._id === updatedReview._id ? updatedReview : review
        )
      );
    } catch (error) {
      console.error("Error approving review:", error);
    }
  };

  const handleDisapprove = async (reviewId) => {
    try {
      const response = await fetch(
        `http://localhost:4600/api/reviews/${reviewId}/disapprove`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json", // Added content type
          },
          credentials: "include", // Include credentials
        }
      );

      if (!response.ok) throw new Error("Failed to disapprove review");
      const updatedReview = await response.json();
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review._id === updatedReview._id ? updatedReview : review
        )
      );
    } catch (error) {
      console.error("Error disapproving review:", error);
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
    <div
      className={`w-full mx-0 p-8 flex flex-col ${
        darkMode ? "dark:bg-gray-900 dark:text-white" : "bg-white text-black"
      } transition-colors duration-300`}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* First Column: Two Rows */}
        <div className="flex flex-col gap-6">
          {/* Row 1: Average Rating Display */}
          <div
            className={`p-6 rounded-lg shadow-lg flex flex-col justify-center items-center text-center transition-all duration-300 ${
              darkMode ? "bg-gray-800" : "bg-yellow-100"
            }`}
          >
            <h3
              className={`text-2xl font-bold mb-2 ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Average Rating
            </h3>
            <div
              className={`text-5xl font-extrabold ${
                darkMode ? "text-yellow-400" : "text-yellow-500"
              }`}
            >
              {averageRating} / 5
            </div>

            {/* Display Total Number of Ratings */}
            <p
              className={`mt-2 ${darkMode ? "text-gray-400" : "text-gray-700"}`}
            >
              {isAdmin
                ? reviews.length
                : reviews.filter((r) => r.approved).length}{" "}
              {isAdmin ? "Total Ratings" : "Ratings"}
            </p>
          </div>

          {/* Row 2: Rating Distribution Chart */}
          <div
            className={`p-6 rounded-lg shadow-lg transition-all duration-300 ${
              darkMode ? "bg-gray-800" : "bg-gray-100"
            }`}
          >
            <h3
              className={`text-2xl font-bold mb-4 ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Rating Distribution
            </h3>
            <div
              className={`space-y-2 ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              {Object.entries(ratingCounts).map(([rating, count]) => {
                const totalReviews = isAdmin
                  ? reviews.length
                  : reviews.filter((review) => review.approved).length;
                const approvedCount = isAdmin
                  ? count
                  : reviews.filter(
                      (review) =>
                        review.rating === parseInt(rating) && review.approved
                    ).length;

                return (
                  <div
                    key={rating}
                    className="flex items-center justify-between p-3 rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
                  >
                    <span className="font-semibold flex items-center">
                      {/* Star Icons */}
                      {Array.from({ length: parseInt(rating) }, (_, i) => (
                        <svg
                          key={i}
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-yellow-500 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 15.27L16.18 20 14.54 13.97 20 9.24l-6.91-.58L10 2 7.91 8.66 1 9.24l5.46 4.73L3.82 20z" />
                        </svg>
                      ))}
                    </span>
                    <div className="w-4/5 bg-gray-300 rounded-full">
                      <div
                        className="bg-yellow-500 text-xs font-medium text-yellow-100 text-center p-0.5 leading-none rounded-full"
                        style={{
                          width: `${
                            (approvedCount / totalReviews) * 100 || 0
                          }%`, // Calculate the percentage based on approved ratings
                        }}
                      >
                        {approvedCount}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Second Column: Review Form */}
        <div>
          <ReviewForm onSubmit={handleSubmit} darkMode={darkMode} />
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">Reviews</h2>

      <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4`}>
        {reviews.length === 0 ? (
          <p className="text-center text-gray-500">
            No reviews yet. Be the first to leave a review!
          </p>
        ) : (
          // Filter reviews based on user role
          reviews
            .filter((review) => isAdmin || review.approved) // Show all reviews if admin, otherwise only approved
            .map((review) => (
              <ReviewItem
                key={review._id}
                review={review}
                isAdmin={isAdmin}
                onDelete={() => handleDelete(review._id)}
                onLike={() => handleLike(review._id)}
                onDislike={() => handleDislike(review._id)}
                onApprove={
                  isAdmin ? () => handleApprove(review._id) : undefined
                } // Only allow approve if admin
                onDisapprove={
                  isAdmin ? () => handleDisapprove(review._id) : undefined
                } // Only allow disapprove if admin
                darkMode={darkMode} // Pass darkMode to ReviewItem
              />
            ))
        )}
      </div>

      {error && (
        <div className="bg-red-500 text-white px-4 py-2 mt-4 rounded-lg shadow-md">
          {error}
        </div>
      )}
    </div>
  );
};

export default Review;
