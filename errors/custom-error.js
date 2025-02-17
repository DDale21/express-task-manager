
class CustomAPIError extends Error {
  constructor (statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

const createCustomError = (errorDetails) => {
  const { statusCode, message } = errorDetails;
  return new CustomAPIError(statusCode, message);
}

module.exports = { createCustomError, CustomAPIError };