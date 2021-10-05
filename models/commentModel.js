const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  book: {
    type: mongoose.Schema.ObjectId,
    ref: 'Book',
  },
  content: {
    type: String,
  },
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
