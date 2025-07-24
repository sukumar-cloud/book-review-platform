import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addBook } from '../../services/bookService';
import BookForm from '../../components/BookForm';

export default function AddBookPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (bookData) => {
    try {
      setLoading(true);
      setError('');
      

      const newBook = await addBook(bookData);
      
      // Redirect to the new book's detail page
      navigate(`/books/${newBook._id}`, {
        state: { message: 'Book added successfully!' }
      });
    } catch (err) {
      console.error('Error adding book:', err);
      setError(err.response?.data?.message || 'Failed to add book. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-black via-orange-900 to-orange-600 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-orange-500">Add New Book</h1>
          <p className="mt-1 text-sm text-orange-300">
            Fill in the details below to add a new book to the collection.
          </p>
        </div>
        
        {/* Error message */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
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
        
        {/* Book Form */}
        <BookForm 
          onSubmit={handleSubmit}
          loading={loading}
        />
      </div>
    </div>
  );
}
