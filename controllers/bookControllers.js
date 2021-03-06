const AsyncHandler = require('../utilities/AsyncHandler.js');
const Book = require('../models/bookModel.js');

exports.getBooks = AsyncHandler(async function (req, res, next) {
  const books = await Book.find();

  res.status(200).json({
    status: 'success',
    results: books.length,
    data: {
      books,
    },
  });
});

exports.createBook = AsyncHandler(async function (req, res, next) {
  const book = await Book.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      book,
    },
  });
});

exports.updateBook = AsyncHandler(async function (req, res, next) {
  await Book.findByIdAndUpdate(req.params.bookId, req.body);
  res.status(200).json({
    status: 'success',
    message: 'Data is updated successfully',
  });
});

exports.deleteBook = AsyncHandler(async function (req, res, next) {
  await Book.findByIdAndDelete();
  res.status(204).json({
    status: 'success',
    message: 'Book is deleted successfully',
  });
});
exports.deleteAllBooks = AsyncHandler(async function (req, res, next) {
  await Book.deleteMany();
  res.status(204).json({
    status: 'success',
    message: 'Books are deleted successfully',
  });
});
