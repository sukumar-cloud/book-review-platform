import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const BOOKS_URL = `${API_URL}/api/books`;
const REVIEWS_URL = `${API_URL}/api/reviews`;

const handleApiError = (error) => {
  if (error.response) {
    const { status, data } = error.response;
    const errorMessage = data?.message || 'An error occurred';
    
    if (status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      throw new Error('Your session has expired. Please log in again.');
    }
    
    if (status === 404) {
      throw new Error('The requested resource was not found.');
    }
    
    if (status >= 500) {
      throw new Error('Server error. Please try again later.');
    }
    
    throw new Error(errorMessage);
  } else if (error.request) {
    // The request was made but no response was received
    throw new Error('No response from server. Please check your connection.');
  } else {
    // Something happened in setting up the request that triggered an Error
    throw new Error(error.message || 'An error occurred');
  }
};

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    if (typeof document !== 'undefined') {
      document.body.classList.add('loading');
    }
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    if (typeof document !== 'undefined') {
      document.body.classList.remove('loading');
    }
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    if (typeof document !== 'undefined') {
      document.body.classList.remove('loading');
    }
    return response;
  },
  (error) => {
    if (typeof document !== 'undefined') {
      document.body.classList.remove('loading');
    }
    return Promise.reject(error);
  }
);

export const getBooks = async (page = 1, limit = 10, filters = {}) => {
  try {
    const queryParams = new URLSearchParams({
      page: Math.max(1, parseInt(page, 10)),
      limit: Math.min(50, Math.max(1, parseInt(limit, 10))),
      ...filters
    });
    
    Array.from(queryParams.entries()).forEach(([key, value]) => {
      if (value === '' || value === 'undefined' || value === 'null') {
        queryParams.delete(key);
      }
    });
    
    const response = await api.get(`${BOOKS_URL}?${queryParams}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getBookById = async (id) => {
  if (!id) {
    throw new Error('Book ID is required');
  }
  
  try {
    const response = await api.get(`${BOOKS_URL}/${id}`, {
      headers: {
        'Cache-Control': 'max-age=300',
      },
    });
    
    if (!response.data) {
      throw new Error('Book not found');
    }
    
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const addBook = async (bookData) => {
  if (!bookData) {
    throw new Error('Book data is required');
  }
  
  const { title, author, genre } = bookData;
  if (!title?.trim() || !author?.trim() || !genre?.trim()) {
    throw new Error('Title, author, and genre are required');
  }
  
  try {
    const response = await api.post(BOOKS_URL, bookData);
    
    if (typeof window !== 'undefined' && window.caches) {
      caches.delete('books-list');
    }
    
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateBook = async (id, bookData) => {
  try {
    const response = await api.put(`${BOOKS_URL}/${id}`, bookData);
    return response.data;
  } catch (error) {
    console.error(`Error updating book with ID ${id}:`, error);
    throw error;
  }
};

export const deleteBook = async (id) => {
  try {
    const response = await api.delete(`${BOOKS_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting book with ID ${id}:`, error);
    throw error;
  }
};

export const getGenres = async () => {
  try {
    const response = await api.get(BOOKS_URL);
    const genres = [...new Set(response.data.books.map(book => book.genre))];
    return genres;
  } catch (error) {
    console.error('Error fetching genres:', error);
    throw error;
  }
};

export const addBookReview = async (bookId, reviewData) => {
  try {
    const response = await api.post(`${REVIEWS_URL}/${bookId}`, reviewData);
    return response.data;
  } catch (error) {
    console.error(`Error adding review for book ${bookId}:`, error);
    throw error;
  }
};

export const deleteBookReview = async (bookId, reviewId) => {
  try {
    const response = await api.delete(`${REVIEWS_URL}/${bookId}/${reviewId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting review ${reviewId} for book ${bookId}:`, error);
    throw error;
  }
};

export const updateBookReview = async (bookId, reviewId, reviewData) => {
  try {
    const response = await api.put(`${REVIEWS_URL}/${bookId}/${reviewId}`, reviewData);
    return response.data;
  } catch (error) {
    console.error(`Error updating review ${reviewId} for book ${bookId}:`, error);
    throw error;
  }
};
