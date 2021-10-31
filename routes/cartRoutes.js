const express = require('express');

const cartControllers = require('../controllers/cartControllers');
const authControllers = require('../controllers/authControllers');

const router = express.Router();

router.use(authControllers.isLoggedIn);
// router.use(authControllers.protect('admin'));

router.route('/delete-cart/:userId/:bookId').delete(cartControllers.deleteCart);

router.route('/:userId?/:bookId?').post(cartControllers.createCart);
router.route('/').get(cartControllers.getCarts);

router
  .route('/:reviewId')
  .patch(cartControllers.updateCart)
  .delete(cartControllers.deleteCart);

module.exports = router;
