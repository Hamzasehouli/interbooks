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
    required: true,
  },
  quantity: {
    type: Number,
  },
  singlePrice: {
    type: Number,
  },
  added_at: {
    type: Date,
    default: Date.now(),
  },
});

const Purchase = mongoose.model('Purchase', purchaseModel);

module.exports = Purchase;
