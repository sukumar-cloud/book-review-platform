import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './index.css';
import BookListPage from './pages/books/BookListPage';
import AddBookPage from './pages/books/AddBookPage';
import BookDetailPage from './pages/books/BookDetailPage';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import Navbar from './components/Navbar';
import { AuthProvider } from './contexts/AuthContext';

function Landing() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-orange-900 to-orange-600 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-orange-400 mb-8">Welcome to Book Review Platform</h1>
        <button
          className="bg-gradient-to-r from-orange-500 via-orange-400 to-orange-700 hover:from-orange-600 hover:to-orange-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 transform hover:scale-105"
          onClick={() => navigate('/books')}
        >
          Explore Books
        </button>
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-black via-[#1a1a1a] to-[#232526]" style={{background: 'radial-gradient(ellipse at top right, #0f2027 0%, #2c5364 50%, #ff512f 80%, #f09819 100%)'}}>
      <Router>
        <AuthProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/books" element={
              <ProtectedRoute>
                <BookListPage />
              </ProtectedRoute>
            } />
            <Route path="/books/add" element={
              <ProtectedRoute>
                <AddBookPage />
              </ProtectedRoute>
            } />
            <Route path="/books/:id" element={
              <ProtectedRoute>
                <BookDetailPage />
              </ProtectedRoute>
            } />
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}


export default App;
