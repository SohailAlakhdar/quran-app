const { error } = require('../utils/apiResponse');

// 404 handler
function notFound(req, res, next) {
  return error(res, 404, 'الصفحة أو المورد المطلوب غير موجود.');
}

// Central error handler
function errorHandler(err, req, res, next) {
  console.error('[ERROR]', err);

  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => ({ message: e.message }));
    return error(res, 422, 'توجد بيانات غير صحيحة.', errors);
  }

  if (err.name === 'CastError') {
    return error(res, 400, 'المعرف المرسل غير صالح.');
  }

  if (err.code === 11000) {
    return error(res, 409, 'البيانات موجودة مسبقاً.');
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'حدث خطأ في الخادم، حاول مرة أخرى.';
  return error(res, statusCode, message);
}

module.exports = { notFound, errorHandler };
