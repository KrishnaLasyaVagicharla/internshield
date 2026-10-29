/**
 * Recommendations Routes
 * Syllabus: Exp 11 (Authenticated recommendation engine)
 */
const express = require('express');
const router = express.Router();
const recommendController = require('../controllers/recommendController');
const { requireLogin } = require('../middleware/auth');

router.get('/', requireLogin, recommendController.getRecommendations);

module.exports = router;
