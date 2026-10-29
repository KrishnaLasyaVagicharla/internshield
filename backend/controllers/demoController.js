/**
 * Demo Controller (Syllabus Lab Experiments 1, 2, 3, 11 Demonstration)
 * Contains isolated, beginner-friendly examples for student viva examination.
 */

// In-Memory store for demonstration of HTTP Methods (POST, GET, DELETE)
let inMemoryItems = [
  { id: '1', title: 'React Hooks Guide', category: 'Frontend' },
  { id: '2', title: 'Express Routing Cheatsheet', category: 'Backend' },
  { id: '3', title: 'MongoDB Aggregation Pipelines', category: 'Database' }
];

/**
 * Exp 1a: Defining & Handling a basic route
 * GET /api/demo/hello
 */
const getHello = (req, res) => {
  res.json({
    concept: 'Exp 1a: Defining and Handling Routes',
    message: 'Hello from InternShield Express Server!',
    timestamp: new Date().toISOString()
  });
};

/**
 * Exp 3a: Route Parameters (req.params)
 * GET /api/demo/users/:id
 */
const getUserById = (req, res) => {
  const userId = req.params.id; // Extracts :id from URL path
  res.json({
    concept: 'Exp 3a: Route Parameters',
    description: 'Extracted parameters from the URL path pattern /users/:id',
    paramsReceived: req.params,
    userId: userId,
    mockUser: {
      id: userId,
      name: `Student Demo User #${userId}`,
      role: 'student'
    }
  });
};

/**
 * Exp 3b: Query Parameters (req.query)
 * GET /api/demo/search?q=node&limit=5
 */
const searchDemo = (req, res) => {
  const query = req.query.q || 'all';
  const limit = parseInt(req.query.limit, 10) || 10;

  res.json({
    concept: 'Exp 3b: Query Parameters',
    description: 'Parsed key-value pairs from URL query string after ?',
    queryReceived: req.query,
    searchTerm: query,
    resultLimit: limit,
    results: [
      `Result 1 matching "${query}"`,
      `Result 2 matching "${query}"`
    ].slice(0, limit)
  });
};

/**
 * Exp 3c: URL Building
 * GET /api/demo/url-building
 */
const urlBuildingDemo = (req, res) => {
  const protocol = req.protocol; // http or https
  const host = req.get('host'); // localhost:5000
  const originalUrl = req.originalUrl;

  // Construct absolute URL using Web URL API
  const fullUrl = new URL(originalUrl, `${protocol}://${host}`);

  // Construct next/prev page links using URLSearchParams
  const searchParams = new URLSearchParams(fullUrl.search);
  searchParams.set('page', '2');
  searchParams.set('format', 'json');

  const generatedNextLink = `${fullUrl.origin}${fullUrl.pathname}?${searchParams.toString()}`;

  res.json({
    concept: 'Exp 3c: URL Building using req & URL API',
    extracted: {
      protocol,
      host,
      originalUrl,
      href: fullUrl.href,
      pathname: fullUrl.pathname
    },
    generatedNextLink
  });
};

/**
 * Exp 1b: HTTP POST - Accepting data & adding to in-memory collection
 * POST /api/demo/items
 */
const createItem = (req, res) => {
  const { title, category } = req.body;
  if (!title) {
    return res.status(400).json({ success: false, message: 'Item title is required.' });
  }

  const newItem = {
    id: (inMemoryItems.length + 1).toString(),
    title,
    category: category || 'General'
  };
  inMemoryItems.push(newItem);

  res.status(201).json({
    concept: 'Exp 1b: HTTP POST Method',
    message: 'Item created and added to in-memory array',
    data: newItem
  });
};

/**
 * Exp 1b: HTTP GET - Retrieving items
 * GET /api/demo/items
 */
const getItems = (req, res) => {
  res.json({
    concept: 'Exp 1b: HTTP GET Method',
    count: inMemoryItems.length,
    data: inMemoryItems
  });
};

/**
 * Exp 1b: HTTP DELETE - Removing a specified resource
 * DELETE /api/demo/items/:id
 */
const deleteItem = (req, res) => {
  const itemId = req.params.id;
  const initialCount = inMemoryItems.length;
  inMemoryItems = inMemoryItems.filter(item => item.id !== itemId);

  if (inMemoryItems.length === initialCount) {
    return res.status(404).json({ success: false, message: `Item with id ${itemId} not found.` });
  }

  res.json({
    concept: 'Exp 1b: HTTP DELETE Method',
    message: `Item #${itemId} deleted successfully.`,
    remainingCount: inMemoryItems.length
  });
};

/**
 * Exp 11: Cookies Demonstration
 * GET /api/demo/set-cookie
 * GET /api/demo/read-cookie
 * GET /api/demo/clear-cookie
 */
const setCookieDemo = (req, res) => {
  // Set an HTTP cookie with options (httpOnly prevents client XSS access)
  res.cookie('internshield_test_cookie', 'DemonstrationCookieValue_12345', {
    maxAge: 3600000, // 1 hour
    httpOnly: true,
    sameSite: 'lax'
  });

  res.json({
    concept: 'Exp 11: Setting Cookies',
    message: 'Cookie "internshield_test_cookie" set in response headers!'
  });
};

const readCookieDemo = (req, res) => {
  // Read cookies parsed by cookie-parser middleware
  const cookies = req.cookies;
  res.json({
    concept: 'Exp 11: Reading Cookies via cookie-parser',
    receivedCookies: cookies,
    testCookie: cookies.internshield_test_cookie || 'Cookie not found. Visit /set-cookie first.'
  });
};

const clearCookieDemo = (req, res) => {
  res.clearCookie('internshield_test_cookie');
  res.json({
    concept: 'Exp 11: Clearing Cookies',
    message: 'Cookie "internshield_test_cookie" cleared!'
  });
};

/**
 * Exp 11: Session Counter (Stateful Session tracking)
 * GET /api/demo/visits
 */
const sessionCounterDemo = (req, res) => {
  if (!req.session.visitCount) {
    req.session.visitCount = 1;
  } else {
    req.session.visitCount += 1;
  }

  res.json({
    concept: 'Exp 11: Session Tracking using express-session + connect-mongo',
    sessionId: req.sessionID,
    visitCount: req.session.visitCount,
    message: `You have visited this session endpoint ${req.session.visitCount} time(s).`
  });
};

/**
 * Trigger deliberate error for 4-argument error-handling middleware test
 * GET /api/demo/trigger-error
 */
const triggerErrorDemo = (req, res, next) => {
  const demoError = new Error('This is a simulated error demonstrating centralized Express error middleware.');
  demoError.statusCode = 418; // I'm a teapot demo code
  next(demoError);
};

module.exports = {
  getHello,
  getUserById,
  searchDemo,
  urlBuildingDemo,
  createItem,
  getItems,
  deleteItem,
  setCookieDemo,
  readCookieDemo,
  clearCookieDemo,
  sessionCounterDemo,
  triggerErrorDemo
};
