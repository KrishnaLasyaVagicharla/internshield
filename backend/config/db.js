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

const LOCAL_FALLBACK_URI = 'mongodb://127.0.0.1:27017/internshield';

const connectDB = async () => {
  const primaryUri = process.env.MONGO_URI || LOCAL_FALLBACK_URI;

  try {
    const conn = await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 5000 // Quick 5-second timeout for fallback
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.warn(`[Database Warning] Primary connection (${primaryUri.split('@')[1] || primaryUri}) failed: ${error.message}`);

    // If primary was an Atlas URL that failed, fallback automatically to local daemon
    if (primaryUri !== LOCAL_FALLBACK_URI) {
      console.log(`[Database] Attempting fallback to local MongoDB instance (${LOCAL_FALLBACK_URI})...`);
      try {
        const localConn = await mongoose.connect(LOCAL_FALLBACK_URI);
        console.log(`[Database] Local Fallback Connected: ${localConn.connection.host}/${localConn.connection.name}`);
        return localConn;
      } catch (localErr) {
        console.error(`[Database Error] Local fallback also failed: ${localErr.message}`);
        throw localErr;
      }
    }

    throw error;
  }
};

module.exports = connectDB;
