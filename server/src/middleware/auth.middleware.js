const { verifyToken } = require('../utils/jwt');
const { error } = require('../utils/apiResponse');
const User = require('../models/User');

async function protect(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    if (!authHeader.startsWith('Bearer ')) {
      return error(res, 401, 'غير مصرح، الرجاء تسجيل الدخول.');
    }
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    const user = await User.findById(decoded.userId);
    if (!user) {
      return error(res, 401, 'المستخدم غير موجود.');
    }

    req.user = user;
    next();
  } catch (err) {
    return error(res, 401, 'جلسة غير صالحة أو منتهية، الرجاء تسجيل الدخول مرة أخرى.');
  }
}

module.exports = { protect };
