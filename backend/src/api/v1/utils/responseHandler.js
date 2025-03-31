// src/utils/responseHandler.js

const successResponse = (res, { code = 200, message = '', data = null }) => {
  return res.status(code).json({
    success: true,
    message,
    data
  });
};

const errorResponse = (res, { code = 400, message = 'Error', error = null }) => {
  return res.status(code).json({
    success: false,
    message,
    error
  });
};

module.exports = {
  successResponse,
  errorResponse
};
