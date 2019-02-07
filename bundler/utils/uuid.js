/**
 * Generate UUID
 */
module.exports = function uuid(
  m = Math,
  d = Date,
  h = 16,
  s = _s => m.floor(_s).toString(h),
) {
  return s(d.now() / 1000) + ' '.repeat(h)
    .replace(/./g, () => s(m.random() * h));
};
