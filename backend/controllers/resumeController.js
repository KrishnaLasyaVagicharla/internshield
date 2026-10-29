/**
 * Resume Builder & ATS Tailor Controller
 * Syllabus: Exp 11 (Keyword analysis, ATS scoring algorithms, Structural data transformation)
 */
const { extractSkills } = require('../utils/skillExtractor');

/**
 * Analyze Resume against a Job Description (ATS Score + Keywords)
 * POST /api/resume/analyze
 */
const analyzeResume = (req, res, next) => {
  try {
    const { jobDescription, resumeData } = req.body;

    if (!jobDescription || !jobDescription.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Job description is required to calculate ATS match.'
      });
    }

    if (!resumeData) {
      return res.status(400).json({
        success: false,
        message: 'Resume data is required.'
      });
    }

    // 1. Extract keywords from Job Description
    const jdKeywords = extractSkills(jobDescription);

    // 2. Extract full text from resumeData
    const resumeTextParts = [
      resumeData.summary || '',
      Array.isArray(resumeData.skills) ? resumeData.skills.join(' ') : (resumeData.skills || ''),
      ...(resumeData.projects || []).map(p => `${p.title} ${p.technologies || ''} ${p.description || ''}`),
      ...(resumeData.experience || []).map(e => `${e.role} ${e.company} ${e.description || ''}`),
      ...(resumeData.education || []).map(ed => `${ed.degree} ${ed.institution || ''}`)
    ];
    const fullResumeText = resumeTextParts.join(' ').toLowerCase();

    // 3. Match JD keywords in resume
    const matchedKeywords = [];
    const missingKeywords = [];

    jdKeywords.forEach(keyword => {
      const escaped = keyword.toLowerCase().replace(/([.+*?^=!:${}()|\[\]\/\\])/g, '\\$1');
      const regex = new RegExp(`(^|\\s|[^a-zA-Z0-9])${escaped}($|\\s|[^a-zA-Z0-9])`, 'i');

      if (regex.test(` ${fullResumeText} `)) {
        matchedKeywords.push(keyword);
      } else {
        missingKeywords.push(keyword);
      }
    });

    // 4. Calculate ATS score (0-100)
    let atsScore = 0;
    if (jdKeywords.length > 0) {
      atsScore = Math.round((matchedKeywords.length / jdKeywords.length) * 100);
    } else {
      atsScore = 75; // Default baseline if JD has very few explicit tech keywords
    }

    // 5. Generate actionable suggestions
    const suggestions = [];
    if (missingKeywords.length > 0) {
      suggestions.push(`Consider adding projects or experience that demonstrate these keywords: ${missingKeywords.slice(0, 5).join(', ')}.`);
    }
    if ((resumeData.projects || []).length < 2) {
      suggestions.push('Add at least 2 detailed projects with links and clear measurable results.');
    }
    if (!resumeData.summary || resumeData.summary.length < 50) {
      suggestions.push('Include a crisp professional summary highlighting your core strengths.');
    }
    if (atsScore >= 80) {
      suggestions.push('High ATS match! Your resume is strongly aligned with this job specification.');
    }

    res.status(200).json({
      success: true,
      data: {
        atsScore,
        matchedKeywords,
        missingKeywords,
        totalJdKeywords: jdKeywords.length,
        suggestions
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Tailor Resume without inventing any experience:
 * - Reorders user skills so JD-matched skills appear first
 * - Reorders projects so projects containing matched keywords appear first
 * - Returns tailored resume structure
 * POST /api/resume/tailor
 */
const tailorResume = (req, res, next) => {
  try {
    const { jobDescription, resumeData } = req.body;

    if (!jobDescription || !resumeData) {
      return res.status(400).json({
        success: false,
        message: 'Both jobDescription and resumeData are required.'
      });
    }

    const jdKeywords = extractSkills(jobDescription).map(k => k.toLowerCase());
    const tailored = JSON.parse(JSON.stringify(resumeData)); // Deep clone
    const improvements = [];

    // 1. Reorder skills: matched skills first
    if (Array.isArray(tailored.skills) && tailored.skills.length > 0) {
      const originalSkills = [...tailored.skills];
      const matched = [];
      const others = [];

      originalSkills.forEach(s => {
        const sLower = s.toLowerCase().trim();
        const matchesJD = jdKeywords.some(k => k === sLower || sLower.includes(k) || k.includes(sLower));
        if (matchesJD) {
          matched.push(s);
        } else {
          others.push(s);
        }
      });

      tailored.skills = [...matched, ...others];
      improvements.push(`Prioritized ${matched.length} high-match skills to the front of your skills section.`);
    }

    // 2. Reorder projects by relevance to JD keywords
    if (Array.isArray(tailored.projects) && tailored.projects.length > 1) {
      tailored.projects.sort((a, b) => {
        const aText = `${a.title} ${a.technologies || ''} ${a.description || ''}`.toLowerCase();
        const bText = `${b.title} ${b.technologies || ''} ${b.description || ''}`.toLowerCase();

        const aMatches = jdKeywords.filter(k => aText.includes(k)).length;
        const bMatches = jdKeywords.filter(k => bText.includes(k)).length;

        return bMatches - aMatches; // Descending
      });
      improvements.push('Sorted projects so listings with high keyword overlap appear at the top.');
    }

    res.status(200).json({
      success: true,
      message: 'Resume tailored successfully. No experience was fabricated; existing details were optimized for ATS relevance.',
      data: {
        tailoredResume: tailored,
        improvements
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  analyzeResume,
  tailorResume
};
