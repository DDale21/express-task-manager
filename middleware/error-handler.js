const { CustomAPIError } = require('../errors/custom-error');

const errorHandlerMiddleware = (error, req, res, next) => {
  if (error instanceof CustomAPIError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  if (error.name == 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: 'Something went wrong, please try again',
    error,
  });
}

module.exports = errorHandlerMiddleware;