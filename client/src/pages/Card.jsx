import React from "react";

const Card = ({ review }) => {
  const truncatedComment = review.comment.length > 50 
    ? `${review.comment.substring(0, 100)}...` 
    : review.comment;

  return (
    <div className="bg-white dark:bg-gray-800 dark:border dark:border-gray-700 p-8 rounded-lg shadow-sm transition-colors duration-300">
      <p className="italic mb-4 text-gray-600 dark:text-gray-300">
        "{truncatedComment}"
      </p>
      <h4 className="font-bold text-indigo-900 dark:text-indigo-400">
        {review.studentId?.name || "Anonymous"}
      </h4>
    </div>
  );
};

export default Card;
