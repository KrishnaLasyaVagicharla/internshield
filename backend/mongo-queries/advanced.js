/**
 * MongoDB Lab Experiments: Exp 10 (Advanced DDL, Indexing & Aggregation Pipelines)
 * Run in mongosh:
 *   mongosh internshield < advanced.js
 */

print("=== STARTING EXP 10: ADVANCED MONGODB QUERIES & AGGREGATIONS ===");

db = db.getSiblingDB("internshield");

// ----------------------------------------------------------------------
// 1. DDL: Database & Collection Creation and Dropping
// ----------------------------------------------------------------------
print("\n--- 1. Demonstrating Collection Creation & Dropping ---");
// Create a temporary staging collection
db.createCollection("temp_staging_audit", { capped: false });
print("Created collection 'temp_staging_audit'. Collections list:");
printjson(db.getCollectionNames());

// Drop collection
db.temp_staging_audit.drop();
print("Dropped 'temp_staging_audit' collection successfully.");

// ----------------------------------------------------------------------
// 2. Query Manipulation: find().sort().limit().skip()
// ----------------------------------------------------------------------
print("\n--- 2. Demonstrating find().sort().limit() (Top 3 highest paying internships) ---");
const topPaid = db.internships.find(
  { verified: true },
  { title: 1, company: 1, stipend: 1, mode: 1, _id: 0 }
)
.sort({ stipend: -1 }) // Sort descending by stipend
.limit(3)             // Take only 3 records
.toArray();
printjson(topPaid);

// ----------------------------------------------------------------------
// 3. Index Management: createIndex (Single, Compound, and Text)
// ----------------------------------------------------------------------
print("\n--- 3. Demonstrating Index Creation ---");

// a. Single Field Index
print("Creating single-field index on 'verified'...");
db.internships.createIndex({ verified: 1 });

// b. Compound Index (mode ascending, stipend descending)
print("Creating compound index on { mode: 1, stipend: -1 }...");
db.internships.createIndex({ mode: 1, stipend: -1 });

// c. Text Index for full-text search across multiple fields
print("Creating compound text index on { title: 'text', description: 'text' }...");
db.internships.createIndex({ title: "text", description: "text" });

print("List of active indexes on internships collection:");
printjson(db.internships.getIndexes());

// ----------------------------------------------------------------------
// 4. Aggregation Pipeline 1: Average Stipend by Mode ($group)
// ----------------------------------------------------------------------
print("\n--- 4. Aggregation Pipeline: Average Stipend Grouped by Mode ---");
const avgStipendPipeline = [
  {
    $match: { verified: true, stipend: { $gt: 0 } }
  },
  {
    $group: {
      _id: "$mode",
      averageStipend: { $avg: "$stipend" },
      maxStipend: { $max: "$stipend" },
      minStipend: { $min: "$stipend" },
      totalOpenings: { $sum: 1 }
    }
  },
  {
    $sort: { averageStipend: -1 }
  }
];
printjson(db.internships.aggregate(avgStipendPipeline).toArray());

// ----------------------------------------------------------------------
// 5. Aggregation Pipeline 2: Count Internships per Required Skill ($unwind + $group + $sort)
// ----------------------------------------------------------------------
print("\n--- 5. Aggregation Pipeline: Most In-Demand Skills ($unwind + $group + $sort) ---");
const skillsDemandPipeline = [
  {
    $unwind: "$requiredSkills" // Deconstructs requiredSkills array into separate documents
  },
  {
    $group: {
      _id: "$requiredSkills",
      internshipCount: { $sum: 1 },
      avgStipendForSkill: { $avg: "$stipend" }
    }
  },
  {
    $sort: { internshipCount: -1 }
  },
  {
    $limit: 8 // Top 8 skills
  }
];
printjson(db.internships.aggregate(skillsDemandPipeline).toArray());

// ----------------------------------------------------------------------
// 6. Aggregation Pipeline 3: Top 5 Most Reported Entities ($match + $group + $sort + $limit)
// ----------------------------------------------------------------------
print("\n--- 6. Aggregation Pipeline: Top Most Reported Entities from Reports collection ---");
const fraudRiskPipeline = [
  {
    $match: { status: "approved" } // Only consider verified scam reports
  },
  {
    $group: {
      _id: { type: "$type", value: "$value" },
      totalReports: { $sum: 1 },
      reasons: { $push: "$reason" }
    }
  },
  {
    $sort: { totalReports: -1 }
  },
  {
    $limit: 5
  }
];
printjson(db.reports.aggregate(fraudRiskPipeline).toArray());

print("=== EXP 10 ADVANCED AGGREGATIONS COMPLETE ===");
