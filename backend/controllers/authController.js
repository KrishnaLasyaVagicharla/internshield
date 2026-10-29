/**
 * Authentication Controller
 * Syllabus: Exp 11 (Session & Cookie Authentication, Password Hashing with Bcrypt)
 */
const bcrypt = require('bcryptjs');
const User = require('../models/User');

/**
 * Register a new user
 * POST /api/auth/register
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password, role, skills, education, targetRole } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists.'
      });
    }

    // Hash password using bcrypt (Exp 11 security requirement)
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user in database
    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: role === 'admin' ? 'admin' : 'student',
      skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : []),
      education: education || {},
      targetRole: targetRole || 'Web Developer'
    });

    // Start session in MongoDB via express-session + connect-mongo
    req.session.userId = newUser._id;
    req.session.role = newUser.role;

    res.status(201).json({
      success: true,
      message: 'Account created successfully! Session started.',
      data: newUser.toSafeObject()
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login user and initialize session
 * POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.'
      });
    }

    // Retrieve user including passwordHash
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // Compare plain-text password with stored bcrypt hash
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // Store user ID in session
    req.session.userId = user._id;
    req.session.role = user.role;

    // Ensure session cookie options conform to standards
    req.session.cookie.maxAge = 24 * 60 * 60 * 1000; // 1 day in milliseconds
    req.session.cookie.httpOnly = true;

    res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      data: user.toSafeObject()
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Logout user and destroy session
 * POST /api/auth/logout
 */
const logout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      return next(err);
    }
    // Clear session cookie
    res.clearCookie('connect.sid', { path: '/' });
    res.status(200).json({
      success: true,
      message: 'Logged out successfully.'
    });
  });
};

/**
 * Get current session user
 * GET /api/auth/me
 */
const getCurrentUser = async (req, res) => {
  // Attached by requireLogin middleware
  res.status(200).json({
    success: true,
    data: req.user.toSafeObject()
  });
};

/**
 * Update student profile (skills, education, target role)
 * PUT /api/auth/profile
 */
const updateProfile = async (req, res, next) => {
  try {
    const { skills, education, targetRole, name } = req.body;
    const user = req.user;

    if (name) user.name = name;
    if (skills) {
      user.skills = Array.isArray(skills)
        ? skills
        : skills.split(',').map((s) => s.trim()).filter(Boolean);
    }
    if (education) user.education = education;
    if (targetRole) user.targetRole = targetRole;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      data: user.toSafeObject()
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  getCurrentUser,
  updateProfile
};
