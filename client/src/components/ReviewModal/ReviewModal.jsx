import React, { useState } from 'react'
import { FaStar } from "react-icons/fa";

const ReviewModal = ({ isOpen, onClose, onSubmit}) => {

    if (!isOpen) return null;

    const [ stars, setStars ] = useState(null);
    const [ error, setError ] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (stars !== null) {
            setError(null);
            const form = e.target;
            const data = {
                title: form.title.value,
                review: form.review.value,
                rating: parseInt(stars),
            };
            onSubmit(data);
            form.reset();
            onClose();
        } else {
            setError('PLease select a rating')
        }
    };


  return (

    <div className="fixed inset-0 bg-[#000d] bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute cursor-pointer top-3 right-4 text-gray-600 hover:text-red-500 text-xl font-bold"
        >
          ×
        </button>
        <h2 className="text-xl font-semibold mb-4">Write a Review</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Review title"
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
          <textarea
            name="review"
            placeholder="Write your review..."
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />

            <div className="flex space-x-2 text-gray-400">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                    key={star}
                    onClick={() => setStars(star)}
                    className={`cursor-pointer ${stars >= star ? 'text-slate-800' : ''}`}
                    aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                    >
                    <FaStar />
                    </span>
                ))}
            </div>

            {error && <p className='text-red-400'>{error}</p>}

          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 w-full cursor-pointer"
          >
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
};
export default ReviewModal