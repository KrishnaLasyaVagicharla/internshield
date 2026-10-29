/**
 * Centralized Error-Handling Middleware
 * Syllabus: Exp 11 & Express Best Practices (4-argument error handler)
 */
const errorHandler = (err, req, res, next) => {
  console.error(`[Error] ${req.method} ${req.originalUrl}:`, err);

  const statusCode = err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);

  // Mongoose validation error formatting
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({
      success: false,
      message: messages.join('. ')
    });
  }

  // Duplicate key error (e.g. unique email or unique compound index)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(409).json({
      success: false,
      message: `A record with this ${field} already exists.`
    });
  }

  // JWT / CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: `Invalid format for parameter: ${err.path}`
    });
  }

  // HTML response if requested by browser and not API
  if (req.accepts('html') && !req.path.startsWith('/api')) {
    return res.status(statusCode).send(`
      <!DOCTYPE html>
      <html>
        <head><title>Error ${statusCode}</title><style>body{font-family:sans-serif;padding:40px;text-align:center;color:#333;}</style></head>
        <body>
          <h1>Error ${statusCode}</h1>
          <p>${err.message || 'An unexpected error occurred.'}</p>
          <a href="/admin">Return to Admin Dashboard</a>
        </body>
      </html>
    `);
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
};

module.exports = errorHandler;
