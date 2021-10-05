const express = require('express');
const userControllers = require('../controllers/userControllers');
const authControllers = require('../controllers/authControllers');

const router = express.Router();

router.route('/signup').post(authControllers.signup);
router.route('/login').post(authControllers.login);
router.route('/forget-password').post(authControllers.forgetPassword);
router
  .route('/reset-password/:resetToken')
  .patch(authControllers.resetPassword);
router.route('/logout').post(authControllers.logout);
router.use(authControllers.isLoggedIn);
router.route('/change-password').patch(authControllers.changePassword);
router.route('/update-data').patch(authControllers.updateData);
router.route('/delete-account').patch(authControllers.deactivateAccount);

router.use(authControllers.protect('admin'));

router
  .route('/')
  .get(userControllers.getUsers)
  .post(userControllers.createUser);

router
  .route('/:userId')
  .get(userControllers.getUser)
  .patch(userControllers.updateUser)
  .delete(userControllers.deleteUser);

router.route('/deactivate-user/:userId').patch(userControllers.deactivateUser);

module.exports = router;
