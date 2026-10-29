/**
 * Internship Model
 * Syllabus: Exp 10 & 11a (Mongoose Schema, Compound & Text Indexing)
 */
const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Description is required']
    },
    requiredSkills: {
      type: [String],
      required: [true, 'At least one required skill is needed'],
      index: true
    },
    location: {
      type: String,
      default: 'Remote'
    },
    stipend: {
      type: Number,
      default: 0,
      min: [0, 'Stipend cannot be negative']
    },
    mode: {
      type: String,
      enum: ['remote', 'onsite', 'hybrid'],
      default: 'remote'
    },
    applyLink: {
      type: String,
      default: ''
    },
    recruiterEmail: {
      type: String,
      default: '',
      lowercase: true,
      trim: true
    },
    recruiterPhone: {
      type: String,
      default: '',
      trim: true
    },
    verified: {
      type: Boolean,
      default: false,
      index: true
    },
    trustScore: {
      type: Number,
      default: 100,
      min: 0,
      max: 100
    },
    postedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Compound Text index for full-text search on title & description (Exp 10)
internshipSchema.index({ title: 'text', description: 'text' });

const Internship = mongoose.model('Internship', internshipSchema);
module.exports = Internship;
