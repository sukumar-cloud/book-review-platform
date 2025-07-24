const express = require('express');
const Book = require('../models/Book');
const Review = require('../models/Review');
const router = express.Router();

router.get('/', async (req, res) => {
  const { genre, author, page = 1, limit = 10, sort = 'createdAt', order = 'desc' } = req.query;
  const filter = {};
  if (genre) filter.genre = genre;
  if (author) filter.author = author;
  const books = await Book.find(filter)
    .sort({ [sort]: order === 'desc' ? -1 : 1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));
  const count = await Book.countDocuments(filter);
  const booksWithRating = await Promise.all(books.map(async (book) => {
    const reviews = await Review.find({ book: book._id });
    const avgRating = reviews.length ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length) : 0;
    return { ...book.toObject(), avgRating };
  }));
  res.json({ books: booksWithRating, total: count });
});

router.post('/', async (req, res) => {
  const { title, author, genre } = req.body;
  const book = new Book({ title, author, genre });
  await book.save();
  res.status(201).json(book);
});

router.put('/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json({ message: 'Book deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const mongoose = require('mongoose');
router.get('/:id', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ message: 'Invalid book ID' });
  }
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).json({ message: 'Book not found' });
  const reviews = await Review.find({ book: book._id }).populate('reviewer', 'username');
  const avgRating = reviews.length ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length) : 0;
  res.json({ ...book.toObject(), reviews, avgRating });
});

module.exports = router;