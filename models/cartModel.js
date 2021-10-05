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
  quantity: {
    type: Number,
    default: 1,
  },
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
