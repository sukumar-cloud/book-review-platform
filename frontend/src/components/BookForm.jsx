import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getGenres } from '../services/bookService';

const BookForm = ({ initialData = {}, onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    author: initialData.author || '',
    genre: initialData.genre || '',
    description: initialData.description || '',
    publishedYear: initialData.publishedYear || '',
  });
  
  const [errors, setErrors] = useState({});
  const [genres, setGenres] = useState([]);
  const navigate = useNavigate();

  // Fetch available genres
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genresData = await getGenres();
        setGenres(genresData);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    fetchGenres();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.author.trim()) {
      newErrors.author = 'Author is required';
    }
    
    if (!formData.genre) {
      newErrors.genre = 'Please select a genre';
    }
    
    if (formData.publishedYear) {
      const year = parseInt(formData.publishedYear, 10);
      const currentYear = new Date().getFullYear();
      
      if (isNaN(year) || year < 1000 || year > currentYear + 1) {
        newErrors.publishedYear = `Please enter a valid year (1000-${currentYear + 1})`;
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Prepare data for submission
      const bookData = {
        ...formData,
        publishedYear: formData.publishedYear ? parseInt(formData.publishedYear, 10) : undefined
      };
      
      onSubmit(bookData);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-[#1a1a1a] to-[#232526] p-4" style={{background: 'radial-gradient(ellipse at top right, #0f2027 0%, #2c5364 50%, #ff512f 80%, #f09819 100%)'}}>
      <div className="w-full max-w-3xl bg-black/90 rounded-2xl shadow-2xl px-12 py-10 backdrop-blur-md border-2 border-orange-500" style={{boxShadow: '0 8px 32px 0 rgba(18, 34, 60, 0.37), 0 0 0 4px #005bea55'}}>
        <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-3xl mx-auto px-8 py-6">
      
            {/* Title */}
            <div className="mb-4">
              <label htmlFor="title" className="block text-base font-extrabold text-white tracking-wide mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`block w-full max-w-2xl mx-auto rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-base text-black bg-white placeholder-gray-500 border py-2 px-4 ${errors.title ? 'border-red-300' : 'border-gray-300'}`}
                placeholder="Book title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            {/* Author */}
            <div className="mb-4">
              <label htmlFor="author" className="block text-base font-extrabold text-white tracking-wide mb-1">
                Author <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                className={`block w-full max-w-2xl mx-auto rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-base text-black bg-white placeholder-gray-500 border py-2 px-4 ${errors.author ? 'border-red-300' : 'border-gray-300'}`}
                placeholder="Author name"
              />
              {errors.author && (
                <p className="mt-1 text-sm text-red-600">{errors.author}</p>
              )}
            </div>

            {/* Genre */}
            <div className="mb-4">
              <label htmlFor="genre" className="block text-base font-extrabold text-white tracking-wide mb-1">
                Genre <span className="text-red-500">*</span>
              </label>
              <select
                id="genre"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                className={`block w-full max-w-2xl mx-auto rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-base text-black bg-white placeholder-gray-500 border py-2 px-4 ${errors.genre ? 'border-red-300' : 'border-gray-300'}`}
              >
                <option value="">Select a genre</option>
                {genres.map((genre) => (
                  <option key={genre} value={genre} className="text-gray-900 bg-white dark:text-white dark:bg-gray-800">
                    {genre}
                  </option>
                ))}
              </select>
              {errors.genre && (
                <p className="mt-1 text-sm text-red-600">{errors.genre}</p>
              )}
            </div>

            {/* Published Year */}
            <div className="mb-4">
              <label htmlFor="publishedYear" className="block text-base font-extrabold text-white tracking-wide mb-1">
                Published Year
              </label>
              <input
                type="number"
                id="publishedYear"
                name="publishedYear"
                value={formData.publishedYear}
                onChange={handleChange}
                min="1000"
                max={new Date().getFullYear() + 1}
                className={`block w-full max-w-2xl mx-auto rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-base text-black bg-white placeholder-gray-500 border py-2 px-4 ${errors.publishedYear ? 'border-red-300' : 'border-gray-300'}`}
                placeholder="e.g., 2020"
              />
              {errors.publishedYear && (
                <p className="mt-1 text-sm text-red-600">{errors.publishedYear}</p>
              )}
            </div>

            {/* Description */}
            <div className="mb-4">
              <label htmlFor="description" className="block text-base font-extrabold text-white tracking-wide mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full max-w-2xl mx-auto sm:text-base text-black bg-white placeholder-gray-500 border border-gray-300 py-2 px-4 rounded-lg"
                placeholder="A brief description of the book"
              />
            </div>

            <div className="flex justify-end space-x-4 pt-8 mt-8 border-t border-gray-700">
              <button
                type="button"
                className="pixel-btn inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="min-w-fit md:w-auto px-8 py-3 rounded-xl font-black text-base bg-gradient-to-r from-red-600 via-orange-500 to-blue-600 text-white shadow-xl hover:from-blue-700 hover:to-orange-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed border-none"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Book'}
              </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default BookForm;
