const User = require('../models/User');
const { signToken } = require('../utils/jwt');
const { success, error } = require('../utils/apiResponse');

// POST /api/auth/signup
async function signup(req, res, next) {
  try {
    const { firstName, password } = req.body;

    // Public signup can only ever create "child" accounts, regardless of
    // any role field an attacker might try to inject.
    const user = await User.create({ firstName, password, role: 'child' });

    const token = signToken({ userId: user._id, role: user.role });
    return success(res, 201, 'تم إنشاء الحساب بنجاح.', { token, user: user.toSafeObject() });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/login
async function login(req, res, next) {
  try {
    const { firstName, password } = req.body;

    const user = await User.findOne({ firstName }).select('+password');
    if (!user) {
      return error(res, 401, 'بيانات الدخول غير صحيحة.');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return error(res, 401, 'بيانات الدخول غير صحيحة.');
    }

    user.lastActivity = new Date();
    await user.save();

    const token = signToken({ userId: user._id, role: user.role });
    return success(res, 200, 'تم تسجيل الدخول بنجاح.', { token, user: user.toSafeObject() });
  } catch (err) {
    next(err);
  }
}

// GET /api/auth/me
async function me(req, res, next) {
  try {
    return success(res, 200, 'تم جلب بيانات المستخدم.', { user: req.user.toSafeObject() });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/logout
async function logout(req, res, next) {
  // JWT auth is stateless; logout is handled client-side by discarding the
  // token. This endpoint exists for API completeness / future blacklisting.
  return success(res, 200, 'تم تسجيل الخروج بنجاح.');
}

module.exports = { signup, login, me, logout };
