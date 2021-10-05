const express = require('express');
const authControllers = require('../controllers/authControllers');

const router = express.Router();

// router.use(authControllers.isLoggedIn);

router.get('/', (req, res, next) => {
  res.status(200).render('_overview');
});
router.get('/author', (req, res, next) => {
  res.status(200).render('_author', { user: req.user });
});
router.get('/signup', (req, res, next) => {
  res.status(200).render('_signup', { user: req.user });
});
router.get('/login', (req, res, next) => {
  res.status(200).render('_login', { user: req.user });
});
router.get('/profile', (req, res, next) => {
  console.log(req.user);
  res.status(200).render('_profile', { user: req.user });
});
router.get('/cart', (req, res, next) => {
  res.status(200).render('_cart', { user: req.user });
});
router.get('/wishlist', (req, res, next) => {
  res.status(200).render('_wishlist', { user: req.user });
});
router.get('/forget-password', (req, res, next) => {
  res.status(200).render('_forgetpassword', { user: req.user });
});
router.get('/reset-password/:resetToken', (req, res, next) => {
  res.status(200).render('_resetpassword', {
    resetToken: req.params.resetToken,
  });
});

module.exports = router;
