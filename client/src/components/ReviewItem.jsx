import React from 'react';
import { FaStar, FaTrashAlt, FaThumbsUp, FaThumbsDown, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'; 
import moment from 'moment';

const ReviewItem = ({ review, onDelete, onLike, onDislike, onApprove, onDisapprove, isAdmin }) => {
    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, index) => (
            <FaStar key={index} className={`text-lg ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`} />
        ));
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                    <span className="text-gray-700 text-lg font-medium">
                        {review.studentId?.name || 'Unknown'}
                    </span>
                </div>
                <div className="flex items-center">
                    {renderStars(review.rating)}
                    <span className="ml-3 text-gray-600 text-lg">{review.rating}/5</span>
                </div>
            </div>
            <div className="text-sm text-gray-500 mb-4">
                {moment(review.createdAt).format('MMMM Do YYYY, h:mm a')}
            </div>
            <p className="text-gray-700 mb-4">
                {review.comment}
            </p>
            <div className="flex justify-between items-center mb-4">
                {/* Like and Dislike Buttons */}
                <div className="flex items-center">
                    <button
                        onClick={() => onLike(review._id)} 
                        className="text-green-500 hover:text-green-700 flex items-center mr-4"
                        aria-label="Like Review"
                    >
                        <FaThumbsUp className="mr-2" />
                        {review.likes} 
                    </button>
                    <button
                        onClick={() => onDislike(review._id)} 
                        className="text-red-500 hover:text-red-700 flex items-center"
                        aria-label="Dislike Review"
                    >
                        <FaThumbsDown className="mr-2" />
                        {review.dislikes} 
                    </button>
                </div>
                
                {/* Approve or Disapprove Button */}
                <div className="flex items-center">
                    {isAdmin && (
                        <>
                            {review.approved ? (
                                <button
                                    onClick={() => onDisapprove(review._id)} 
                                    className="flex items-center text-red-500 hover:text-red-700 mr-4"
                                    aria-label="Disapprove Review"
                                >
                                    <FaTimesCircle className="mr-2" />
                                    Disapprove
                                </button>
                            ) : (
                                <button
                                    onClick={() => onApprove(review._id)} 
                                    className="flex items-center text-blue-500 hover:text-blue-700 mr-4"
                                    aria-label="Approve Review"
                                >
                                    <FaCheckCircle className="mr-2" />
                                    Approve
                                </button>
                            )}
                        </>
                    )}
                    {/* Delete Button */}
                    {isAdmin && (
                        <button
                            onClick={() => onDelete(review._id)} 
                            className="text-red-500 hover:text-red-700 font-semibold flex items-center"
                            aria-label="Delete Review"
                        >
                            <FaTrashAlt className="mr-2" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReviewItem;
