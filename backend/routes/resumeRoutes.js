/**
 * Resume Routes
 * Syllabus: Exp 11 (Resume ATS scoring & Tailoring endpoints)
 */
const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resumeController');

router.post('/analyze', resumeController.analyzeResume);
router.post('/tailor', resumeController.tailorResume);

module.exports = router;
