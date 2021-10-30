const Author = require('../models/authorModel.js');
const AsyncHandler = require('../utilities/AsyncHandler');
const ErrorHandler = require('../utilities/ErrorHandler');

exports.getAuthors = AsyncHandler(async (req, res, next) => {
  const authors = await Author.find();
  res.status(200).json({
    status: 'success',
    data: {
      authors,
    },
  });
});
exports.createAuthor = AsyncHandler(async (req, res, next) => {
  const author = await Author.create(req.body);
  res.status(200).json({
    status: 'success',
    data: {
      author,
    },
  });
});
