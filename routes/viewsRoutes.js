const express = require('express');
const mongoose = require('mongoose');
const authControllers = require('../controllers/authControllers');
const Book = require('../models/bookModel');
const Wishlist = require('../models/wishlistModel');
const Author = require('../models/authorModel');
const Cart = require('../models/cartModel');

const router = express.Router();

router.use(authControllers.checkUser);

router.get('/', async (req, res, next) => {
  const trendingBooks = await Book.find({ isTrending: true });
  res.status(200).render('_overview', { books: trendingBooks });
});
router.get('/author/:author', async (req, res, next) => {
  console.log(req.params.author);
  const author = await Author.findOne({ name: req.params.author }).populate(
    'books'
  );
  console.log(author);
  if (!author) {
    return res.status(404).render('_error', { err: 'walo' });
  }
  res.status(200).render('_author', { author });
});
router.get('/signup', (req, res, next) => {
  res.status(200).render('_signup', { user: req.user });
});
router.get('/login', (req, res, next) => {
  res.status(200).render('_login', { user: req.user });
});
router.get('/cart', authControllers.isLoggedIn, async (req, res, next) => {
  // const cart = req.user.cart;
  // console.log(req.user.id);

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

  console.log(resu);

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

  console.log(kaka);

  const price = kaka.reduce((p, c) => {
    return p + c.price();
  }, 0);
  console.log(price, 'äääääääääääääääääääääääääääääääääää');

  const items = kaka.reduce((p, c) => {
    return p + c.quant;
  }, 0);
  res.status(200).render('_cart', { price, kaka, items });
});
router.get('/profile', authControllers.isLoggedIn, (req, res, next) => {
  console.log('öööööööööööööööööööööööööööööööö');
  res.status(200).render('_profile', { user: req.user });
});

router.get('/wishlist', authControllers.isLoggedIn, async (req, res, next) => {
  const wishlist = await Wishlist.find({ user: req.user.id });

  const data = wishlist.map(async (w) => {
    return await Book.findById(w.book);
  });

  const books = await Promise.all(data);
  console.log(books);

  res.status(200).render('_wishlist', { user: req.user, books });
});

router.get('/forget-password', (req, res, next) => {
  res.status(200).render('_forgetpassword', { user: req.user });
});
router.get('/reset-password/:resetToken', (req, res, next) => {
  res.status(200).render('_resetpassword', {
    resetToken: req.params.resetToken,
  });
});
router.get('/book/:bookSlug', async (req, res, next) => {
  const book = await Book.findOne({ slug: req.params.bookSlug });
  res.status(200).render('_book', { book: book });
});
router.get('/books/:val', async (req, res, next) => {
  console.log(req.params.val);
  const quer = req.params.val.toLowerCase().split(' ').join('-');

  const resp = await Promise.all([
    Book.find({ name: quer }),
    Book.find({ ISBN: quer }),
    Book.find({ author: { $in: [quer] } }),
  ]);

  const [books] = resp.filter((r) => r.length > 0);
  console.log(books);
  res.status(200).render('_books', { books: books });
});

router.get('/category/:category', async (req, res, next) => {
  const quer = req.params.category;
  const books = await Book.find({ category: { $in: [quer] } });
  console.log(books);
  res.status(200).render('_books', { books: books });
});

module.exports = router;