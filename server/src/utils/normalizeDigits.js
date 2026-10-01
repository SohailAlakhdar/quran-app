// utils/normalizeDigits.js
const AR = '٠١٢٣٤٥٦٧٨٩';
const FA = '۰۱۲۳۴۵۶۷۸۹';

function toEnglishDigits(value) {
  if (typeof value !== 'string') return value;
  return value
    .replace(/[٠-٩]/g, (d) => AR.indexOf(d))
    .replace(/[۰-۹]/g, (d) => FA.indexOf(d));
}

function normalizeBodyDigits(fields = []) {
  return (req, res, next) => {
    if (req.body && typeof req.body === 'object') {
      const keys = fields.length ? fields : Object.keys(req.body);
      for (const key of keys) {
        req.body[key] = toEnglishDigits(req.body[key]);
      }
    }
    next();
  };
}

module.exports = { toEnglishDigits, normalizeBodyDigits };