/**
 * Internship Routes
 * Syllabus: Exp 1, 3 (Routing, HTTP Methods, Route Parameters & Query Parameters)
 */
const express = require('express');
const router = express.Router();

const internshipController = require('../controllers/internshipController');
const { requireAdmin } = require('../middleware/auth');

// Public read endpoints (Search, Filter, List, Details)
router.get('/', internshipController.getInternships);
router.get('/:id', internshipController.getInternshipById);

// Admin-protected mutation endpoints
router.post('/', requireAdmin, internshipController.createInternship);
router.put('/:id', requireAdmin, internshipController.updateInternship);
router.delete('/:id', requireAdmin, internshipController.deleteInternship);

module.exports = router;
