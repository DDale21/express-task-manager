const errorHandlerMiddleware = (error, req, res, next) => {
  return res.status(error.status).json({
    success: false,
    status: error.status,
    message: error.message,
  });
}

module.exports = errorHandlerMiddleware;