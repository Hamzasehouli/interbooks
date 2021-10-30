const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  book: {
    type: mongoose.Schema.ObjectId,
    ref: 'Book',
  },
  addedAt: {
    type: Date,
    default: Date.now(),
  },
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
