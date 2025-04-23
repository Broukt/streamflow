const AppError = require('../utils/appError');

const sendErrorDev = (err, req, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, req, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error('UNEXPECTED ERROR:', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    });
  }
};

const globalErrorMiddleware = (err, req, res, next) => {
  // Establecer valores por defecto
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    return sendErrorDev(err, req, res);
  }
  // Production
  let error = { ...err, message: err.message };
  return sendErrorProd(error, req, res);
};

module.exports = globalErrorMiddleware;