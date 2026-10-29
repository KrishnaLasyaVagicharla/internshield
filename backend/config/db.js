/**
 * Database Configuration (Mongoose + MongoDB)
 * Syllabus: Exp 9, 10, 11 (MongoDB connection & Mongoose ODM setup)
 */
const dns = require('dns');
const mongoose = require('mongoose');

// Configure public DNS servers for reliable SRV resolution with MongoDB Atlas
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore in restricted environments
}

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error('[Database Error] MONGO_URI environment variable is not set. Cannot connect to database.');
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[Database Error] Connection failed: ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;
