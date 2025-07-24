import { useState } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';

const ReviewForm = ({ onSubmit, isSubmitting, currentUser }) => {
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!reviewText.trim()) {
      setError('Please enter your review');
      return;
    }
    
    onSubmit({
      rating,
      review_text: reviewText.trim()
    });
  };

  return (
    <div className="bg-black/80 bg-gradient-to-br from-black via-[#232526] to-[#2c5364] border-2 border-orange-500 rounded-xl shadow-xl backdrop-blur-sm mb-8">
      <div className="px-4 py-5 sm:px-6">
        <h2 className="text-lg font-medium text-gray-900">
          {currentUser ? 'Write a Review' : 'Sign in to write a review'}
        </h2>
        
        {!currentUser ? (
          <p className="mt-2 text-sm text-gray-600">
            You need to be signed in to write a review. Please{' '}
            <a href="/login" className="text-indigo-600 hover:text-indigo-500 font-medium">
              sign in
            </a>{' '}
            or{' '}
            <a href="/register" className="text-indigo-600 hover:text-indigo-500 font-medium">
              create an account
            </a>.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Rating <span className="text-xs text-gray-500">(click to select)</span>
              </label>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    aria-label={`Set rating to ${star} star${star > 1 ? 's' : ''}`}
                    onClick={() => setRating(star)}
                    className={`focus:outline-none ${star === rating ? 'ring-2 ring-yellow-400' : ''}`}
                    disabled={isSubmitting}
                  >
                    {/* Assignment: Star rating is clickable and required */}
                    <StarIcon
                      className={`h-8 w-8 ${
                        star <= rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-500">
                  {rating} star{rating !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            <div>
              <label htmlFor="review" className="block text-sm font-medium text-gray-700">
                Your Review
              </label>
              <div className="mt-1">
                <textarea
                  id="review"
                  name="review"
                  rows={4}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md text-gray-900 dark:bg-gray-800 dark:text-white"
                  placeholder="Share your thoughts about this book..."
                  disabled={isSubmitting}
                />
              </div>
              {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center px-4 py-2 rounded-md shadow-lg text-sm font-bold text-white bg-gradient-to-r from-red-600 via-orange-500 to-blue-600 hover:from-blue-700 hover:to-orange-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ReviewForm;
