const mongoose = require('mongoose');

const purchaseModel = mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  book: {
    type: mongoose.Schema.ObjectId,
    ref: 'Book',
  },
  totalPrice: {
    type: Number,
    required,
  },
});

const Purchase = mongoose.model('Purchase', purchaseModel);

module.exports = Cart;
