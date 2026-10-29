/**
 * Authentication & Authorization Middleware
 * Syllabus: Exp 11 (Session & Cookie-based access control)
 */
const User = require('../models/User');

/**
 * Ensures the request is authenticated via an active session.
 */
const requireLogin = async (req, res, next) => {
  try {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please login.'
      });
    }

    // Attach active user to req.user for downstream controllers
    const user = await User.findById(req.session.userId);
    if (!user) {
      req.session.destroy();
      return res.status(401).json({
        success: false,
        message: 'User session expired or invalid. Please login again.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Ensures the authenticated user has the 'admin' role.
 */
const requireAdmin = async (req, res, next) => {
  try {
    if (!req.session || !req.session.userId) {
      // If request came from browser admin page, redirect to login
      if (req.accepts('html') && !req.xhr && !req.path.startsWith('/api')) {
        return res.redirect('/admin/login?error=Please+login+as+admin');
      }
      return res.status(401).json({
        success: false,
        message: 'Admin authentication required.'
      });
    }

    const user = await User.findById(req.session.userId);
    if (!user || user.role !== 'admin') {
      if (req.accepts('html') && !req.xhr && !req.path.startsWith('/api')) {
        return res.status(403).render('error', {
          message: 'Access denied: Administrator privileges required.'
        });
      }
      return res.status(403).json({
        success: false,
        message: 'Access denied: Admin privileges required.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  requireLogin,
  requireAdmin
};
