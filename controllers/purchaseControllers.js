const mongoose = require('mongoose');
const AsyncHandler = require('../utilities/AsyncHandler.js');
const Cart = require('../models/cartModel.js');
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_PRIVATE_KEY);

exports.createSession = AsyncHandler(async (req, res, next) => {
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

  // 1) get book
  const lineItems = resul.map((c) => {
    return {
      price_data: {
        currency: 'usd',
        product_data: {
          name: c.book_doc[0].title
            .split('-')
            .map((l) => l.toUpperCase())
            .join(' '),
        },
        unit_amount: c.book_doc[0].price * 10,
      },
      quantity: c.count,
      description: c.book_doc[0].about,
    };
  });

  // 2)create session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    customer_email: req.user.email,
    client_reference_id: req.params.bookId,
    success_url: `${req.protocol}://${req.get(
      'host'
    )}/api/v1/cart/delete-all-cart/${req.user.id}`,
    cancel_url: `${req.protocol}://${req.get('host')}`,
  });
  res.status(200).json({
    status: 'success',
    session,
  });
});

// exports.getPurchases = AsyncHandler(async function (req, res, next) {
//   let obj = {};
//   if (req.params.purchaseId) {
//     obj.purchase = req.params.purchaseId;
//   }
//   const purchases = await Purchase.find(obj);
//   obj = {};
//   res.status(200).json({
//     status: 'success',
//     results: purchases.length,
//     data: {
//       purchases,
//     },
//   });
// });

exports.createPurchase = AsyncHandler(async function (req, res, next) {
  const obj = {
    rating: req.body.rating,
    description: req.body.description,
    book: req.params.bookId,
    user: req.body.user,
  };
  const purchase = await Purchase.create(obj);
  res.status(201).json({
    status: 'success',
    data: {
      purchase,
    },
  });
});

// exports.updatePurchase = AsyncHandler(async function (req, res, next) {
//   await Purchase.findByIdAndUpdate(req.params.purchaseId, req.body);
//   res.status(200).json({
//     status: 'success',
//     message: 'Purchase is updated successfully',
//   });
// });

// exports.deleteReview = AsyncHandler(async function (req, res, next) {
//   await Puurchase.findByIdAndDelete(req.params.purchaseId);
//   res.status(204).json({
//     status: 'success',
//     message: 'Purchase is deleted successfully',
//   });
// });
