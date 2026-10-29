/**
 * Skill Gap Analyzer Controller
 * Syllabus: Exp 11 (Skill Gap logic, role-to-skill matrix, database query mapping)
 */
const Course = require('../models/Course');

// Standard Industry Role Skill Matrices (at least 8 skills each)
const ROLE_SKILLS_MAP = {
  'Web Developer': [
    'HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Express.js', 'MongoDB', 'Git'
  ],
  'Data Analyst': [
    'Python', 'SQL', 'Excel', 'Tableau', 'Power BI', 'Pandas', 'NumPy', 'Data Analysis'
  ],
  'Backend Developer': [
    'Node.js', 'Express.js', 'MongoDB', 'SQL', 'REST API', 'Docker', 'Redis', 'Git'
  ],
  'ML Engineer': [
    'Python', 'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Pandas', 'Scikit-Learn', 'Git'
  ],
  'UI/UX Designer': [
    'Figma', 'UI/UX', 'Wireframing', 'Prototyping', 'User Research', 'HTML', 'CSS', 'Responsive Design'
  ],
  'Android Developer': [
    'Kotlin', 'Java', 'Android', 'REST API', 'Git', 'Firebase', 'SQLite', 'XML'
  ],
  'Cyber Security Analyst': [
    'Network Security', 'Cyber Security', 'Linux', 'Penetration Testing', 'Ethical Hacking', 'Cryptography', 'OWASP', 'Python'
  ],
  'DevOps Engineer': [
    'Docker', 'Kubernetes', 'Linux', 'AWS', 'CI/CD', 'Git', 'Bash', 'Terraform'
  ]
};

/**
 * Analyze student skill gap against a target role and fetch free recommended courses
 * GET /api/skillgap?role=Web Developer
 */
const getSkillGap = async (req, res, next) => {
  try {
    const roleQuery = req.query.role || req.user.targetRole || 'Web Developer';
    const targetRole = ROLE_SKILLS_MAP[roleQuery] ? roleQuery : 'Web Developer';

    const requiredRoleSkills = ROLE_SKILLS_MAP[targetRole];
    const userSkills = (req.user.skills || []).map(s => s.trim().toLowerCase());

    const haveSkills = [];
    const missingSkills = [];

    requiredRoleSkills.forEach(reqSkill => {
      const normalizedReq = reqSkill.toLowerCase();
      const isPresent = userSkills.some(
        uSkill => uSkill === normalizedReq || uSkill.includes(normalizedReq) || normalizedReq.includes(uSkill)
      );

      if (isPresent) {
        haveSkills.push(reqSkill);
      } else {
        missingSkills.push(reqSkill);
      }
    });

    const readinessPercent = Math.round((haveSkills.length / requiredRoleSkills.length) * 100);

    // Fetch free courses from the Course collection for the missing skills
    let courses = [];
    if (missingSkills.length > 0) {
      // Find courses where skill matches any of the missing skills
      courses = await Course.find({
        free: true,
        skill: { $in: missingSkills.map(s => new RegExp(`^${s}$`, 'i')) }
      }).select('skill title platform url free');
    }

    res.status(200).json({
      success: true,
      data: {
        role: targetRole,
        availableRoles: Object.keys(ROLE_SKILLS_MAP),
        requiredSkills: requiredRoleSkills,
        haveSkills,
        missingSkills,
        readinessPercent,
        courses
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSkillGap,
  ROLE_SKILLS_MAP
};
