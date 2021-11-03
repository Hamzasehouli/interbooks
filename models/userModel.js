const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const ErrorHandler = require('../utilities/ErrorHandler');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
  {
    gender: {
      type: String,
      enum: ['male', 'female'],
      required: [true, 'please enter your gender'],
    },
    image: String,
    firstName: {
      type: String,
      required: [true, 'Please enter your first name'],
      validate: {
        validator(val) {
          return val.length > 2;
        },
        message: 'fail',
      },
    },
    lastName: {
      type: String,
      required: [true, 'Please enter your last name'],
      validate: {
        validator(val) {
          return val.length > 2;
        },
        message: 'fail',
      },
    },
    userName: {
      type: String,
      required: [true, 'Please add a username'],
      unique: true,
      validate: {
        validator(val) {
          return val.length > 5;
        },
        message: 'fail',
      },
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    email: {
      type: String,
      required: [true, 'Please enter a valid email'],
      unique: true,
      validate: {
        validator(val) {
          return val.split('@')[1].includes('.') || val.includes('@');
        },
        message: 'Please enter a valid email, valid email must containe @ ',
      },
    },
    password: {
      type: String,
      required: [
        true,
        'Please enter a valid password, it must containe at least 8 characters',
      ],
      select: false,
      validate: {
        validator(val) {
          return (
            val > 8 ||
            val < 20 ||
            !val.includes(this.firstName) ||
            !val.includes(this.lastName) ||
            !val.includes(this.userName)
          );
        },
        message:
          'Please enter a valid password, password must contain min 8 and max 20 characters',
      },
    },
    confirmPassword: {
      type: String,
      required: [
        true,
        'Please confirm the password, it must containe at least 8 characters',
      ],
      validate: {
        validator(val) {
          return (
            !val.includes(this.firstName) ||
            !val.includes(this.lastName) ||
            !val.includes(this.userName) ||
            this.password === val
          );
        },
        message:
          'Your password must not contain your neither your name nor your username',
      },
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    acceptConditions: {
      type: Boolean,
      default: false,
      required: [true, 'Please accept our conditions and terms to continue'],
    },
    active: {
      type: Boolean,
      default: true,
    },
    acceptNewletter: {
      type: Boolean,
    },
    resetPasswordToken: {
      type: String,
      required: false,
    },

    resetPasswordExpires: {
      type: Date,
      required: false,
    },
    passwordModifiedAt: {
      type: Date,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const lowercaseNames = function (prop) {
  return prop.toLowerCase()[0].toUpperCase() + prop.toLowerCase().slice(1);
};

userSchema.virtual('cart', {
  ref: 'Cart',
  foreignField: 'user',
  localField: '_id',
});

userSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'user',
  localField: '_id',
});

userSchema.pre('save', async function (next) {
  this.firstName = lowercaseNames(this.firstName);
  this.lastName = lowercaseNames(this.lastName);
  this.userName = this.userName.trim().toLowerCase();
  this.email = this.email.toLowerCase();
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }

  this.confirmPassword = undefined;

  // if (
  //   !this.email ||
  //   !this.email.split('@')[1].includes('.') ||
  //   !this.email.includes('@')
  // ) {
  //   return next(
  //     new ErrorHandler(
  //       401,
  //       `Please enter a valid email, valid email must containe @ `
  //     )
  //   );
  // }

  // if (!this.password || this.password < 8 || this.password > 20) {
  //   return next(
  //     new ErrorHandler(
  //       401,
  //       `Please enter a valid password, password must contain min 8 and max 20 characters`
  //     )
  //   );
  // }

  // if (
  //   this.password.includes(this.firstName) ||
  //   this.password.includes(this.lastName) ||
  //   this.password.includes(this.userName)
  // ) {
  //   return next(
  //     new ErrorHandler(
  //       401,
  //       `Your password must not contain your neither your name nor your username`
  //     )
  //   );
  // }
  // if (
  //   this.confirmPassword.includes(this.firstName) ||
  //   this.confirmPassword.includes(this.lastName) ||
  //   this.confirmPassword.includes(this.userName)
  // ) {
  //   return next(
  //     new ErrorHandler(
  //       401,
  //       `Your password must not contain your neither your name nor your username`
  //     )
  //   );
  // }

  // if (this.password !== this.confirmPassword) {
  //   return next(
  //     new ErrorHandler(
  //       401,
  //       `Your password and the confirm password are not equal`
  //     )
  //   );
  // }

  // if (!this.phone || this.phone.length < 10 || !this.phone.includes('06')) {
  //   return next(
  //     new ErrorHandler(
  //       401,
  //       `Please enter your phone number, phone number must start with 06 and contain 10 digits`
  //     )
  //   );
  // }
  // if (!this.acceptConditions) {
  //   return next(
  //     new ErrorHandler(
  //       401,
  //       `Please accept the terms and conditions to continue`
  //     )
  //   );
  // }
  next();
});

userSchema.methods.checkPassword = async function (
  plainPassword,
  encryptedPassword
) {
  return await bcrypt.compare(plainPassword, encryptedPassword);
};

userSchema.methods.generatePasswordReset = async function () {
  this.resetPasswordToken = await crypto.randomBytes(20).toString('hex');
  this.resetPasswordExpires = Date.now() + 10 * 60 * 1000; //expires in an hour
  await this.save({ validateBeforeSave: false });
};

const User = mongoose.model('User', userSchema);

module.exports = User;
