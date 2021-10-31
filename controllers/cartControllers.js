const AsyncHandler = require('../utilities/AsyncHandler.js');
const Cart = require('../models/cartModel.js');

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
  const obj = {
    book: req.body.book,
    user: req.body.user,
  };
  const cart = await Cart.create(obj);
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
  await Cart.findByIdAndDelete(req.params.cartId);
  res.status(204).json({
    status: 'success',
    message: 'Cart is deleted successfully',
  });
});