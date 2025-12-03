const successResponse = (res, data = null, message = 'OK', statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    data,
    message,
  });
};

const errorResponse = (res, message = 'Error', statusCode = 500, details = null) => {
  res.status(statusCode).json({
    success: false,
    data: null,
    message,
    ...(details ? { details } : {}),
  });
};

module.exports = { successResponse, errorResponse };
