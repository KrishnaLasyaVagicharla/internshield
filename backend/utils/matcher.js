/**
 * Skill Matcher Utility
 * Syllabus: Exp 11 (Array manipulation, Set operations, Jaccard/Matching logic)
 */

/**
 * Calculates skill match percentage between candidate skills and job requirements
 * @param {string[]} userSkills
 * @param {string[]} requiredSkills
 * @returns {Object} { matchPercent, matchedSkills, missingSkills }
 */
const calculateSkillMatch = (userSkills = [], requiredSkills = []) => {
  if (!requiredSkills || requiredSkills.length === 0) {
    return {
      matchPercent: 100,
      matchedSkills: [],
      missingSkills: []
    };
  }

  // Normalize user skills to lower-case trimmed strings for comparison
  const normalizedUserSkills = new Set(
    (userSkills || []).map((s) => s.trim().toLowerCase())
  );

  const matchedSkills = [];
  const missingSkills = [];

  requiredSkills.forEach((reqSkill) => {
    const normalizedReq = reqSkill.trim().toLowerCase();

    // Check exact match or substring match (e.g., 'react' matches 'react.js')
    let isMatch = false;
    for (const uSkill of normalizedUserSkills) {
      if (
        uSkill === normalizedReq ||
        (uSkill.length > 2 && normalizedReq.includes(uSkill)) ||
        (normalizedReq.length > 2 && uSkill.includes(normalizedReq))
      ) {
        isMatch = true;
        break;
      }
    }

    if (isMatch) {
      matchedSkills.push(reqSkill);
    } else {
      missingSkills.push(reqSkill);
    }
  });

  const matchPercent = Math.round((matchedSkills.length / requiredSkills.length) * 100);

  return {
    matchPercent,
    matchedSkills,
    missingSkills
  };
};

module.exports = {
  calculateSkillMatch
};
