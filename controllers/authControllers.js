const jwt = require('jsonwebtoken');
const AsyncHandler = require('../utilities/AsyncHandler');
const SendEmail = require('../utilities/SendEmail');
const ErrorHandler = require('../utilities/ErrorHandler');
const User = require('../models/userModel.js');
const Book = require('../models/bookModel.js');
const Cart = require('../models/cartModel.js');
const Wishlist = require('../models/wishlistModel.js');
const mongoose = require('mongoose');

const sendCookie = function (res, token) {
  res.cookie('jwt', token, {
    // secure: process.env.NODE_ENV === 'production' ? true : false,
    // httpOnly: true,
    // expires: 60 * 60 * 1000,
  });
};

exports.signup = AsyncHandler(async function (req, res, next) {
  const obj = {
    gender: req.body.gender,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    userName: req.body.userName,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    acceptConditions: req.body.acceptConditions,
    acceptNewletter: req.body.acceptNewletter,
  };

  const user = await User.create(obj);

  await jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: process.env.EEXPIRES,
    },
    async (err, token) => {
      if (!token || err)
        return next(new ErrorHanddler(400, 'token has not been generated'));
      const obj = {
        to: user.email,
        subject: `Welcome ${user.firstName} to ${process.env.COMPANY}`,
        text: `Hellow ${user.firstName} to our famila, we are very glad that you have joind us, if you would have any question, feel free to ask us, we will be happy to answer`,
      };
      SendEmail(obj);

      // res.cookie('jwt', token);
      sendCookie(res, token);
      res.status(201).json({
        status: 'success',
        data: {
          user,
        },
      });
    }
  );
});

exports.login = AsyncHandler(async function (req, res, next) {
  const { email, password } = req.body;

  if (!email) {
    return next(new ErrorHandler(400, 'Please enter your email'));
  }
  if (!password) {
    return next(new ErrorHandler(400, 'Please enter the password'));
  }

  const user = await User.findOne({ email: email }).select('+password');
  if (!user) {
    return next(
      new ErrorHandler(404, 'No account found with the entered email')
    );
  }

  const isPasswordCorrect = await user.checkPassword(password, user.password);
  if (!isPasswordCorrect) {
    return next(
      new ErrorHandler(
        400,
        'Either the password incorret or the acocunt no longer exists'
      )
    );
  }
  await jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: process.env.EEXPIRES,
    },
    (err, token) => {
      if (!token || err)
        return next(new ErrorHanddler(400, 'token has not been generated'));
      sendCookie(res, token);
      // res.cookie('jwt', token);
      res.status(201).json({
        status: 'success',
        data: {
          user,
        },
      });
    }
  );
});

exports.isLoggedIn = AsyncHandler(async function (req, res, next) {
  const token = req.cookies.jwt
    ? req.cookies.jwt
    : req.headers.cookie?.split('=')[1]
    ? ''
    : '';

  jwt.verify(token, process.env.JWT_SECRET_KEY, async function (err, decoded) {
    if (!decoded || err) {
      return next(
        new ErrorHandler(403, 'You are not logged in, please login to continue')
      );
    }

    if (decoded.exp < Date.now() / 1000) {
      return next(
        new ErrorHandler(
          403,
          'The login session has expired, please loginn again'
        )
      );
    }

    const user = await User.findById(decoded.id).populate('cart');

    if (!user) {
      return next(
        new ErrorHandler(
          404,
          'The account has been deactivated or no longer exists'
        )
      );
    }

    const passwordModifiedAt =
      new Date(user.passwordModifiedAt).getTime() / 1000;

    if (decoded.iat < passwordModifiedAt) {
      return next(
        new ErrorHandler(
          400,
          'The login session has expired, please loginn again'
        )
      );
    }

    req.user = user;
    next();
  });
});

exports.logout = AsyncHandler(async (req, res, next) => {
  res.cookie('jwt', '');
  res.status(204).json({
    status: 'success',
    message: 'you are logged out successfully',
  });
});

exports.forgetPassword = AsyncHandler(async function (req, res, next) {
  const { email } = req.body;
  if (!email) {
    return next(new ErrorHandler(400, 'Please enter your email to continue'));
  }

  const user = await User.findOne({ email: email }).select('+password');
  if (!user) {
    return next(new ErrorHandler(404, 'No account found with this email'));
  }
  await user.generatePasswordReset();

  const url =
    process.env.NODE_ENV === 'development'
      ? `${req.protocol}//${req.get('host')}/api/v1/users/resetPassword/${
          user.resetPasswordToken
        }`
      : `${req.protocol}//${req.get('host')}/resetPassword/${
          user.resetPasswordToken
        }`;

  const obj = {
    to: user.email,
    subject: `Please use the URL below to reset your password`,
    text: `The url is valid for 10 min : ${url}`,
  };

  try {
    await SendEmail(obj);

    res.status(200).json({
      status: 'success',
      message: 'The email is sent successfully',
    });
  } catch (err) {
    if (String(err.responseCode).startsWith('5')) {
      return next(
        new ErrorHandler(err.responseCode, 'The email could not be sent')
      );
    }
  }
});

exports.resetPassword = AsyncHandler(async function (req, res, next) {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;
  // if (!currentPassword) {
  //   return next(new ErrorHandler(404, 'Please enter your current password'));
  // }
  if (!newPassword) {
    return next(new ErrorHandler(404, 'Please enter your new password'));
  }
  if (!confirmNewPassword) {
    return next(
      new ErrorHandler(404, 'Please confirm your new password password')
    );
  }

  if (confirmNewPassword !== newPassword) {
    return next(
      new ErrorHandler(
        404,
        'The new password and the confirmed one are not equal'
      )
    );
  }
  const user = await User.findOne({
    resetPasswordToken: req.params.resetToken,
    resetPasswordExpires: { $gt: Date.now() },
  }).select('+password');

  if (!user) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.save({ validateBeforeSave: false, validateModifiedOnly: false });
    return next(
      new ErrorHandler(404, 'The url may have expired, pleae try again')
    );
  }

  // const passwordValidity = await user.checkPassword(
  //   currentPassword,
  //   user.password
  // );

  // if (!passwordValidity) {
  //   return next(
  //     new ErrorHandler(
  //       400,
  //       'The entered password is either incorrect or has been updated'
  //     )
  //   );
  // }

  user.password = newPassword;
  user.confirmPassword = confirmNewPassword;
  user.passwordModifiedAt = Date.now();
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save({ validateBeforeSave: false, validateModifiedOnly: false });
  await jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: process.env.EEXPIRES,
    },
    (err, token) => {
      if (!token || err)
        return next(new ErrorHanddler(400, 'token has not been generated'));
      sendCookie(res, token);
      // res.cookie('jwt', token);
      res.status(200).json({
        status: 'success',
        message: 'The password has been reset successfully',
      });
    }
  );
});

//CHANGE PASSWORD-----------------------------------------------------------------------------

exports.changePassword = AsyncHandler(async function (req, res, next) {
  const user = await User.findById(req.user.id).select('+password');
  const { currentPassword, newPassword, confirmNewPassword } = req.body;
  if (!currentPassword) {
    return next(new ErrorHandler(404, 'Please enter your current password'));
  }
  if (!newPassword) {
    return next(new ErrorHandler(404, 'Please enter your new password'));
  }
  if (!confirmNewPassword) {
    return next(
      new ErrorHandler(404, 'Please confirm your new password password')
    );
  }

  if (confirmNewPassword !== newPassword) {
    return next(
      new ErrorHandler(
        404,
        'The new password and the confirmed one are not equal'
      )
    );
  }

  const passwordValidity = await user.checkPassword(
    currentPassword,
    user.password
  );

  if (!passwordValidity) {
    return next(
      new ErrorHandler(
        400,
        'The entered password is either incorrect or has been updated'
      )
    );
  }

  user.password = newPassword;
  user.confirmPassword = confirmNewPassword;
  user.passwordModifiedAt = Date.now();
  await user.save({ validateModifiedOnly: false });
  await jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: process.env.EEXPIRES,
    },
    (err, token) => {
      if (!token || err)
        return next(new ErrorHanddler(400, 'token has not been generated'));
      sendCookie(res, token);
      // res.cookie('jwt', token);
      res.status(200).json({
        status: 'success',
        message: 'The password has been updated successfully',
      });
    }
  );
});

//PROTECT-----------------------------------------------------------------------------

exports.protect = function (...roles) {
  return AsyncHandler(async function (req, res, next) {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(403, 'You are not allowed to perfrom this task')
      );
    }

    next();
  });
};

//UPDATE DATA-----------------------------------------------------------------------------------------------------

exports.updateData = AsyncHandler(async (req, res, next) => {
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
  await User.findByIdAndUpdate(req.user.id, obj).select('+password');

  res.status(200).json({
    status: 'success',
    message: 'Data has been updated successfully',
  });
});

//DEACTIVATE ACCOUNT---------------------------------------------------------------------------------------------

exports.deactivateAccount = AsyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');
  user.active = false;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: 'success',
    message: 'The account has been deactivated sucessfully',
  });
});

exports.getUserForView = AsyncHandler(async (req, res, next) => {
  const token = req.headers.cookie.split('=')[1];

  jwt.verify(token, process.env.JWT_SECRET_KEY, async function (err, decoded) {
    if (!decoded || err) {
      return next(
        new ErrorHandler(403, 'You are not logged in, please login to continue')
      );
    }

    if (decoded.exp < Date.now() / 1000) {
      return next(
        new ErrorHandler(
          403,
          'The login session has expired, please loginn again'
        )
      );
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      return next(
        new ErrorHandler(
          404,
          'The account has been deactivated or no longer exists'
        )
      );
    }

    // const passwordModifiedAt =
    //   new Date(user.passwordModifiedAt).getTime() / 1000;

    // if (decoded.iat < passwordModifiedAt) {
    //   return next(
    //     new ErrorHandler(
    //       400,
    //       'The login session has expired, please loginn again'
    //     )
    //   );
    // }

    req.user = user;
    next();
  });
});

exports.checkUser = AsyncHandler(async function (req, res, next) {
  const token = req.cookies.jwt
    ? req.cookies.jwt
    : req.headers.cookie?.split('=')[1]
    ? ''
    : '';

  jwt.verify(token, process.env.JWT_SECRET_KEY, async function (err, decoded) {
    if (!decoded || err) {
      // return next(
      //   new ErrorHandler(403, 'You are not logged in, please login to continue')
      // );
      return next();
    }

    if (decoded.exp < Date.now() / 1000) {
      // return next(
      //   new ErrorHandler(
      //     403,
      //     'The login session has expired, please loginn again'
      //   )
      // );
      return next();
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      // return next(
      //   new ErrorHandler(
      //     404,
      //     'The account has been deactivated or no longer exists'
      //   )
      // );
      next();
    }

    const passwordModifiedAt =
      new Date(user.passwordModifiedAt).getTime() / 1000;

    if (decoded.iat < passwordModifiedAt) {
      // return next(
      //   new ErrorHandler(
      //     400,
      //     'The login session has expired, please loginn again'
      //   )
      // );
      return next();
    }
    const resu = await Cart.aggregate([
      { $match: { user: mongoose.Types.ObjectId(user.id) } },
      {
        $group: {
          _id: '$book',
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'Book',
          localField: '_id',
          foreignField: '_id',
          as: 'allbooks',
        },
      },
    ]);

    const kaka = await Promise.all(
      resu.map(async (a) => {
        return {
          asn: await Book.findById(a._id),
          quant: a.count,
          price() {
            return this.asn.price * this.quant;
          },
        };
      })
    );

    const price = kaka.reduce((p, c) => {
      return p + c.price();
    }, 0);

    const items = kaka.reduce((p, c) => {
      return p + c.quant;
    }, 0);
    // res.status(200).render('_cart', { price, kaka, items });
    res.locals.cartBooks = items;
    console.log(items, '++++++++++++++++++++++++++++++++++++++++++++++++++');
    const wishlist = await Wishlist.find({ user: user.id });

    const data = wishlist.map(async (w) => {
      return await Book.findById(w.book);
    });

    const wishlistBooks = await Promise.all(data);
    res.locals.user = user;
    res.locals.wishlistBooks = wishlistBooks;
    req.user = user;
    next();
  });
});
