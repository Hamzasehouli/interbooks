const slugify = require('slugify');
const mongoose = require('mongoose');

const bookSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter the name of the book'],
      unique: true,
    },
    title: {
      type: String,
      // // required: [true, 'Please add book title'],
    },
    slug: {
      type: String,
    },
    type: {
      type: String,
      required: [true, 'Please enter the type of the book'],
    },
    category: {
      type: [String],
      required: [true, 'Please enter the category of the book'],
    },
    author: [String],
    price: {
      type: Number,
    },
    coverImage: {
      type: String,
      required: [true, 'Please add a cover image of the book'],
    },
    images: [String],
    about: {
      type: String,
    },
    ISBN: {
      type: String,
    },
    pages: {
      type: Number,
    },
    releasedAt: {
      type: Date,
    },
    comments: {
      type: mongoose.Schema.ObjectId,
    },
    wishList: {
      type: mongoose.Schema.ObjectId,
    },
    publisher: {
      type: String,
    },
    format: {
      type: String,
    },
    language: {
      type: String,
    },
    inStock: {
      type: Boolean,
    },
    addetAt: {
      type: Date,
      default: Date.now(),
    },
    isNewReleased: Boolean,
    isTrending: Boolean,
    isBestSelling: Boolean,
    isPopulaire: Boolean,
    quantity: Number,
    ratingQuantity: Number,
    ratingAverage: Number,
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

bookSchema.index({ price: 1 });

bookSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'book',
  localField: '_id',
});

bookSchema.pre('save', function (next) {
  this.slug = slugify(this.name);
  next();
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
