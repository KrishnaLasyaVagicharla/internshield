/**
 * Fake vs Real Internship Detector Controller
 * Syllabus: Exp 11 (Rule evaluation, DB lookups, Session-aware analytics)
 */
const { analyzeInternship } = require('../utils/detector');
const User = require('../models/User');

/**
 * Analyze an internship listing or message for fraud signals
 * POST /api/detector/analyze
 */
const analyze = async (req, res, next) => {
  try {
    const { text, company, recruiterEmail, recruiterPhone, link, stipend } = req.body;

    if (!text && !company && !recruiterEmail && !recruiterPhone && !link) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least a job description, company name, recruiter email/phone, or link to analyze.'
      });
    }

    const analysisResult = await analyzeInternship({
      text: text || '',
      company: company || '',
      recruiterEmail: recruiterEmail || '',
      recruiterPhone: recruiterPhone || '',
      link: link || '',
      stipend: stipend || 0
    });

    // If user is authenticated in the session, record scan in their history
    if (req.session && req.session.userId) {
      try {
        await User.findByIdAndUpdate(req.session.userId, {
          $push: {
            recentScans: {
              $each: [
                {
                  company: company || 'Unnamed Listing',
                  trustScore: analysisResult.trustScore,
                  verdict: analysisResult.verdict,
                  scannedAt: new Date()
                }
              ],
              $slice: -10 // Keep last 10 scans
            }
          }
        });
      } catch (err) {
        console.error('Failed to append scan to user history:', err.message);
      }
    }

    res.status(200).json({
      success: true,
      data: analysisResult
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  analyze
};
