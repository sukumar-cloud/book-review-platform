import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getBooks, getGenres } from '../../services/bookService';
import BookCard from '../../components/BookCard';
import { FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';

const ITEMS_PER_PAGE = 10;

export default function BookListPage() {
  const [sortBy, setSortBy] = useState('newest');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);
  const [genres, setGenres] = useState([]);
  const [filters, setFilters] = useState({
    genre: '',
    author: '',
    title: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const genresData = await getGenres();
        setGenres(genresData);
        
        await fetchBooks();
      } catch (err) {
        setError('Failed to load books. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const fetchBooks = async (page = 1) => {
    try {
      setLoading(true);
      setError('');
      
      const activeFilters = {};
      if (filters.genre) activeFilters.genre = filters.genre;
      if (filters.author) activeFilters.author = filters.author;
      if (filters.title) activeFilters.title = filters.title;
      
      const data = await getBooks(page, ITEMS_PER_PAGE, activeFilters);
      
      setBooks(data.books);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
      setTotalBooks(data.totalBooks);
    } catch (err) {
      setError('Failed to load books. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBooks(1);
  };

  const clearFilters = () => {
    setFilters({
      genre: '',
      author: '',
      title: '',
    });
    setCurrentPage(1);
    fetchBooks(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      fetchBooks(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-black via-orange-900 to-orange-600 flex flex-col py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-orange-500 tracking-wide drop-shadow-lg">Book Reviews</h1>
            <p className="mt-1 text-sm text-orange-300">
              Browse our collection of {totalBooks} books
            </p>
          </div>
          
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-4 py-2 rounded-md shadow-lg text-sm font-bold text-white bg-gradient-to-r from-red-600 via-orange-500 to-blue-600 hover:from-blue-700 hover:to-orange-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-200"
            >
              <FunnelIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
              {showFilters ? 'Hide' : 'Show'} Filters
            </button>
            
            {isAuthenticated && (
              <Link
                to="/books/add"
                className="inline-flex items-center px-4 py-2 rounded-md shadow-lg text-sm font-bold text-white bg-gradient-to-r from-red-600 via-orange-500 to-blue-600 hover:from-blue-700 hover:to-orange-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-200"
              >
                Add New Book
              </Link>
            )}
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-black/80 p-4 rounded-xl shadow-xl border-2 border-orange-500 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-extrabold text-white tracking-wide">Filters</h3>
              <button
                type="button"
                onClick={clearFilters}
                className="text-sm text-orange-400 hover:text-orange-500"
                disabled={!hasActiveFilters}
              >
                Clear all
              </button>
            </div>
            
            <form onSubmit={handleFilterSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-orange-200">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    value={filters.title}
                    onChange={handleFilterChange}
                    className="mt-1 block w-full border border-orange-500 bg-black text-orange-100 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    placeholder="Search by title"
                  />
                </div>
                
                <div>
                  <label htmlFor="author" className="block text-sm font-medium text-orange-200">
                    Author
                  </label>
                  <input
                    type="text"
                    name="author"
                    id="author"
                    value={filters.author}
                    onChange={handleFilterChange}
                    className="mt-1 block w-full border border-orange-500 bg-black text-orange-100 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    placeholder="Search by author"
                  />
                </div>
                
                <div>
                  <label htmlFor="genre" className="block text-sm font-medium text-orange-200">
                    Genre
                  </label>
                  <select
                    id="genre"
                    name="genre"
                    value={filters.genre}
                    onChange={handleFilterChange}
                    className="mt-1 block w-full border border-orange-500 bg-black text-orange-500 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  >
                    <option value="">All Genres</option>
                    {genres.map((genre) => (
                      <option key={genre} value={genre}>
                        {genre}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Active filters */}
        {hasActiveFilters && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {filters.genre && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  Genre: {filters.genre}
                  <button
                    type="button"
                    onClick={() => {
                      setFilters(prev => ({ ...prev, genre: '' }));
                      fetchBooks(1);
                    }}
                    className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:outline-none"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              )}
              
              {filters.author && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  Author: {filters.author}
                  <button
                    type="button"
                    onClick={() => {
                      setFilters(prev => ({ ...prev, author: '' }));
                      fetchBooks(1);
                    }}
                    className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:outline-none"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              )}
              
              {filters.title && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  Title: {filters.title}
                  <button
                    type="button"
                    onClick={() => {
                      setFilters(prev => ({ ...prev, title: '' }));
                      fetchBooks(1);
                    }}
                    className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:outline-none"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              )}
            </div>
          </div>
        )}

        {/* Loading and error states */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="ml-2 p-2 rounded bg-black text-orange-200 border border-orange-500 shadow focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        )}
        
        {!loading && error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Sorting */}
        <div className="flex items-center justify-end mb-4">
          <label htmlFor="sortBy" className="mr-2 text-sm font-medium text-gray-700">Sort by:</label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="border border-gray-300 bg-white text-gray-900 dark:bg-gray-800 dark:text-white rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
          </select>
        </div>

        {/* Book list */}
        {!loading && !error && books.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No books found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {hasActiveFilters
                ? 'Try adjusting your filters to find what you\'re looking for.'
                : 'Get started by adding a new book.'}
            </p>
            {isAuthenticated && !hasActiveFilters && (
              <div className="mt-6">
                <Link
                  to="/books/add"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <svg
                    className="-ml-1 mr-2 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  New Book
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...books].sort((a, b) => {
                if (sortBy === 'newest') {
                  return new Date(b.createdAt) - new Date(a.createdAt);
                } else if (sortBy === 'oldest') {
                  return new Date(a.createdAt) - new Date(b.createdAt);
                } else if (sortBy === 'highest') {
                  return ((b.avgRating || b.averageRating || 0) - (a.avgRating || a.averageRating || 0));
                } else if (sortBy === 'lowest') {
                  return ((a.avgRating || a.averageRating || 0) - (b.avgRating || b.averageRating || 0));
                }
                return 0;
              }).map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * ITEMS_PER_PAGE, totalBooks)}
                  </span>{' '}
                  of <span className="font-medium">{totalBooks}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {/* Page numbers */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === pageNum
                            ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
