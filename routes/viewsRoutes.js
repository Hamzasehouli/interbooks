const express = require('express');
const mongoose = require('mongoose');
const authControllers = require('../controllers/authControllers');
const Book = require('../models/bookModel');
const Wishlist = require('../models/wishlistModel');
const Author = require('../models/authorModel');
const Cart = require('../models/cartModel');
const Review = require('../models/reviewModel');
const Purchase = require('../models/purchaseModel');

const router = express.Router();

router.use(authControllers.checkUser);

router.get('/', async (req, res, next) => {
  const trendingBooks = await Book.find({ isTrending: true });
  res.status(200).render('_overview', { books: trendingBooks, title: 'Home' });
});

router.get('/author/:author', async (req, res, next) => {
  const author = await Author.findOne({ name: req.params.author }).populate(
    'books'
  );

  if (!author) {
    return res.status(404).render('_error', { err: 'walo' });
  }
  res.status(200).render('_author', { author, title: 'Author' });
});

router.get('/signup', (req, res, next) => {
  res.status(200).render('_signup', { user: req.user, title: 'Signup' });
});

router.get('/login', (req, res, next) => {
  res.status(200).render('_login', { user: req.user, title: 'Login' });
});

router.get('/cart', authControllers.isLoggedIn, async (req, res, next) => {
  // const cart = req.user.cart;

  // const books = await Promise.all(
  //   cart.map(async (c) => {
  //     return await Book.findById(c.book);
  //   })
  // );

  const resu = await Cart.aggregate([
    { $match: { user: mongoose.Types.ObjectId(req.user.id) } },
    {
      $group: {
        _id: '$book',
        count: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: 'Book',
        localField: '_id',
        foreignField: '_id',
        as: 'allbooks',
      },
    },
  ]);

  const kaka = await Promise.all(
    resu.map(async (a) => {
      return {
        asn: await Book.findById(a._id),
        quant: a.count,
        price() {
          return this.asn.price * this.quant;
        },
      };
    })
  );

  const price = kaka.reduce((p, c) => {
    return p + c.price();
  }, 0);

  const items = kaka.reduce((p, c) => {
    return p + c.quant;
  }, 0);
  // res.locals.cartBooks = items;
  res.status(200).render('_cart', { price, kaka, items, title: 'Cart' });
});
router.get('/profile', authControllers.isLoggedIn, (req, res, next) => {
  res.status(200).render('_profile', { user: req.user, title: 'Profile' });
});

router.get('/purchases', authControllers.isLoggedIn, async (req, res, next) => {
  const purchases = await Purchase.find({ user: req.user.id }).populate('book');

  res.status(200).render('_purchase', { purchases, title: 'Purchase' });
});

router.get('/wishlist', authControllers.isLoggedIn, async (req, res, next) => {
  const wishlist = await Wishlist.find({
    user: req.user.id,
  });

  const data = wishlist.map(async (w) => {
    return await Book.findById(w.book);
  });

  const books = await Promise.all(data);

  res
    .status(200)
    .render('_wishlist', { user: req.user, books, title: 'Wishlist' });
});

router.get('/forget-password', (req, res, next) => {
  res
    .status(200)
    .render('_forgetpassword', { user: req.user, title: 'Forget password' });
});
router.get('/reset-password/:resetToken', (req, res, next) => {
  res.status(200).render('_resetpassword', {
    resetToken: req.params.resetToken,
    title: 'Reset password',
  });
});
router.get('/book/:bookSlug', async (req, res, next) => {
  const book = await Book.findOne({ slug: req.params.bookSlug });

  const [results] = await Review.aggregate([
    {
      $match: {
        book: mongoose.Types.ObjectId(book.id),
      },
    },
    {
      $group: {
        _id: '$book',
        ratingCount: { $sum: 1 },
        ratingAverage: { $avg: '$rating' },
      },
    },
  ]);
  res.status(200).render('_book', { book, results, title: book.title });
});
router.get('/books/:val', async (req, res, next) => {
  const quer = req.params.val.toLowerCase().split(' ').join('-');

  const resp = await Promise.all([
    Book.find({ name: quer }),
    Book.find({ ISBN: quer }),
    Book.find({ author: { $in: [quer] } }),
  ]);

  const [books] = resp.filter((r) => r.length > 0);

  res.status(200).render('_books', { books: books, title: 'Books' });
});

router.get('/category/:category', async (req, res, next) => {
  const quer = req.params.category;
  const books = await Book.find({ category: { $in: [quer] } });

  res.status(200).render('_books', { books: books });
});

module.exports = router;
