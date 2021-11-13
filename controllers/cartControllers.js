const AsyncHandler = require('../utilities/AsyncHandler.js');
const Cart = require('../models/cartModel.js');
const Purchase = require('../models/purchaseModel.js');
const mongoose = require('mongoose');
// const User = require('../models/userModel.js');

exports.getCarts = AsyncHandler(async function (req, res, next) {
  let obj = {};
  if (req.params.cartId) {
    obj.cart = req.params.cartId;
  }
  const carts = await Cart.find(obj).populate('book');
  obj = {};
  res.status(200).json({
    status: 'success',
    results: carts.length,
    data: {
      carts,
    },
  });
});

exports.createCart = AsyncHandler(async function (req, res, next) {
  await Cart.deleteMany({ user: req.params.userId, book: req.params.bookId });
  const cart = await Cart.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      cart,
    },
  });
});

exports.updateCart = AsyncHandler(async function (req, res, next) {
  await Cart.findByIdAndUpdate(req.params.cartId, req.body);
  res.status(200).json({
    status: 'success',
    message: 'Cart is updated successfully',
  });
});

exports.deleteCart = AsyncHandler(async function (req, res, next) {
  await Cart.deleteMany({ user: req.params.userId, book: req.params.bookId });
  res.status(204).json({
    status: 'success',
    message: 'Cart is deleted successfully',
  });
});

exports.deleteAllCart = AsyncHandler(async (req, res, next) => {
  const resul = await Cart.aggregate([
    {
      $match: {
        user: mongoose.Types.ObjectId(req.params.userId),
      },
    },
    {
      $group: {
        _id: '$book',
        count: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: 'books',
        localField: '_id',
        foreignField: '_id',
        as: 'book_doc',
      },
    },
  ]);

  const purchaseRaw = resul.map((p) => {
    return {
      user: req.params.userId,
      book: p._id,
      singlePrice: p.book_doc[0].price,
      quantity: p.count,
      totalPrice: p.count * p.book_doc[0].price,
    };
  });

  await Purchase.create(purchaseRaw);

  await Cart.deleteMany({ user: req.params.userId });
  res.redirect('/cart');
});
