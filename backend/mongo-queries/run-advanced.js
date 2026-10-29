/**
 * Node.js Execution Wrapper for Exp 10 Advanced Aggregations & Indexing
 * Connects to MongoDB via Mongoose/Native Driver.
 * Usage: node backend/mongo-queries/run-advanced.js
 */
const dns = require('dns');
try { dns.setServers(['8.8.8.8', '1.1.1.1']); } catch (e) {}
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/internshield';

async function runAdvanced() {
  console.log('=== STARTING EXP 10: ADVANCED MONGODB QUERIES & AGGREGATIONS ===\n');
  await mongoose.connect(MONGO_URI);
  const db = mongoose.connection.db;
  const internships = db.collection('internships');
  const reports = db.collection('reports');

  // 1. DDL: Create and drop collection
  console.log('--- 1. Demonstrating DDL Collection Create & Drop ---');
  await db.createCollection('temp_staging_audit');
  console.log('Created temporary collection "temp_staging_audit".');
  await db.collection('temp_staging_audit').drop();
  console.log('Dropped temporary collection successfully.');

  // 2. Query Manipulation: sort, limit, skip
  console.log('\n--- 2. Demonstrating find().sort().limit() (Top 3 highest paying verified internships) ---');
  const topPaid = await internships
    .find({ verified: true }, { projection: { title: 1, company: 1, stipend: 1, mode: 1, _id: 0 } })
    .sort({ stipend: -1 })
    .limit(3)
    .toArray();
  console.log('Top Paid Listings:', topPaid);

  // 3. Index Creation
  console.log('\n--- 3. Demonstrating Index Management ---');
  await internships.createIndex({ verified: 1 });
  await internships.createIndex({ mode: 1, stipend: -1 });
  await internships.createIndex({ title: 'text', description: 'text' });
  const indexes = await internships.indexes();
  console.log('Active Indexes on internships:', indexes.map(i => i.name));

  // 4. Aggregation Pipeline 1: Average stipend by mode ($group)
  console.log('\n--- 4. Aggregation Pipeline: Average Stipend Grouped by Mode ---');
  const avgStipendRes = await internships
    .aggregate([
      { $match: { verified: true, stipend: { $gt: 0 } } },
      {
        $group: {
          _id: '$mode',
          averageStipend: { $avg: '$stipend' },
          maxStipend: { $max: '$stipend' },
          minStipend: { $min: '$stipend' },
          totalOpenings: { $sum: 1 }
        }
      },
      { $sort: { averageStipend: -1 } }
    ])
    .toArray();
  console.log('Average Stipend by Mode:', avgStipendRes);

  // 5. Aggregation Pipeline 2: Count internships per required skill ($unwind + $group + $sort)
  console.log('\n--- 5. Aggregation Pipeline: Most In-Demand Skills ($unwind + $group + $sort) ---');
  const skillsDemandRes = await internships
    .aggregate([
      { $unwind: '$requiredSkills' },
      {
        $group: {
          _id: '$requiredSkills',
          internshipCount: { $sum: 1 },
          avgStipendForSkill: { $avg: '$stipend' }
        }
      },
      { $sort: { internshipCount: -1 } },
      { $limit: 8 }
    ])
    .toArray();
  console.log('Top In-Demand Skills:', skillsDemandRes);

  // 6. Aggregation Pipeline 3: Top most reported entities ($match + $group + $sort + $limit)
  console.log('\n--- 6. Aggregation Pipeline: Top Most Reported Entities from Reports ---');
  const fraudRiskRes = await reports
    .aggregate([
      { $match: { status: 'approved' } },
      {
        $group: {
          _id: { type: '$type', value: '$value' },
          totalReports: { $sum: 1 },
          reasons: { $push: '$reason' }
        }
      },
      { $sort: { totalReports: -1 } },
      { $limit: 5 }
    ])
    .toArray();
  console.log('Top Reported Entities:', fraudRiskRes);

  console.log('\n=== EXP 10 ADVANCED AGGREGATIONS COMPLETE ===');
  await mongoose.disconnect();
}

runAdvanced().catch(console.error);
