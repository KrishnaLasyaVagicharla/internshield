/**
 * Authentication Routes
 * Syllabus: Exp 11 (Session-based Auth, express-validator validation pipelines)
 */
const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const authController = require('../controllers/authController');
const { requireLogin } = require('../middleware/auth');
const validate = require('../middleware/validate');

// Validation rules
const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email address is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  validate
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email address is required'),
  body('password').notEmpty().withMessage('Password is required'),
  validate
];

// Mount endpoints
router.post('/register', registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);
router.post('/logout', authController.logout);
router.get('/me', requireLogin, authController.getCurrentUser);
router.put('/profile', requireLogin, authController.updateProfile);

module.exports = router;
