import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';

const ReviewForm = ({ onSubmit, error, darkMode }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [emoji, setEmoji] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (rating > 0 && comment.trim() !== '') {
            onSubmit({ rating, comment });
            setRating(0);
            setComment('');
            setEmoji('');
        } else {
            let message = 'Please select a rating and ';
            message += comment.trim() === '' ? 'write a comment.' : 'select a rating.';
            alert(message);
        }
    };

    const handleRatingClick = (index) => {
        const newRating = index + 1;
        setRating(newRating);
        setEmoji(getEmoji(newRating));
    };

    const getEmoji = (rating) => {
        switch (rating) {
            case 1:
                return '😞';
            case 2:
                return '😐';
            case 3:
                return '😊';
            case 4:
                return '😄';
            case 5:
                return '🤩';
            default:
                return '';
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
        <div className={`p-8 rounded-lg max-w-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            <h3 className={`text-2xl font-bold text-center mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Share Your Experience
            </h3>

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
                    <label htmlFor="comment" className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Comment
                    </label>
                    <textarea
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows="4"
                        className={`mt-1 block w-full px-4 py-3 border ${darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200`}
                        placeholder="Write your review here..."
                    />
                </div>

                <button
                    type="submit"
                    className={`w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-300 font-semibold ${rating === 0 || comment.trim() === '' ? 'opacity-90 cursor-not-allowed' : ''}`}
                    disabled={rating === 0 || comment.trim() === ''}
                >
                    Submit Review
                </button>
            </form>

            {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        </div>
    );
};

export default ReviewForm;
