/**
 * Alert Automation Job (Cron + Event Trigger)
 * Syllabus: Exp 11 (Scheduled Tasks using node-cron & automated notification workflows)
 */
const cron = require('node-cron');
const User = require('../models/User');
const Internship = require('../models/Internship');
const Alert = require('../models/Alert');
const { calculateSkillMatch } = require('./matcher');

/**
 * Creates alerts for all eligible users matching a verified internship with >= 50% match
 * @param {string|Object} internshipOrId
 */
const createAlertsForInternship = async (internshipOrId) => {
  try {
    let internship = internshipOrId;
    if (typeof internshipOrId === 'string') {
      internship = await Internship.findById(internshipOrId);
    }

    if (!internship || !internship.verified) {
      return { createdCount: 0 };
    }

    // Find all student users who have defined skills
    const students = await User.find({
      role: 'student',
      skills: { $exists: true, $not: { $size: 0 } }
    });

    let createdCount = 0;

    for (const student of students) {
      const { matchPercent, matchedSkills } = calculateSkillMatch(
        student.skills,
        internship.requiredSkills
      );

      // Trigger alert if student matches at least 50% of required skills
      if (matchPercent >= 50) {
        // Upsert alert or skip if already exists to prevent duplicate spam
        const existingAlert = await Alert.findOne({
          user: student._id,
          internship: internship._id
        });

        if (!existingAlert) {
          await Alert.create({
            user: student._id,
            internship: internship._id,
            matchPercent,
            message: `New verified role at ${internship.company}: "${internship.title}" matches ${matchPercent}% of your skills (${matchedSkills.slice(0, 3).join(', ')}).`,
            isRead: false
          });
          createdCount++;
        }
      }
    }

    console.log(`[AlertJob] Processed alerts for "${internship.title}" at ${internship.company}: Created ${createdCount} new notifications.`);
    return { createdCount };
  } catch (error) {
    console.error('[AlertJob Error] Failed to generate alerts for internship:', error);
    return { createdCount: 0, error: error.message };
  }
};

/**
 * Sweeps all verified internships and creates any missing alerts for students
 */
const runFullAlertSweep = async () => {
  try {
    console.log('[AlertJob] Running periodic check for verified internships...');
    // Look back at verified internships posted in the last 7 days
    const recentInternships = await Internship.find({
      verified: true
    }).limit(50);

    for (const internship of recentInternships) {
      await createAlertsForInternship(internship);
    }
  } catch (err) {
    console.error('[AlertJob Sweep Error]:', err.message);
  }
};

/**
 * Initialize node-cron schedule (Every 10 minutes)
 */
const initAlertCron = () => {
  // Cron schedule: every 10 minutes
  cron.schedule('*/10 * * * *', () => {
    console.log('[Cron] Executing 10-minute automated alert matching job...');
    runFullAlertSweep();
  });

  console.log('[Cron] Alert worker initialized (Interval: Every 10 minutes).');
};

module.exports = {
  createAlertsForInternship,
  runFullAlertSweep,
  initAlertCron
};
