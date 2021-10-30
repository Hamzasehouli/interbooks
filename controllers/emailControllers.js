const Email = require('../models/emailModel');
const AsyncHandler = require('../utilities/AsyncHandler');
const ErrorHandler = require('../utilities/ErrorHandler');

exports.getEmails = AsyncHandler(async (req, res, next) => {
  const emails = await Email.find();

  res.status(200).json({
    status: 'success',
    data: {
      emails,
    },
  });
});

exports.createEmail = AsyncHandler(async (req, res, next) => {
  const email = await Email.create(req.body);
  res.status(200).json({
    status: 'success',
    data: {
      email,
    },
  });
});
