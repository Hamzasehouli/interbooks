const express = require('express');
const emailControllers = require('../controllers/emailControllers');

const router = express.Router();

router
  .route('/')
  .get(emailControllers.getEmails)
  .post(emailControllers.createEmail);

module.exports = router;
