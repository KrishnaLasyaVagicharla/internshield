/**
 * Job & Internship Recommendations Controller
 * Syllabus: Exp 11 (Matching algorithms, filtering verified postings, user profile integration)
 */
const Internship = require('../models/Internship');
const { calculateSkillMatch } = require('../utils/matcher');

/**
 * Get personalized internship recommendations based on user skills
 * GET /api/recommend
 */
const getRecommendations = async (req, res, next) => {
  try {
    const user = req.user; // Provided by requireLogin middleware
    const userSkills = user.skills || [];

    // Query only verified internships
    const verifiedInternships = await Internship.find({ verified: true }).lean();

    // Compute matches
    const scoredListings = verifiedInternships.map((internship) => {
      const matchData = calculateSkillMatch(userSkills, internship.requiredSkills);
      return {
        ...internship,
        matchPercent: matchData.matchPercent,
        matchedSkills: matchData.matchedSkills,
        missingSkills: matchData.missingSkills
      };
    });

    // Sort descending by matchPercent, then by trustScore
    scoredListings.sort((a, b) => {
      if (b.matchPercent !== a.matchPercent) {
        return b.matchPercent - a.matchPercent;
      }
      return b.trustScore - a.trustScore;
    });

    // Take top 10 recommendations
    const topRecommendations = scoredListings.slice(0, 10);

    res.status(200).json({
      success: true,
      userSkills,
      count: topRecommendations.length,
      data: topRecommendations
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRecommendations
};
