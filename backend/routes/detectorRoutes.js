/**
 * Detector Routes
 * Syllabus: Exp 11 (Rule engine POST endpoint)
 */
const express = require('express');
const router = express.Router();
const detectorController = require('../controllers/detectorController');

router.post('/analyze', detectorController.analyze);

module.exports = router;
