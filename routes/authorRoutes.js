const express = require('express');
const authorControllers = require('../controllers/authorControllers.js');

const router = express.Router();

router
  .route('/')
  .get(authorControllers.getAuthors)
  .post(authorControllers.createAuthor);

module.exports = router;
