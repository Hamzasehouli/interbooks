const express = require('express');

const cartControllers = require('../controllers/cartControllers');
const authControllers = require('../controllers/authControllers');

const router = express.Router();

router.use(authControllers.isLoggedIn);
// router.use(authControllers.protect('admin'));

router
  .route('/')
  .post(cartControllers.createCart)
  .get(cartControllers.getCarts);

router
  .route('/:reviewId')
  .patch(cartControllers.updateCart)
  .delete(cartControllers.deleteCart);

module.exports = router;
