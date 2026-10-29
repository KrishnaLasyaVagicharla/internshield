/**
 * Node.js Execution Wrapper for Exp 9 CRUD Operations
 * Connects to MongoDB via Mongoose/Native Driver and runs all CRUD demonstrations.
 * Usage: node backend/mongo-queries/run-crud.js
 */
const dns = require('dns');
try { dns.setServers(['8.8.8.8', '1.1.1.1']); } catch (e) {}
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/internshield';

async function runCrud() {
  console.log('=== STARTING EXP 9: MONGODB BASIC CRUD OPERATIONS ===\n');
  await mongoose.connect(MONGO_URI);
  const db = mongoose.connection.db;
  const collection = db.collection('internships');

  // 1. insertOne
  console.log('--- 1. Demonstrating insertOne ---');
  const insertOneRes = await collection.insertOne({
    title: 'Cloud Infrastructure Intern',
    company: 'Apex Tech Cloud Demo',
    description: 'Assist with AWS CloudFormation templates and Linux VMs.',
    requiredSkills: ['AWS', 'Linux', 'Docker'],
    location: 'Hyderabad, India',
    stipend: 28000,
    mode: 'hybrid',
    verified: true,
    trustScore: 94,
    postedAt: new Date()
  });
  console.log('insertOne Result ID:', insertOneRes.insertedId);

  // 2. insertMany
  console.log('\n--- 2. Demonstrating insertMany ---');
  const insertManyRes = await collection.insertMany([
    {
      title: 'QA Automation Intern',
      company: 'TestForge Labs Demo',
      description: 'Write automated Cypress test scripts for web apps.',
      requiredSkills: ['JavaScript', 'Cypress', 'Unit Testing'],
      location: 'Bengaluru, India',
      stipend: 22000,
      mode: 'remote',
      verified: true,
      trustScore: 92,
      postedAt: new Date()
    },
    {
      title: 'Temporary Data Entry Helper',
      company: 'QuickEarn Demo Scammer',
      description: 'Work from mobile. Pay Rs 500 security deposit.',
      requiredSkills: ['Data Entry'],
      location: 'Remote',
      stipend: 40000,
      mode: 'remote',
      verified: false,
      trustScore: 20,
      postedAt: new Date()
    }
  ]);
  console.log('insertMany Count:', insertManyRes.insertedCount);

  // 3. find with filter & projection
  console.log('\n--- 3. Demonstrating find with query filters & projection (stipend >= 30000) ---');
  const filtered = await collection
    .find({ verified: true, stipend: { $gte: 30000 } }, { projection: { title: 1, company: 1, stipend: 1, mode: 1, _id: 0 } })
    .limit(3)
    .toArray();
  console.log('Filtered Results:', filtered);

  // 4. find with array element match ($in)
  console.log('\n--- 4. Demonstrating find with array match ($in operator) ---');
  const skillMatch = await collection
    .find({ requiredSkills: { $in: ['React', 'Python'] } }, { projection: { title: 1, requiredSkills: 1, company: 1 } })
    .limit(2)
    .toArray();
  console.log('Skill Match Results:', skillMatch);

  // 5. updateOne with $set & $inc
  console.log('\n--- 5. Demonstrating updateOne ($set & $inc) ---');
  const updateOneRes = await collection.updateOne(
    { company: 'Apex Tech Cloud Demo' },
    { $set: { location: 'Cyberabad, Hyderabad' }, $inc: { stipend: 2000 } }
  );
  console.log('updateOne Modified Count:', updateOneRes.modifiedCount);

  // 6. updateOne with $push
  console.log('\n--- 6. Demonstrating updateOne with $push ---');
  const pushRes = await collection.updateOne(
    { company: 'Apex Tech Cloud Demo' },
    { $push: { requiredSkills: 'Terraform' } }
  );
  console.log('push Modified Count:', pushRes.modifiedCount);

  // 7. updateMany with $set
  console.log('\n--- 7. Demonstrating updateMany ($set flag) ---');
  const updateManyRes = await collection.updateMany(
    { trustScore: { $lt: 30 } },
    { $set: { flaggedWarning: true, reviewedAt: new Date() } }
  );
  console.log('updateMany Matched & Modified Count:', updateManyRes.modifiedCount);

  // 8. deleteOne
  console.log('\n--- 8. Demonstrating deleteOne ---');
  const deleteOneRes = await collection.deleteOne({ company: 'QuickEarn Demo Scammer' });
  console.log('deleteOne Deleted Count:', deleteOneRes.deletedCount);

  // 9. deleteMany
  console.log('\n--- 9. Demonstrating deleteMany ---');
  const deleteManyRes = await collection.deleteMany({ company: { $regex: /Demo/ } });
  console.log('deleteMany Deleted Count:', deleteManyRes.deletedCount);

  console.log('\n=== EXP 9 CRUD DEMONSTRATION COMPLETE ===');
  await mongoose.disconnect();
}

runCrud().catch(console.error);
