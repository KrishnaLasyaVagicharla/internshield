/**
 * Report Model (Recruiter & Fraudster Blacklist/Flag Reports)
 * Syllabus: Exp 11a (Mongoose Schema & Cross-Collection References)
 */
const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['email', 'phone', 'company'],
      required: [true, 'Report type is required']
    },
    value: {
      type: String,
      required: [true, 'Report value (email, phone, or company name) is required'],
      lowercase: true,
      trim: true,
      index: true
    },
    reason: {
      type: String,
      required: [true, 'Reason for reporting is required'],
      trim: true
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      index: true
    }
  },
  {
    timestamps: true
  }
);

const Report = mongoose.model('Report', reportSchema);
module.exports = Report;
