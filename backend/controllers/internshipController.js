/**
 * Internship Controller (CRUD + URL Building Demonstration)
 * Syllabus: Exp 1, 3, 11 (CRUD operations, Pagination, Filtering, and URL Building)
 */
const Internship = require('../models/Internship');
const { createAlertsForInternship } = require('../utils/alertJob');

/**
 * Get all internships with search, filtering, sorting, pagination, and HATEOAS/URL building
 * GET /api/internships
 */
const getInternships = async (req, res, next) => {
  try {
    const {
      search,
      skill,
      mode,
      minStipend,
      verified,
      page = 1,
      limit = 10,
      sort = 'newest'
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, Math.min(50, parseInt(limit, 10)));
    const query = {};

    // 1. Text search on title and description (MongoDB text index - Exp 10)
    if (search && search.trim()) {
      query.$text = { $search: search.trim() };
    }

    // 2. Filter by required skill
    if (skill && skill.trim()) {
      query.requiredSkills = { $regex: new RegExp(skill.trim(), 'i') };
    }

    // 3. Filter by mode (remote, onsite, hybrid)
    if (mode && ['remote', 'onsite', 'hybrid'].includes(mode)) {
      query.mode = mode;
    }

    // 4. Filter by minimum stipend
    if (minStipend && !isNaN(minStipend)) {
      query.stipend = { $gte: Number(minStipend) };
    }

    // 5. Filter by verified status
    if (verified !== undefined) {
      query.verified = verified === 'true';
    }

    // Sorting strategy
    let sortOptions = { createdAt: -1 };
    if (sort === 'oldest') sortOptions = { createdAt: 1 };
    if (sort === 'stipend_desc') sortOptions = { stipend: -1 };
    if (sort === 'stipend_asc') sortOptions = { stipend: 1 };
    if (sort === 'trustScore') sortOptions = { trustScore: -1 };

    // Execute paginated query
    const totalCount = await Internship.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limitNum);

    const internships = await Internship.find(query)
      .sort(sortOptions)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    // Demonstration of URL Building using req.protocol, req.get('host'), and URLSearchParams (Exp 3)
    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
    const buildPageUrl = (targetPage) => {
      const params = new URLSearchParams(req.query);
      params.set('page', targetPage.toString());
      params.set('limit', limitNum.toString());
      return `${baseUrl}?${params.toString()}`;
    };

    const links = {
      self: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
      first: buildPageUrl(1),
      last: buildPageUrl(Math.max(1, totalPages)),
      prev: pageNum > 1 ? buildPageUrl(pageNum - 1) : null,
      next: pageNum < totalPages ? buildPageUrl(pageNum + 1) : null
    };

    res.status(200).json({
      success: true,
      data: internships,
      pagination: {
        total: totalCount,
        page: pageNum,
        limit: limitNum,
        totalPages
      },
      links
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single internship by ID (Demonstrating Route Parameters)
 * GET /api/internships/:id
 */
const getInternshipById = async (req, res, next) => {
  try {
    const internship = await Internship.findById(req.params.id);
    if (!internship) {
      return res.status(404).json({
        success: false,
        message: 'Internship listing not found.'
      });
    }

    res.status(200).json({
      success: true,
      data: internship
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new internship (Admin only)
 * POST /api/internships
 */
const createInternship = async (req, res, next) => {
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

    const skillsArray = Array.isArray(requiredSkills)
      ? requiredSkills
      : (typeof requiredSkills === 'string' ? requiredSkills.split(',').map((s) => s.trim()).filter(Boolean) : []);

    const internship = await Internship.create({
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
      verified: verified === true || verified === 'true',
      trustScore: trustScore !== undefined ? Number(trustScore) : 100
    });

    // If verified on creation, trigger the automated alert workflow immediately (Exp 11 requirement)
    if (internship.verified) {
      createAlertsForInternship(internship).catch((err) =>
        console.error('[InternshipController] Async alert dispatch failed:', err.message)
      );
    }

    res.status(201).json({
      success: true,
      message: 'Internship posted successfully.',
      data: internship
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update internship by ID (Admin only)
 * PUT /api/internships/:id
 */
const updateInternship = async (req, res, next) => {
  try {
    const prevInternship = await Internship.findById(req.params.id);
    if (!prevInternship) {
      return res.status(404).json({
        success: false,
        message: 'Internship listing not found.'
      });
    }

    const updates = { ...req.body };
    if (updates.requiredSkills && typeof updates.requiredSkills === 'string') {
      updates.requiredSkills = updates.requiredSkills.split(',').map(s => s.trim()).filter(Boolean);
    }

    const updated = await Internship.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    });

    // If newly verified, trigger alerts
    if (!prevInternship.verified && updated.verified) {
      createAlertsForInternship(updated).catch(err => console.error(err));
    }

    res.status(200).json({
      success: true,
      message: 'Internship updated successfully.',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete internship by ID (Admin only)
 * DELETE /api/internships/:id
 */
const deleteInternship = async (req, res, next) => {
  try {
    const deleted = await Internship.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Internship listing not found.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Internship deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getInternships,
  getInternshipById,
  createInternship,
  updateInternship,
  deleteInternship
};
