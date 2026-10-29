/**
 * Report Routes
 * Syllabus: Exp 11 (Reporting & verification routes)
 */
const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { requireLogin } = require('../middleware/auth');

// Public lookup
router.get('/check', reportController.checkRecruiter);

// Authenticated reporting routes
router.post('/', requireLogin, reportController.createReport);
router.get('/mine', requireLogin, reportController.getMyReports);
router.delete('/:id', requireLogin, reportController.deleteReport);

module.exports = router;
