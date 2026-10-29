/**
 * MongoDB Lab Experiments: Exp 9 (CRUD Operations in MongoDB Shell / mongosh)
 * Target Collection: internships
 * Run directly in mongosh:
 *   mongosh internshield < crud.js
 * Or load inside mongosh session:
 *   load("backend/mongo-queries/crud.js")
 */

print("=== STARTING EXP 9: MONGODB BASIC CRUD OPERATIONS ===");

// Switch to database
db = db.getSiblingDB("internshield");

// ----------------------------------------------------------------------
// 1. CREATE: insertOne & insertMany
// ----------------------------------------------------------------------
print("\n--- 1. Demonstrating insertOne ---");
const singleInsert = db.internships.insertOne({
  title: "Cloud Infrastructure Intern",
  company: "Apex Tech Cloud",
  description: "Assist with AWS CloudFormation templates and Linux virtual machines.",
  requiredSkills: ["AWS", "Linux", "Docker"],
  location: "Hyderabad, India",
  stipend: 28000,
  mode: "hybrid",
  applyLink: "https://example.com/apply",
  recruiterEmail: "careers@apextechcloud.io",
  recruiterPhone: "04011223344",
  verified: true,
  trustScore: 94,
  postedAt: new Date()
});
printjson(singleInsert);

print("\n--- 2. Demonstrating insertMany ---");
const batchInsert = db.internships.insertMany([
  {
    title: "QA Automation Intern",
    company: "TestForge Labs",
    description: "Write automated Cypress test scripts for e-commerce platforms.",
    requiredSkills: ["JavaScript", "Cypress", "Unit Testing"],
    location: "Bengaluru, India",
    stipend: 22000,
    mode: "remote",
    applyLink: "https://example.com/testforge",
    recruiterEmail: "jobs@testforge.io",
    recruiterPhone: "08088997766",
    verified: true,
    trustScore: 92,
    postedAt: new Date()
  },
  {
    title: "Temporary Data Entry Helper",
    company: "QuickEarn Network",
    description: "Work from mobile. Pay Rs 500 security deposit.",
    requiredSkills: ["Data Entry"],
    location: "Remote",
    stipend: 40000,
    mode: "remote",
    applyLink: "https://bit.ly/quickearntemp",
    recruiterEmail: "earnfast@gmail.com",
    recruiterPhone: "9988112233",
    verified: false,
    trustScore: 20,
    postedAt: new Date()
  }
]);
printjson(batchInsert);

// ----------------------------------------------------------------------
// 2. READ: find with filters and projections
// ----------------------------------------------------------------------
print("\n--- 3. Demonstrating find with query filters (verified = true, stipend >= 30000) ---");
const filteredResults = db.internships.find(
  { verified: true, stipend: { $gte: 30000 } },
  { title: 1, company: 1, stipend: 1, mode: 1, _id: 0 } // Projection: include title, company, stipend, mode; suppress _id
).limit(3).toArray();
printjson(filteredResults);

print("\n--- 4. Demonstrating find with array element match ($in operator) ---");
const skillSearch = db.internships.find(
  { requiredSkills: { $in: ["React", "Python"] } },
  { title: 1, requiredSkills: 1, company: 1 }
).limit(2).toArray();
printjson(skillSearch);

// ----------------------------------------------------------------------
// 3. UPDATE: updateOne & updateMany using $set, $push, $inc
// ----------------------------------------------------------------------
print("\n--- 5. Demonstrating updateOne ($set & $inc) ---");
const updateOneResult = db.internships.updateOne(
  { company: "Apex Tech Cloud" },
  {
    $set: { location: "Cyberabad, Hyderabad" },
    $inc: { stipend: 2000 } // Increment stipend by 2000
  }
);
printjson(updateOneResult);

print("\n--- 6. Demonstrating updateOne with $push (adding an element to array) ---");
const pushResult = db.internships.updateOne(
  { company: "Apex Tech Cloud" },
  {
    $push: { requiredSkills: "Terraform" } // Push Terraform to skills array
  }
);
printjson(pushResult);

print("\n--- 7. Demonstrating updateMany ($set flag) ---");
const updateManyResult = db.internships.updateMany(
  { trustScore: { $lt: 30 } },
  {
    $set: { flaggedWarning: true, reviewedAt: new Date() }
  }
);
printjson(updateManyResult);

// ----------------------------------------------------------------------
// 4. DELETE: deleteOne, deleteMany (and legacy remove equivalent)
// ----------------------------------------------------------------------
print("\n--- 8. Demonstrating deleteOne ---");
const deleteOneResult = db.internships.deleteOne({ company: "QuickEarn Network" });
printjson(deleteOneResult);

print("\n--- 9. Demonstrating deleteMany ---");
// Note: In legacy MongoDB shell, db.internships.remove({ ... }) was used.
// Modern mongosh uses deleteOne / deleteMany for precision and atomic guarantees.
const deleteManyResult = db.internships.deleteMany({ company: "Apex Tech Cloud" });
printjson(deleteManyResult);

print("=== EXP 9 CRUD DEMONSTRATION COMPLETE ===");
