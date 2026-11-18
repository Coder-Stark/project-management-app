export const AppError = (message, statusCode = 500, details = null) => {
  const error = new Error(message);

  error.statusCode = statusCode;
  error.details = details;
  error.isOperational = true;

  return error;
};