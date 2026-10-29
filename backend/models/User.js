/**
 * User Model
 * Syllabus: Exp 11a (Mongoose Schema definition, validation, and hooks)
 */
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required']
    },
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student'
    },
    skills: {
      type: [String],
      default: []
    },
    education: {
      institution: { type: String, default: '' },
      degree: { type: String, default: '' },
      graduationYear: { type: Number, default: new Date().getFullYear() }
    },
    targetRole: {
      type: String,
      default: 'Web Developer'
    },
    recentScans: [
      {
        company: String,
        trustScore: Number,
        verdict: String,
        scannedAt: { type: Date, default: Date.now }
      }
    ]
  },
  {
    timestamps: true
  }
);

// Method to safely return user object without passwordHash
userSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  return obj;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
