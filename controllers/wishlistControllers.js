const ErrorHandler = require('../utilities/ErrorHandler');
const AsyncHandler = require('../utilities/AsyncHandler');
const Wishlist = require('../models/wishlistModel');

exports.createWishlist = AsyncHandler(async (req, res, next) => {
  const obj = {
    user: req.body.user,
    book: req.body.book,
  };

  const createdWishList = await Wishlist.create(obj);
  res.status(201).json({
    status: 'success',
    data: { createdWishList },
  });
});

exports.deleteWishlist = AsyncHandler(async (req, res, next) => {
  await Wishlist.findOneAndDelete({
    user: req.body.user,
    book: req.body.book,
  });

  // const data = await Wishlist.findByIdAndDelete(req.params.wishlistId);
  // console.log(data);
  res.status(204).json({
    status: 'success',
    message: 'Wishlist id deleted successfully',
  });
});
