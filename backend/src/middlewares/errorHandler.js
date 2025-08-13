export default function errorHandler(err, req, res, _next) {
  console.error('💥', err);
  res.status(500).json({ error: err.message || 'Server error' });
}
