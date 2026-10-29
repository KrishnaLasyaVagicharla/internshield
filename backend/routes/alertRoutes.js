/**
 * Alert Routes
 * Syllabus: Exp 11 (Alerts & notification management)
 */
const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');
const { requireLogin } = require('../middleware/auth');

router.use(requireLogin);

router.get('/', alertController.getAlerts);
router.patch('/read-all', alertController.markAllAsRead);
router.patch('/:id/read', alertController.markAlertAsRead);
router.delete('/:id', alertController.deleteAlert);

module.exports = router;
