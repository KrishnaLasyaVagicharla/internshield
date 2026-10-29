/**
 * Admin Panel & SSR Routes
 * Syllabus: Exp 2 (EJS Server Side Rendering & Form Submissions)
 */
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { requireAdmin } = require('../middleware/auth');

// Public Admin Auth Routes
router.get('/login', adminController.getLoginPage);
router.post('/login', adminController.postLogin);
router.get('/logout', adminController.logoutAdmin);

// Protected Admin Dashboard Routes
router.get('/', requireAdmin, adminController.getDashboard);
router.get('/reports', requireAdmin, adminController.getReportsPage);
router.post('/reports/:id', requireAdmin, adminController.handleReportAction);
router.get('/internships/new', requireAdmin, adminController.getAddInternshipPage);
router.post('/internships', requireAdmin, adminController.postAddInternship);

module.exports = router;
