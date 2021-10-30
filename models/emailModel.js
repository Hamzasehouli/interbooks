const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'email is required'],
  },
  addedAt: {
    type: Date,
    default: new Date(),
  },
});

const Email = mongoose.model('Email', emailSchema);

module.exports = Email;
