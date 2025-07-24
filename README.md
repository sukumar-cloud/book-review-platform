# Book Review Platform
A book review platform where u can browse the intresting books and can get the books based on the requirements. The users can leave a review based on their experience and any users can view or browse the books according to the highest rating. 
## Backend delpoyment link :
https://book-review-platform-d9u5.onrender.com
## Frontend hosted url :
https://books-review-platform.netlify.app/books

## Features

- **User Authentication**
  - Secure signup and login with JWT
  - Protected routes for authenticated users
  - User roles (admin/regular user)

- **Book Management**
  - Browse and search books
  - View book details and reviews
  - Add new books (admin only)
  - Edit/delete books (admin only)

- **Reviews & Ratings**
  - Leave reviews with star ratings
  - Edit/delete your own reviews
  - View all reviews for a book
  - Average rating calculation

- **Responsive Design**
  - Mobile-first approach
  - Dark mode support
  - Accessible UI components

## Tech Stack

### Frontend
- React 18
- React Router v6
- Tailwind CSS
- Axios for API calls
- React Icons
- React Toastify for notifications

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Express Validator
- CORS and Helmet for security

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or Atlas)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/book-review-platform.git
   cd book-review-platform
   ```

2. Install dependencies for both frontend and backend:
   ```bash
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd frontend
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development
   ```

4. Start the development servers:
   ```bash
   # Start backend server (from backend directory)
   npm run dev
   
   # In a new terminal, start frontend (from frontend directory)
   npm start
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Books
- `GET /api/books` - Get all books (with pagination and filters)
- `GET /api/books/:id` - Get a single book
- `POST /api/books` - Create a new book (admin only)
- `PUT /api/books/:id` - Update a book (admin only)
- `DELETE /api/books/:id` - Delete a book (admin only)

### Reviews
- `GET /api/books/:bookId/reviews` - Get reviews for a book
- `POST /api/books/:bookId/reviews` - Add a review (authenticated users)
- `PUT /api/reviews/:id` - Update a review (review author or admin)
- `DELETE /api/reviews/:id` - Delete a review (review author or admin)

## Project Structure

```
book-review-platform/
├── backend/               # Backend server
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── utils/            # Utility functions
│   ├── .env              # Environment variables
│   ├── server.js         # Main server file
│   └── package.json
│
└── frontend/             # Frontend React app
    ├── public/           # Static files
    └── src/
        ├── assets/       # Images, fonts, etc.
        ├── components/   # Reusable UI components
        ├── context/      # React context
        ├── pages/        # Page components
        ├── services/     # API services
        ├── styles/       # Global styles
        ├── App.js        # Main App component
        └── index.js      # Entry point
```

## Testing

Run tests for both frontend and backend:

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd ../frontend
npm test
```

## Deployment

### Backend
1. Set `NODE_ENV=production` in your `.env` file
2. Update CORS origin to your frontend domain
3. Deploy to your preferred hosting service (e.g., Heroku, Render, Railway)

### Frontend
1. Update API base URL in your frontend config
2. Build the app: `npm run build`
3. Deploy the `build` folder to a static hosting service (e.g., Vercel, Netlify, GitHub Pages)

## Contributing

1. Fork the repository
2. Make your changes and commit them
3. Push to the branch 
4. Open a pull request

## Contact

Mail id : sukumaramaravathi@gmail.com

Project Link: https://github.com/sukumar-cloud/book-review-platform.git
