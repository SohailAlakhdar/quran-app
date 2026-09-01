const { error } = require('../utils/apiResponse');

function adminOnly(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return error(res, 403, 'هذه الصفحة مخصصة للمشرفين فقط.');
  }
  next();
}

module.exports = { adminOnly };
