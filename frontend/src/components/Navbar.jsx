import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-black bg-gradient-to-r from-black via-orange-900 to-orange-700 border-b-2 border-orange-500 shadow-xl backdrop-blur-md mb-6">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <Link to="/" className="text-xl font-extrabold text-orange-400 hover:text-orange-300 tracking-widest">BookReview</Link>
          <Link to="/books" className="text-white hover:text-blue-400 transition-colors duration-200">Books</Link>
          {isAuthenticated && (
            <Link to="/books/add" className="text-white hover:text-blue-400 transition-colors duration-200">Add Book</Link>
          )}
        </div>
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <span className="text-gray-700">Hi, {user?.name || user?.email || 'User'}</span>
              <button
                onClick={logout}
                className="bg-gradient-to-r from-red-600 via-orange-500 to-blue-600 hover:from-blue-700 hover:to-orange-400 text-white font-bold px-3 py-1 rounded-md shadow-lg transition-all duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-white hover:text-blue-400 transition-colors duration-200">Login</Link>
              <Link to="/register" className="text-white hover:text-blue-400 transition-colors duration-200">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
