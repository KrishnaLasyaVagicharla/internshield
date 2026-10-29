/**
 * Course Model (Skill Gap Free Learning Resources)
 * Syllabus: Exp 11a (Mongoose Document Creation & Indexing)
 */
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    skill: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    platform: {
      type: String,
      required: true,
      trim: true
    },
    url: {
      type: String,
      required: true,
      trim: true
    },
    free: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;
