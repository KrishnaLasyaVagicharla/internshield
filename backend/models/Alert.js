/**
 * Alert Model (Automated Job Matches & Notifications)
 * Syllabus: Exp 11a (Mongoose Relations & Timestamps)
 */
const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    internship: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Internship',
      required: true
    },
    matchPercent: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    message: {
      type: String,
      required: true
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Prevent duplicate alert for same user and internship
alertSchema.index({ user: 1, internship: 1 }, { unique: true });

const Alert = mongoose.model('Alert', alertSchema);
module.exports = Alert;
