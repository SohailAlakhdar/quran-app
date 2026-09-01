const { validationResult } = require('express-validator');
const { error } = require('../utils/apiResponse');

function validate(req, res, next) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return error(
      res,
      422,
      'توجد بيانات غير صحيحة في الطلب.',
      result.array().map((e) => ({ field: e.path, message: e.msg }))
    );
  }
  next();
}

module.exports = { validate };
