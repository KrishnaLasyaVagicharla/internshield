/**
 * Demo Routes
 * Syllabus: Exp 1, 2, 3, 6, 11 Demonstration Route Handlers
 */
const express = require('express');
const router = express.Router();
const demoController = require('../controllers/demoController');

// Route-level middleware demonstration (Exp 6)
const checkApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'] || req.query.key;
  if (!apiKey || apiKey !== 'demo-secret-key') {
    return res.status(403).json({
      success: false,
      concept: 'Exp 6: Route-level Middleware',
      message: 'Access denied: Route-level middleware requires valid x-api-key header or ?key=demo-secret-key query parameter.'
    });
  }
  next();
};

// a. Defining routes + handling routes (Exp 1a)
router.get('/hello', demoController.getHello);

// b. Route parameters (Exp 3a)
router.get('/users/:id', demoController.getUserById);

// c. Query parameters (Exp 3b)
router.get('/search', demoController.searchDemo);

// d. URL building (Exp 3c)
router.get('/url-building', demoController.urlBuildingDemo);

// e. HTTP methods demonstration (Exp 1b)
router.post('/items', demoController.createItem);
router.get('/items', demoController.getItems);
router.delete('/items/:id', demoController.deleteItem);

// f. Route-level middleware demonstration (Exp 6)
router.get('/protected-by-key', checkApiKey, (req, res) => {
  res.json({
    concept: 'Exp 6: Route-level Middleware',
    message: 'Authorized! The checkApiKey middleware verified your credentials successfully.',
    accessGrantedAt: new Date().toISOString()
  });
});

// g. Cookies (Exp 11)
router.get('/set-cookie', demoController.setCookieDemo);
router.get('/read-cookie', demoController.readCookieDemo);
router.get('/clear-cookie', demoController.clearCookieDemo);

// h. Session view counter (Exp 11)
router.get('/visits', demoController.sessionCounterDemo);

// Error middleware demonstration
router.get('/trigger-error', demoController.triggerErrorDemo);

module.exports = router;
