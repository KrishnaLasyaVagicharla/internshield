/**
 * Skill Gap Routes
 * Syllabus: Exp 11 (Skill Gap Analysis API)
 */
const express = require('express');
const router = express.Router();
const skillGapController = require('../controllers/skillGapController');
const { requireLogin } = require('../middleware/auth');

router.get('/', requireLogin, skillGapController.getSkillGap);

module.exports = router;
