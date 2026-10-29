/**
 * InternShield Backend Server
 * Syllabus: Exp 1, 2, 3, 6, 11 (Express Architecture, Middleware, Routing, Sessions, EJS)
 */
require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');

const connectDB = require('./config/db');
const requestLogger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const { initAlertCron } = require('./utils/alertJob');

// Route imports
const authRoutes = require('./routes/authRoutes');
const internshipRoutes = require('./routes/internshipRoutes');
const detectorRoutes = require('./routes/detectorRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const recommendRoutes = require('./routes/recommendRoutes');
const reportRoutes = require('./routes/reportRoutes');
const skillGapRoutes = require('./routes/skillGapRoutes');
const alertRoutes = require('./routes/alertRoutes');
const demoRoutes = require('./routes/demoRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { getAboutPage } = require('./controllers/adminController');

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
const isProduction = process.env.NODE_ENV === 'production';

// Trust first proxy (Render, Railway, etc.) so secure cookies & rate-limiting work
app.set('trust proxy', 1);

// Connect to Database
connectDB();

// 1. View Engine Setup (Exp 2: EJS Templating)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 2. Built-in & Third-Party Middlewares (Exp 6)
app.use(morgan('dev')); // HTTP request logger
app.use(requestLogger); // Custom Application-level logger middleware

// CORS configuration supporting session cookies from frontend
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key']
  })
);

// Body parsers (Built-in middleware)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parser (Exp 11)
app.use(cookieParser());

// Static files (Built-in middleware)
app.use(express.static(path.join(__dirname, 'public')));

// 3. Stateful Session Middleware stored in MongoDB (Exp 11)
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'internshield_super_secret_session_key_2026',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      clientPromise: mongoose.connection.asPromise().then(c => c.getClient()),
      collectionName: 'sessions',
      ttl: 24 * 60 * 60 // 1 day
    }),
    cookie: {
      httpOnly: true, // Mitigates XSS cookie theft
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    }
  })
);

// 4. Public SSR Routes (Exp 2)
app.get('/about', getAboutPage);

// 5. Mount API Endpoints (Exp 1, 3, 11)
app.use('/api/auth', authRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api/detector', detectorRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/recommend', recommendRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/skillgap', skillGapRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/demo', demoRoutes);

// 6. Mount EJS Admin Panel (Exp 2)
app.use('/admin', adminRoutes);

// Health check endpoint for uptime monitoring
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

// Root health check endpoint
app.get('/', (req, res) => {
  res.json({
    project: 'InternShield API & Admin Portal',
    status: 'Operational',
    version: '1.0.0',
    documentation: '/api/demo/hello',
    adminPanel: '/admin',
    publicAbout: '/about'
  });
});

// 7. 404 Route Handler
app.use('*', (req, res) => {
  if (req.accepts('html') && !req.path.startsWith('/api')) {
    return res.status(404).render('about', {
      title: '404 - Page Not Found',
      features: [],
      courseName: 'Full Stack Development',
      year: new Date().getFullYear()
    });
  }
  res.status(404).json({
    success: false,
    message: `Resource not found for ${req.method} ${req.originalUrl}`
  });
});

// 8. Centralized 4-argument Error Handling Middleware (Exp 6, 11)
app.use(errorHandler);

// 9. Initialize node-cron automated background worker (Exp 11)
initAlertCron();

// Start HTTP Server
const server = app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🛡️  InternShield Backend Running on Port ${PORT}`);
  console.log(`📡 API Endpoints: http://localhost:${PORT}/api`);
  console.log(`🖥️  Admin Dashboard (EJS): http://localhost:${PORT}/admin`);
  console.log(`📄 Public SSR Page: http://localhost:${PORT}/about`);
  console.log(`🎓 Demo Routes (Exp 1-3, 11): http://localhost:${PORT}/api/demo/hello`);
  console.log(`====================================================`);
});

module.exports = { app, server };
