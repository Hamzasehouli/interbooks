const fs = require('fs');
const AsyncHandler = require('../utilities/AsyncHandler.js');
const User = require('../models/userModel.js');

exports.getUsers = AsyncHandler(async function (req, res, next) {
  const users = await User.find();
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

exports.createUser = AsyncHandler(async function (req, res, next) {
  const obj = {
    gender: req.body.gender,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    userName: req.body.userName,
    phone: req.body.phone,
    email: req.body.email,
    role: req.body.role,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    acceptConditions: req.body.acceptConditions,
    acceptNewletter: req.body.acceptNewletter,
  };
  const user = await User.create(obj);
  res.status(201).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.getUser = AsyncHandler(async function (req, res, next) {
  const user = await User.findById(req.params.userId);
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.updateUser = AsyncHandler(async function (req, res, next) {
  let obj = {};
  const { firstName, lastName, userName, email, password } = req.body;

  if (password) {
    return next(
      new ErrorHandler(400, 'Please use the adequat url to update password')
    );
  }
  if (firstName) {
    obj.firstName = firstName;
  }
  if (lastName) {
    obj.lastName = lastName;
  }
  if (userName) {
    obj.userName = userName;
  }
  if (email) {
    obj.email = email;
  }
  const arr = Object.values(obj);

  if (arr.length === 0) {
    return next(
      new ErrorHandler(
        400,
        'Please enter at least one field that you want to update '
      )
    );
  }
  const user = await User.findByIdAndUpdate(req.params.userId, obj).select(
    '+password'
  );

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
    message: 'Data has been updated successfully',
  });
});

exports.deleteUser = AsyncHandler(async function (req, res, next) {
  await User.findByIdAndDelete(req.param.userId);
  res.status(204).json({
    status: 'success',
    message: 'User is deleted successfully',
  });
});

exports.uploadImage = AsyncHandler(async function (req, res, next) {
  await User.findByIdAndUpdate(req.user.id, {
    image: req.file.filename,
  });
  res.status(200).json({
    status: 'success',
    data: {
      message: 'The photo has been updated successfully',
    },
  });
});
exports.removePhoto = AsyncHandler(async function (req, res, next) {
  fs.unlinkSync(`${__dirname}/../public/images/users/${req.user.image}`);

  await User.findByIdAndUpdate(req.user.id, {
    image: '',
  });
  res.status(200).json({
    status: 'success',
    data: {
      message: 'The photo has been removed successfully',
    },
  });
});

exports.deactivateUser = AsyncHandler(async function (req, res, next) {
  const user = await User.findById(req.params.userId).select('+password');
  user.active = false;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: 'success',
    message: 'The account has been deactivated sucessfully',
  });
});
