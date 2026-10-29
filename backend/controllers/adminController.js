/**
 * Admin Panel & EJS SSR Controller
 * Syllabus: Exp 2 (Server-Side Templating with EJS, HTML Forms, application/x-www-form-urlencoded processing)
 */
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Internship = require('../models/Internship');
const Report = require('../models/Report');
const { createAlertsForInternship } = require('../utils/alertJob');

/**
 * Public About Page rendered via EJS (Exp 2)
 * GET /about
 */
const getAboutPage = (req, res) => {
  res.render('about', {
    title: 'About InternShield',
    features: [
      { name: 'Fake Internship Detector', desc: 'Rule-based scoring to safeguard students.' },
      { name: 'ATS Resume Builder', desc: 'Tailors resumes directly to job descriptions without fabricating data.' },
      { name: 'Verified Match Engine', desc: 'Recommends vetted internships matching your tech stack.' },
      { name: 'Fraudster Registry', desc: 'Crowdsourced blacklist with administrative verification.' },
      { name: 'Skill Gap Analyzer', desc: 'Identifies missing role requirements and suggests free courses.' }
    ],
    courseName: 'Full Stack Development (FSD)',
    year: new Date().getFullYear()
  });
};

/**
 * Admin Login Page
 * GET /admin/login
 */
const getLoginPage = (req, res) => {
  if (req.session && req.session.userId && req.session.role === 'admin') {
    return res.redirect('/admin');
  }
  res.render('admin-login', {
    error: req.query.error || null,
    title: 'Admin Login | InternShield'
  });
};

/**
 * Handle Admin Login Form POST
 * POST /admin/login
 */
const postLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: (email || '').toLowerCase() });

    if (!user || user.role !== 'admin') {
      return res.render('admin-login', {
        error: 'Invalid admin credentials or insufficient role.',
        title: 'Admin Login | InternShield'
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.render('admin-login', {
        error: 'Invalid admin credentials.',
        title: 'Admin Login | InternShield'
      });
    }

    req.session.userId = user._id;
    req.session.role = user.role;
    res.redirect('/admin');
  } catch (error) {
    next(error);
  }
};

/**
 * Handle Admin Logout
 * GET /admin/logout
 */
const logoutAdmin = (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.redirect('/admin/login');
  });
};

/**
 * Admin Dashboard View (Counts, Recent users, Recent internships)
 * GET /admin
 */
const getDashboard = async (req, res, next) => {
  try {
    const [userCount, internshipCount, pendingReportsCount, verifiedInternshipsCount, recentReports, recentInternships] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      Internship.countDocuments(),
      Report.countDocuments({ status: 'pending' }),
      Internship.countDocuments({ verified: true }),
      Report.find().sort({ createdAt: -1 }).limit(5).populate('reportedBy', 'name email'),
      Internship.find().sort({ createdAt: -1 }).limit(5)
    ]);

    res.render('admin-dashboard', {
      title: 'Admin Overview | InternShield',
      user: req.user,
      stats: {
        students: userCount,
        internships: internshipCount,
        verified: verifiedInternshipsCount,
        pendingReports: pendingReportsCount
      },
      recentReports,
      recentInternships
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin Reports Management View
 * GET /admin/reports
 */
const getReportsPage = async (req, res, next) => {
  try {
    const reports = await Report.find()
      .populate('reportedBy', 'name email')
      .sort({ createdAt: -1 });

    res.render('admin-reports', {
      title: 'Fraud Reports | InternShield Admin',
      user: req.user,
      reports,
      message: req.query.msg || null
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Handle Report Moderation (Approve / Reject)
 * POST /admin/reports/:id
 */
const handleReportAction = async (req, res, next) => {
  try {
    const { action } = req.body; // 'approve' or 'reject'
    const status = action === 'approve' ? 'approved' : 'rejected';

    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!report) {
      return res.redirect('/admin/reports?msg=Report+not+found');
    }

    res.redirect(`/admin/reports?msg=Report+${status}+successfully`);
  } catch (error) {
    next(error);
  }
};

/**
 * Add New Internship View (HTML Form - Exp 2)
 * GET /admin/internships/new
 */
const getAddInternshipPage = (req, res) => {
  res.render('admin-add-internship', {
    title: 'Post New Internship | Admin',
    user: req.user,
    error: null
  });
};

/**
 * Process Add Internship Form POST
 * POST /admin/internships
 */
const postAddInternship = async (req, res, next) => {
  try {
    const {
      title,
      company,
      description,
      requiredSkills,
      location,
      stipend,
      mode,
      applyLink,
      recruiterEmail,
      recruiterPhone,
      verified,
      trustScore
    } = req.body;

    const skillsArray = (requiredSkills || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const isVerified = verified === 'on' || verified === 'true' || verified === true;

    const newInternship = await Internship.create({
      title,
      company,
      description,
      requiredSkills: skillsArray,
      location: location || 'Remote',
      stipend: stipend ? Number(stipend) : 0,
      mode: mode || 'remote',
      applyLink: applyLink || '',
      recruiterEmail: recruiterEmail || '',
      recruiterPhone: recruiterPhone || '',
      verified: isVerified,
      trustScore: trustScore ? Number(trustScore) : 100
    });

    // If verified, trigger alert matching job immediately
    if (newInternship.verified) {
      createAlertsForInternship(newInternship).catch(err =>
        console.error('[Admin] Alert dispatch error:', err.message)
      );
    }

    res.redirect('/admin');
  } catch (error) {
    res.render('admin-add-internship', {
      title: 'Post New Internship | Admin',
      user: req.user,
      error: error.message
    });
  }
};

module.exports = {
  getAboutPage,
  getLoginPage,
  postLogin,
  logoutAdmin,
  getDashboard,
  getReportsPage,
  handleReportAction,
  getAddInternshipPage,
  postAddInternship
};
