import { Link } from 'react-router-dom';
import { StarIcon } from '@heroicons/react/24/solid';

const BookCard = ({ book }) => {
  const renderRating = (rating) => {
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

  return (
    <div className="bg-white border-2 border-orange-500 rounded-xl shadow-xl transition-all duration-200 hover:shadow-2xl">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-orange-400 mb-1">
              <Link to={`/books/${book._id}`} className="hover:text-orange-500">
                {book.title}
              </Link>
            </h3>
            <p className="text-gray-600 text-sm mb-2">by {book.author}</p>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-500 text-orange-300">
            {book.genre}
          </span>
        </div>
        
        <div className="mt-2 flex items-center">
          <div className="flex items-center">
            {(book.avgRating || book.averageRating) ? (
              <span className="text-sm text-orange-200 ml-1">
                <div className="flex -ml-1 mr-1">
                  {renderRating(book.avgRating || book.averageRating)}
                </div>
                ({(book.avgRating || book.averageRating).toFixed(1)})
              </span>
            ) : (
              <span className="text-sm text-gray-500">No reviews yet</span>
            )}
          </div>
          {book.reviewCount > 0 && (
            <span className="ml-2 text-sm text-gray-500">
              • {book.reviewCount} {book.reviewCount === 1 ? 'review' : 'reviews'}
            </span>
          )}
        </div>
        
        {book.description && (
          <p className="mt-3 text-sm text-orange-200 line-clamp-3">
            {book.description}
          </p>
        )}
        
        <div className="mt-4 flex justify-between items-center">
          
          
          <div className="text-sm text-gray-500">
            Added on {new Date(book.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
