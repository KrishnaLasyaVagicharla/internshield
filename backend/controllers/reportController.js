/**
 * Recruiter Check & Reporting Controller
 * Syllabus: Exp 11 (Blacklist verification, phone/email validation, student reporting workflows)
 */
const Report = require('../models/Report');

/**
 * Check if recruiter email or phone has been reported or flags suspicious patterns
 * GET /api/reports/check?type=email|phone&value=...
 */
const checkRecruiter = async (req, res, next) => {
  try {
    const { type, value } = req.query;

    if (!type || !value) {
      return res.status(400).json({
        success: false,
        message: 'Both "type" (email|phone) and "value" query parameters are required.'
      });
    }

    const cleanValue = value.trim().toLowerCase();
    const warnings = [];

    // Pattern Checks
    if (type === 'email') {
      const freeDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'rediffmail.com', 'yandex.com'];
      const domain = cleanValue.includes('@') ? cleanValue.split('@')[1] : '';
      if (freeDomains.includes(domain)) {
        warnings.push(`Warning: "${cleanValue}" uses a free generic domain (${domain}) rather than an enterprise domain.`);
      }
    } else if (type === 'phone') {
      // Clean digits
      const digits = cleanValue.replace(/\D/g, '');
      // Standard Indian 10-digit mobile number starts with 6, 7, 8, or 9
      const validIndianPhone = /^[6-9]\d{9}$/;
      if (!validIndianPhone.test(digits)) {
        warnings.push(`Warning: "${cleanValue}" is not a standard 10-digit Indian mobile number.`);
      }
    }

    // Query DB for approved reports
    const reports = await Report.find({
      type,
      value: cleanValue,
      status: 'approved'
    }).select('reason createdAt');

    const count = reports.length;
    const reported = count > 0;

    let riskLevel = 'Safe';
    if (reported) {
      riskLevel = count >= 3 ? 'High Risk (Blacklisted)' : 'Moderate Risk (Reported)';
    } else if (warnings.length > 0) {
      riskLevel = 'Caution (Unverified Pattern)';
    }

    res.status(200).json({
      success: true,
      data: {
        type,
        value: cleanValue,
        reported,
        count,
        riskLevel,
        reasons: reports.map(r => r.reason),
        warnings
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new scam / fraud report (Student action, enters "pending" status for admin review)
 * POST /api/reports
 */
const createReport = async (req, res, next) => {
  try {
    const { type, value, reason } = req.body;

    if (!type || !value || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Type, value, and reason are required to file a report.'
      });
    }

    const report = await Report.create({
      type,
      value: value.trim().toLowerCase(),
      reason: reason.trim(),
      reportedBy: req.user._id,
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'Report submitted successfully. An administrator will review and verify this entry.',
      data: report
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get reports submitted by the logged-in user
 * GET /api/reports/mine
 */
const getMyReports = async (req, res, next) => {
  try {
    const reports = await Report.find({ reportedBy: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: reports
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a report (Owner or Admin)
 * DELETE /api/reports/:id
 */
const deleteReport = async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found.'
      });
    }

    // Check ownership or admin role
    const isOwner = report.reportedBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this report.'
      });
    }

    await Report.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Report deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  checkRecruiter,
  createReport,
  getMyReports,
  deleteReport
};
