const express = require('express');
const wishlistControllers = require('../controllers/wishlistControllers');

const router = express.Router();

router.route('/').post(wishlistControllers.createWishlist);
router.route('/delete-wishlist').delete(wishlistControllers.deleteWishlist);

module.exports = router;
