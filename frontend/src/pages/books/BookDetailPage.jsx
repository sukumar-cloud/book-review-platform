import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StarIcon, ArrowLeftIcon } from '@heroicons/react/24/solid';
import { getBookById, addBookReview, deleteBookReview } from '../../services/bookService';
import { useAuth } from '../../contexts/AuthContext';
import ReviewForm from '../../components/ReviewForm';
import ReviewList from '../../components/ReviewList';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';

import { ToastContainer } from 'react-toastify';

const BookDetailPage = () => {

  const { id } = useParams();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  // Custom review form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');

  useEffect(() => {
    let isMounted = true;
    
    const fetchBook = async () => {
      try {
        setLoading(true);
        const data = await getBookById(id);
        if (isMounted) {
          setBook(data);
          setError('');
        }
      } catch (err) {
        console.error('Error fetching book:', err);
        if (isMounted) {
          setError('Failed to load book details. Please try again later.');
          toast.error('Failed to load book details');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchBook();
    
    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const updatedBook = await addBookReview(id, {
        rating: reviewRating,
        review_text: reviewText
      });
      setBook(updatedBook);
      setReviewText('');
      setReviewRating(5);
      toast.success('Review added successfully!');
    } catch (err) {
      toast.error(err.message || 'Failed to add review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }
    
    try {
      setIsDeleting(true);
      setDeletingId(reviewId);
      const updatedBook = await deleteBookReview(id, reviewId);
      setBook(updatedBook);
      toast.success('Review deleted successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to delete review');
    } finally {
      setIsDeleting(false);
      setDeletingId(null);
    }
  };

  const renderRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <StarIcon key={`full-${i}`} className="h-5 w-5 text-yellow-400" />
      );
    }
    
    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <StarIcon className="h-5 w-5 text-gray-300" />
          <div className="absolute inset-0 w-1/2 overflow-hidden">
            <StarIcon className="h-5 w-5 text-yellow-400" />
          </div>
        </div>
      );
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <StarIcon key={`empty-${i}`} className="h-5 w-5 text-gray-300" />
      );
    }
    
    return stars;
  };

  console.log('BookDetailPage:', { book, error, loading });
if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black bg-opacity-90">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
  console.warn('BookDetailPage error fallback triggered:', error);
  return (
    <div className="min-h-screen flex items-center justify-center bg-black bg-opacity-90">
      <div className="max-w-xl w-full bg-white border-4 border-orange-500 rounded-2xl shadow-2xl p-10 text-center">
        <h1 className="text-3xl font-extrabold text-orange-600 mb-4">An error occurred</h1>
        <p className="text-lg text-gray-700 mb-6">{error}</p>
        <button
          onClick={() => navigate('/books')}
          className="inline-flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-orange-500 to-yellow-400 text-white font-bold shadow-lg hover:from-yellow-400 hover:to-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          Back to Books
        </button>
      </div>
    </div>
  );
}

  if (!book || !book._id || !book.title) {
    toast.success('Review submitted!');
    return null;
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
      <div className="min-h-screen w-full bg-gradient-to-br from-black via-orange-900 to-orange-600 flex flex-col py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
        {/* Back button */}
        <div className="mb-6">
          <Link
            to="/books"
            className="inline-flex items-center text-sm text-orange-400 hover:text-orange-500 mb-6"
          >
            <svg className="h-5 w-5 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Books
          </Link>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-8 transition-all duration-300 hover:shadow-lg">
            <div className="md:flex">
              <div className="md:w-1/3 lg:w-1/4 bg-gray-100 dark:bg-gray-700 p-8 flex items-center justify-center">
            {book.coverImage ? (
              <img
                src={book.coverImage}
                alt={`${book.title} cover`}
                className="max-h-96 w-auto object-contain rounded-lg shadow-md"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/book-placeholder.png';
                }}
              />
            ) : (
              <div className="text-8xl text-gray-400 dark:text-gray-500">📚</div>
            )}
              </div>
              
              <div className="p-6 md:p-8 flex-1">
            <div className="flex flex-col h-full">
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-4xl font-extrabold text-orange-400 drop-shadow-lg mb-2">
                      {book.title}
                    </h1>
                    <p className="text-xl font-semibold text-white drop-shadow-md">by {book.author}</p>
                    
                    <div className="flex items-center mt-4">
                      <div className="flex items-center bg-black/70 px-3 py-2 rounded-lg shadow-inner">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <StarIcon
                            key={star}
                            className={`h-6 w-6 ${
                              star <= Math.round(book.averageRating || 0)
                                ? 'text-yellow-400'
                                : 'text-gray-300 dark:text-gray-600'
                            }`}
                          />
                        ))}
                        <span className="ml-2 font-bold text-orange-300 drop-shadow">
                          {book.averageRating 
                            ? `${book.averageRating.toFixed(1)} (${book.reviews?.length || 0} ${book.reviews?.length === 1 ? 'review' : 'reviews'})`
                            : 'No reviews yet'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {isAuthenticated && user?.isAdmin && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => navigate(`/books/edit/${book._id}`)}
                        className="btn btn-primary"
                      >
                        Edit Book
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {book.publishedYear && (
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      <span className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Published</span>
                      <span className="text-gray-900 dark:text-white">{book.publishedYear}</span>
                    </div>
                  )}
                  
                  {book.genre && (
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      <span className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Genre</span>
                      <span className="text-gray-900 dark:text-white">{book.genre}</span>
                    </div>
                  )}
                  
                  {book.pages && (
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      <span className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Pages</span>
                      <span className="text-gray-900 dark:text-white">{book.pages}</span>
                    </div>
                  )}
                  
                  {book.isbn && (
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      <span className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">ISBN</span>
                      <span className="text-gray-900 dark:text-white">{book.isbn}</span>
                    </div>
                  )}
                </div>
                
                {book.description && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Description</h3>
                    <div className="prose max-w-none text-gray-600 dark:text-gray-300">
                      {book.description.split('\n').map((paragraph, i) => (
                        <p key={i} className="mb-4">{paragraph}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
  Add Your Review
</h2>
<div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 min-h-[200px] flex flex-col items-center justify-center">
  <form className="w-full max-w-md flex flex-col gap-4" onSubmit={handleSubmitReview}>
    <label className="block text-lg font-semibold text-gray-900 dark:text-orange-400 drop-shadow">Your Rating</label>
    <div className="flex items-center gap-2 mb-2">
      {[1,2,3,4,5].map((star) => (
        <button
          key={star}
          type="button"
          className={`text-2xl transition-colors ${reviewRating >= star ? 'text-orange-500' : 'text-gray-300'}`}
          onClick={() => setReviewRating(star)}
          aria-label={`Rate ${star} stars`}
        >
          ★
        </button>
      ))}
    </div>
    <textarea
      className="w-full rounded-lg border-2 border-orange-400 bg-black/70 text-white p-3 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none min-h-[80px] placeholder-gray-400"
      placeholder="Write your review here..."
      value={reviewText}
      onChange={e => setReviewText(e.target.value)}
      required
    />
    <button
      type="submit"
      className="mt-2 w-full py-2 px-4 rounded-lg bg-gradient-to-r from-orange-500 to-yellow-400 text-black font-bold text-lg shadow-lg hover:from-orange-600 hover:to-yellow-500 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 transition-all"
    >
      Submit Review
    </button>
  </form>
</div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Reviews
            {book.reviews?.length > 0 && (
              <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                ({book.reviews.length} {book.reviews.length === 1 ? 'review' : 'reviews'})
              </span>
            )}
          </h2>
          
          {book.reviews?.length > 0 ? (
            <div className="space-y-6">
              <ReviewList
                reviews={book.reviews}
                currentUserId={user?._id}
                onDelete={handleDeleteReview}
                isDeleting={isDeleting}
                deletingId={deletingId}
              />
            </div>
          ) : (
            <div className="bg-black/80 border-2 border-orange-500 rounded-xl p-8 text-center">
              <svg
                className="mx-auto h-12 w-12 text-orange-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-2 text-xl font-bold text-orange-400 drop-shadow">No reviews yet</h3>
              <p className="mt-1 text-base text-white">Be the first to review this book!</p>
            </div>
          )}
         </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default BookDetailPage;
