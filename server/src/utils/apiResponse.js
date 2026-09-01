function success(res, statusCode, message, data = {}) {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
}

function error(res, statusCode, message, errors = []) {
  return res.status(statusCode).json({
    success: false,
    message,
    errors
  });
}

module.exports = { success, error };
