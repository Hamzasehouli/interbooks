module.exports = function (err, req, res, next) {
  const env = process.env.NODE_ENV.trim();
  if (env === 'development') {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        statusCode: err.statusCode,
        status: err.status,
        error: err.message,
        stack: err.stack,
      });
    } else {
      return res.status(500).json({
        info: 'is not an operational error',
        statusCode: err.statusCode,
        status: err.status,
        error: err.message,
        stack: err.stack,
      });
    }
  } else if (env === 'production') {
    if (err.isOperational) {
      return res.status(500).json({
        statusCode: err.statusCode,
        status: err.status,
        error: 'Something went wrong',
      });
    } else {
      if (err.code === 11000) {
        return res.status(500).json({
          statusCode: err.statusCode,
          status: err.status,
          error: 'Something went wrong',
        });
      }
      return res.status(500).json({
        statusCode: err.statusCode,
        status: err.status,
        error: 'something went wrong',
      });
    }
  }
};
