const express = require('express');

const purchaseControllers = require('../controllers/purchaseControllers');
const authControllers = require('../controllers/authControllers');

const router = express.Router({ mergeParams: true });

router.use(authControllers.isLoggedIn);
// router.use(authControllers.protect('admin'));

router.get('/checkout-session/:userId/', purchaseControllers.createSession);
router.post('/', purchaseControllers.createPurchase);

module.exports = router;
