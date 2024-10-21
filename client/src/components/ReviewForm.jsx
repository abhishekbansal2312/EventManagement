import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';

const ReviewForm = ({ onSubmit, error }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [emoji, setEmoji] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (rating > 0 && comment.trim() !== '') { // Only submit if rating is > 0 and comment is not empty
            onSubmit({ rating, comment });
            setRating(0);
            setComment('');
            setEmoji('');
        } else {
            // Alert the user to fill in the required fields
            let message = 'Please select a rating and ';
            message += comment.trim() === '' ? 'write a comment.' : 'select a rating.';
            alert(message);
        }
    };

    const handleRatingClick = (index) => {
        const newRating = index + 1;
        setRating(newRating);
        setEmoji(getEmoji(newRating)); // Update the emoji based on the new rating
    };

    // Function to return emoji based on rating
    const getEmoji = (rating) => {
        switch (rating) {
            case 1:
                return '😞'; // Sad emoji for 1 star
            case 2:
                return '😐'; // Neutral emoji for 2 stars
            case 3:
                return '😊'; // Happy emoji for 3 stars
            case 4:
                return '😄'; // Very happy emoji for 4 stars
            case 5:
                return '🤩'; // Exciting emoji for 5 stars
            default:
                return ''; // No emoji for 0 stars
        }
    };

    const renderStars = () => {
        return Array.from({ length: 5 }, (_, index) => (
            <FaStar
                key={index}
                className={`cursor-pointer text-3xl transition duration-200 ${
                    index < rating ? 'text-yellow-500' : 'text-gray-300'
                }`}
                onClick={() => handleRatingClick(index)}
            />
        ));
    };

    return (
        <div className="bg-white p-8 rounded-lg max-w-xl"> {/* Removed shadow here */}
            <h3 className="text-2xl font-bold text-gray-800 text-center mb-6">Share Your Experience</h3>

            {/* Flexbox container for stars and emoji */}
            <div className="flex mb-4">
                <div className="flex">
                    {renderStars()}
                </div>
                {emoji && (
                    <div className="text-5xl ml-4">
                        {emoji}
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit}>
                <div className="mb-6">
                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
                    <textarea
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows="4"
                        className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        placeholder="Write your review here..."
                    />
                </div>

                <button
                    type="submit"
                    className={`w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-300 font-semibold ${rating === 0 || comment.trim() === '' ? 'opacity-90 cursor-not-allowed' : ''}`}
                    disabled={rating === 0 || comment.trim() === ''} // Disable button if no rating or comment
                >
                    Submit Review
                </button>
            </form>

            {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        </div>
    );
};

export default ReviewForm;
