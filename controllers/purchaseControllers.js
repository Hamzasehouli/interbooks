const AsyncHandler = require('../utilities/AsyncHandler.js');
const Purchase = require('../models/purchaseModel.js');

exports.getPurchases = AsyncHandler(async function (req, res, next) {
  let obj = {};
  if (req.params.purchaseId) {
    obj.purchase = req.params.purchaseId;
  }
  const purchases = await Purchase.find(obj);
  obj = {};
  res.status(200).json({
    status: 'success',
    results: purchases.length,
    data: {
      purchases,
    },
  });
});

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

exports.updatePurchase = AsyncHandler(async function (req, res, next) {
  await Purchase.findByIdAndUpdate(req.params.purchaseId, req.body);
  res.status(200).json({
    status: 'success',
    message: 'Purchase is updated successfully',
  });
});

exports.deleteReview = AsyncHandler(async function (req, res, next) {
  await Puurchase.findByIdAndDelete(req.params.purchaseId);
  res.status(204).json({
    status: 'success',
    message: 'Purchase is deleted successfully',
  });
});
