const mongoose = require('mongoose');

const wishlistSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.OnjectId,
    ref: 'User',
  },
  book: {
    type: mongoose.Schema.OnjectId,
    ref: 'Book',
  },
});

wishlistSchema.index({ user: 1, book: 1 });

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

module.exports = Wishlist;
