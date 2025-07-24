const express = require('express');
const Review = require('../models/Review');
const Book = require('../models/Book');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

function auth(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'No token' });
  try {
    const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
}

router.post('/:bookId', auth, async (req, res) => {
  const { review_text, rating } = req.body;
  const review = new Review({
    book: req.params.bookId,
    reviewer: req.user.id,
    review_text,
    rating
  });
  await review.save();
  const updatedBook = await Book.findById(req.params.bookId);
  const reviews = await Review.find({ book: req.params.bookId }).populate('reviewer', 'username');
  const avgRating = reviews.length ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length) : 0;
  const bookObj = updatedBook.toObject();
  bookObj._id = updatedBook._id; 
  res.status(201).json({ ...bookObj, reviews, avgRating });
});

module.exports = router;
