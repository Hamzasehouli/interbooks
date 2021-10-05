const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      requireed: [true, 'Please enter the author name'],
    },
    works: [{ type: mongoose.Schema.ObjectId, ref: 'Book' }],
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

authorSchema.virtuals('reviews', {
  ref: 'AuthorReviews',
  foreignField: 'authorReviews',
  localdField: '_id',
});
authorSchema.virtuals('reviews', {
  ref: 'AuthorComments',
  foreignField: 'authorComments',
  localdField: '_id',
});

const Author = mongoose.model('Author', authorSchema);

module.exports = Author;
