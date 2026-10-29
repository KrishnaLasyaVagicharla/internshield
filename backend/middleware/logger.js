/**
 * Custom Logger Middleware (Application-Level Middleware)
 * Syllabus: Exp 1b & 6 (Middleware in Express)
 * Logs HTTP Method, Request URL, timestamp, and duration
 */
const requestLogger = (req, res, next) => {
  const start = Date.now();
  const timestamp = new Date().toISOString();

  // Hook into response finish event to record completion time
  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;
    const color = statusCode >= 400 ? '\x1b[31m' : '\x1b[32m'; // Red for errors, green for success
    const reset = '\x1b[0m';

    console.log(
      `[REQ] ${timestamp} | ${req.method.padEnd(6)} ${req.originalUrl} | ${color}${statusCode}${reset} | ${duration}ms`
    );
  });

  next();
};

module.exports = requestLogger;
