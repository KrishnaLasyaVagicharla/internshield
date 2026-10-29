/**
 * Database Seed Script
 * Populates MongoDB with test users, 25 internships, 15 reports, and 30 free courses.
 * Run with: npm run seed
 */
require('dotenv').config({ path: __dirname + '/../.env' });
const dns = require('dns');
try { dns.setServers(['8.8.8.8', '1.1.1.1']); } catch (e) {}
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Internship = require('../models/Internship');
const Report = require('../models/Report');
const Alert = require('../models/Alert');
const Course = require('../models/Course');

const MONGO_URI = process.env.MONGO_URI;

const seedDatabase = async () => {
  if (!MONGO_URI) {
    console.error('[Seed] MONGO_URI environment variable is not set.');
    process.exit(1);
  }

  try {
    console.log('[Seed] Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('[Seed] Connected successfully. Clearing existing collections...');

    await Promise.all([
      User.deleteMany({}),
      Internship.deleteMany({}),
      Report.deleteMany({}),
      Alert.deleteMany({}),
      Course.deleteMany({})
    ]);

    // 1. Seed Users (1 Admin, 2 Students)
    console.log('[Seed] Creating demo users...');
    const adminPasswordHash = await bcrypt.hash('Admin@123', 10);
    const studentPasswordHash = await bcrypt.hash('Student@123', 10);

    const admin = await User.create({
      name: 'Dr. Aris Thorne (Admin)',
      email: 'admin@internshield.com',
      passwordHash: adminPasswordHash,
      role: 'admin',
      skills: ['Security', 'Cloud', 'Architecture', 'Python'],
      targetRole: 'DevOps Engineer'
    });

    const student1 = await User.create({
      name: 'Aarav Sharma',
      email: 'aarav.sharma@college.edu',
      passwordHash: studentPasswordHash,
      role: 'student',
      skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Git', 'Tailwind CSS'],
      education: {
        institution: 'Indian Institute of Information Technology',
        degree: 'B.Tech Computer Science',
        graduationYear: 2026
      },
      targetRole: 'Web Developer'
    });

    const student2 = await User.create({
      name: 'Priya Patel',
      email: 'priya.patel@techuniv.ac.in',
      passwordHash: studentPasswordHash,
      role: 'student',
      skills: ['Python', 'SQL', 'Data Analysis', 'Pandas', 'NumPy', 'Tableau'],
      education: {
        institution: 'National Institute of Technology',
        degree: 'B.E. Information Technology',
        graduationYear: 2025
      },
      targetRole: 'Data Analyst'
    });

    // 2. Seed 25 Internships (Mix of verified real & unverified/suspicious)
    console.log('[Seed] Creating 25 internships...');
    const internshipsData = [
      // Verified Listings
      {
        title: 'Frontend React Developer Intern',
        company: 'Razorpay Software',
        description: 'Join our merchant checkout team to build responsive, accessible web interfaces in React and TypeScript. Collaborate with senior designers and backend engineers.',
        requiredSkills: ['React', 'JavaScript', 'HTML', 'CSS', 'Git'],
        location: 'Bengaluru, Karnataka',
        stipend: 35000,
        mode: 'hybrid',
        applyLink: 'https://razorpay.com/jobs/frontend-intern',
        recruiterEmail: 'campus-hiring@razorpay.com',
        recruiterPhone: '08046669999',
        verified: true,
        trustScore: 98
      },
      {
        title: 'Full Stack MERN Intern',
        company: 'Zomato Engineering',
        description: 'Work across MongoDB, Express, React, and Node.js. Build internal tooling, micro-services APIs, and customer interaction dashboards.',
        requiredSkills: ['MongoDB', 'Express.js', 'React', 'Node.js', 'JavaScript'],
        location: 'Gurugram, Haryana',
        stipend: 45000,
        mode: 'onsite',
        applyLink: 'https://zomato.com/careers/mern-intern',
        recruiterEmail: 'earlycareers@zomato.com',
        recruiterPhone: '01244123456',
        verified: true,
        trustScore: 96
      },
      {
        title: 'Data Analyst Intern',
        company: 'Swiggy Analytics',
        description: 'Extract business insights from petabytes of order logs. Write optimized SQL queries, build executive Tableau dashboards, and model customer retention with Python.',
        requiredSkills: ['Python', 'SQL', 'Tableau', 'Data Analysis', 'Excel'],
        location: 'Bengaluru, Karnataka',
        stipend: 40000,
        mode: 'hybrid',
        applyLink: 'https://swiggy.com/careers/data-analyst-intern',
        recruiterEmail: 'analytics-talent@swiggy.in',
        recruiterPhone: '08060007000',
        verified: true,
        trustScore: 97
      },
      {
        title: 'Backend Node.js Engineer Intern',
        company: 'Postman Labs',
        description: 'Architect scalable RESTful APIs, enhance test automation frameworks, and integrate Redis cache pipelines for our developer ecosystem.',
        requiredSkills: ['Node.js', 'Express.js', 'REST API', 'Docker', 'Git'],
        location: 'Remote',
        stipend: 50000,
        mode: 'remote',
        applyLink: 'https://www.postman.com/company/careers/',
        recruiterEmail: 'university@postman.com',
        recruiterPhone: '08061112222',
        verified: true,
        trustScore: 99
      },
      {
        title: 'UI/UX Product Design Intern',
        company: 'CRED Design Studio',
        description: 'Design intuitive, gamified user journeys. Build high-fidelity interactive prototypes in Figma, conduct usability tests, and translate research into pixel-perfect layouts.',
        requiredSkills: ['Figma', 'UI/UX', 'Wireframing', 'Prototyping', 'User Research'],
        location: 'Bengaluru, Karnataka',
        stipend: 40000,
        mode: 'onsite',
        applyLink: 'https://cred.club/careers',
        recruiterEmail: 'design-jobs@cred.club',
        recruiterPhone: '08044556677',
        verified: true,
        trustScore: 95
      },
      {
        title: 'Machine Learning Research Intern',
        company: 'Wadhwani AI',
        description: 'Deploy computer vision and NLP models for healthcare and agriculture impact. Clean datasets using Pandas, fine-tune models in PyTorch.',
        requiredSkills: ['Python', 'Machine Learning', 'PyTorch', 'Pandas', 'NumPy'],
        location: 'Mumbai, Maharashtra',
        stipend: 35000,
        mode: 'hybrid',
        applyLink: 'https://wadhwaniai.org/careers',
        recruiterEmail: 'research-interns@wadhwaniai.org',
        recruiterPhone: '02224567890',
        verified: true,
        trustScore: 96
      },
      {
        title: 'Android Application Developer Intern',
        company: 'PhonePe Payments',
        description: 'Build fast, responsive Android screens in Kotlin. Integrate secure payment SDKs, handle SQLite offline caching, and follow MVVM architectural patterns.',
        requiredSkills: ['Kotlin', 'Android', 'Java', 'REST API', 'Git'],
        location: 'Bengaluru, Karnataka',
        stipend: 45000,
        mode: 'onsite',
        applyLink: 'https://phonepe.com/careers',
        recruiterEmail: 'campus@phonepe.com',
        recruiterPhone: '08068727272',
        verified: true,
        trustScore: 97
      },
      {
        title: 'DevOps & Cloud Infrastructure Intern',
        company: 'Groww Financial Services',
        description: 'Automate deployment pipelines using GitHub Actions and Docker. Configure Kubernetes pods, monitor metrics on Prometheus/Grafana, and administer AWS VPCs.',
        requiredSkills: ['Docker', 'Kubernetes', 'Linux', 'AWS', 'CI/CD'],
        location: 'Bengaluru, Karnataka',
        stipend: 38000,
        mode: 'hybrid',
        applyLink: 'https://groww.in/careers',
        recruiterEmail: 'devops-jobs@groww.in',
        recruiterPhone: '08069008000',
        verified: true,
        trustScore: 98
      },
      {
        title: 'Cyber Security Analyst Trainee',
        company: 'Quick Heal Technologies',
        description: 'Monitor enterprise threat feeds, investigate phishing patterns, execute automated penetration test scripts, and audit OWASP compliance.',
        requiredSkills: ['Cyber Security', 'Network Security', 'Linux', 'OWASP', 'Python'],
        location: 'Pune, Maharashtra',
        stipend: 28000,
        mode: 'onsite',
        applyLink: 'https://quickheal.co.in/careers',
        recruiterEmail: 'infosec-hiring@quickheal.com',
        recruiterPhone: '02066813232',
        verified: true,
        trustScore: 94
      },
      {
        title: 'Junior Web Developer (React + CSS)',
        company: 'Freshworks Inc',
        description: 'Build responsive components for our customer support portal. Work with modern CSS Grid, Flexbox, React hooks, and unit testing using Jest.',
        requiredSkills: ['React', 'CSS', 'JavaScript', 'HTML', 'Responsive Design'],
        location: 'Chennai, Tamil Nadu',
        stipend: 32000,
        mode: 'hybrid',
        applyLink: 'https://freshworks.com/company/careers',
        recruiterEmail: 'talent@freshworks.com',
        recruiterPhone: '04466554433',
        verified: true,
        trustScore: 96
      },
      {
        title: 'Junior Data Engineer Intern',
        company: 'InMobi AdTech',
        description: 'Build ETL data pipelines using Python, SQL, and Apache Spark. Ensure data hygiene across real-time streaming pipelines.',
        requiredSkills: ['Python', 'SQL', 'Data Analysis', 'Git', 'Linux'],
        location: 'Bengaluru, Karnataka',
        stipend: 42000,
        mode: 'hybrid',
        applyLink: 'https://inmobi.com/company/careers',
        recruiterEmail: 'jobs@inmobi.com',
        recruiterPhone: '08044705000',
        verified: true,
        trustScore: 97
      },
      {
        title: 'Cloud DevOps Intern',
        company: 'Infosys Springboard',
        description: 'Learn enterprise cloud deployment strategies. Assist in writing Terraform manifests and automating release pipelines.',
        requiredSkills: ['AWS', 'Linux', 'Git', 'Docker', 'Bash'],
        location: 'Mysuru, Karnataka',
        stipend: 25000,
        mode: 'onsite',
        applyLink: 'https://infyspringboard.onwingspan.com',
        recruiterEmail: 'careers@infosys.com',
        recruiterPhone: '08212404040',
        verified: true,
        trustScore: 95
      },
      {
        title: 'Full Stack JavaScript Intern',
        company: 'Hasura Technologies',
        description: 'Contribute to GraphQL engine tooling. Build demo apps with React, Express, PostgreSQL, and Docker.',
        requiredSkills: ['React', 'Node.js', 'Express.js', 'PostgreSQL', 'GraphQL'],
        location: 'Remote',
        stipend: 45000,
        mode: 'remote',
        applyLink: 'https://hasura.io/careers',
        recruiterEmail: 'careers@hasura.io',
        recruiterPhone: '08041238990',
        verified: true,
        trustScore: 98
      },
      {
        title: 'Frontend Vue.js Intern',
        company: 'Zoho Corporation',
        description: 'Design and implement customer accounting dashboards using HTML5, modern CSS, and component-based frontend architecture.',
        requiredSkills: ['JavaScript', 'HTML', 'CSS', 'Git'],
        location: 'Tenkasi, Tamil Nadu',
        stipend: 30000,
        mode: 'onsite',
        applyLink: 'https://zoho.com/careers',
        recruiterEmail: 'recruit@zohocorp.com',
        recruiterPhone: '04467447000',
        verified: true,
        trustScore: 97
      },
      {
        title: 'Backend Python/Django Intern',
        company: 'Urban Company',
        description: 'Write efficient backend microservices in Python and Django. Optimize database queries in PostgreSQL and write unit tests.',
        requiredSkills: ['Python', 'Django', 'SQL', 'PostgreSQL', 'Git'],
        location: 'Gurugram, Haryana',
        stipend: 35000,
        mode: 'hybrid',
        applyLink: 'https://urbancompany.com/careers',
        recruiterEmail: 'careers@urbancompany.com',
        recruiterPhone: '01244005000',
        verified: true,
        trustScore: 95
      },

      // Unverified / Suspicious / Flagged Listings (For detector & testing)
      {
        title: 'Online Part-time Web Intern (No Experience Required)',
        company: 'Apex Global Solutions Ltd',
        description: 'Work from home 2 hours daily! Earn up to Rs 65,000 per month without any prior coding experience or degree. Pay refundable security deposit of Rs 1,499 for system configuration setup. Apply within 24 hours, limited seats remaining. Contact WhatsApp only at 9876543210 immediately.',
        requiredSkills: ['HTML', 'Data Entry'],
        location: 'Remote',
        stipend: 65000,
        mode: 'remote',
        applyLink: 'https://bit.ly/apex-instant-intern',
        recruiterEmail: 'hr.careers123@gmail.com',
        recruiterPhone: '9876543210',
        verified: false,
        trustScore: 12
      },
      {
        title: 'Data Entry & Python Fresher Job Offer',
        company: 'FastTrack Career Hub',
        description: 'Guaranteed placement! Freshers can earn Rs 55,000 stipend. Training fee of Rs 2,500 applicable before orientation certificate issuance. Hurry, last chance to register. DM on WhatsApp.',
        requiredSkills: ['Python', 'Excel'],
        location: 'Remote',
        stipend: 55000,
        mode: 'remote',
        applyLink: 'http://careers-fasttrack.click/register',
        recruiterEmail: 'fasttrackhr@yahoo.com',
        recruiterPhone: '9123456780',
        verified: false,
        trustScore: 18
      },
      {
        title: 'Android App Tester',
        company: 'MobileCraft Studio',
        description: 'Test pre-release Android APKs on your device. Candidates must pay Rs 500 registration fee for beta access pass.',
        requiredSkills: ['Android'],
        location: 'Noida',
        stipend: 15000,
        mode: 'remote',
        applyLink: 'https://tinyurl.com/app-testing-hub',
        recruiterEmail: 'testingteam@hotmail.com',
        recruiterPhone: '9988776655',
        verified: false,
        trustScore: 24
      },
      {
        title: 'Junior React Frontend Trainee',
        company: 'BrightEdge Tech Private Ltd',
        description: 'Looking for enthusiastic React freshers to support web development projects. Candidates will learn state management and API integration.',
        requiredSkills: ['React', 'JavaScript', 'CSS'],
        location: 'Hyderabad, Telangana',
        stipend: 18000,
        mode: 'hybrid',
        applyLink: 'https://brightedgetech.in/careers',
        recruiterEmail: 'hr@brightedgetech.in',
        recruiterPhone: '04033221100',
        verified: false, // Legitimate looking but not yet verified
        trustScore: 78
      },
      {
        title: 'Junior Software Quality Analyst',
        company: 'Zenith Labs',
        description: 'Perform manual exploratory and regression testing on web products. Create test cases in spreadsheets and file bug tickets.',
        requiredSkills: ['Unit Testing', 'Communication', 'Problem Solving'],
        location: 'Pune, Maharashtra',
        stipend: 16000,
        mode: 'onsite',
        applyLink: 'https://zenithlabs.io/jobs',
        recruiterEmail: 'careers@zenithlabs.io',
        recruiterPhone: '02044332211',
        verified: false,
        trustScore: 82
      },
      {
        title: 'Urgent Hiring: Telegram Support Specialist',
        company: 'Global Forex Trading',
        description: 'Earn 3000 daily. Just forward messages on telegram t.me/earnfast. Limited seats left. Pay Rs 800 enrollment fee.',
        requiredSkills: ['Communication'],
        location: 'Remote',
        stipend: 45000,
        mode: 'remote',
        applyLink: 'https://t.me/earnfastscam',
        recruiterEmail: 'forexpromo@rediffmail.com',
        recruiterPhone: '8877665544',
        verified: false,
        trustScore: 10
      },
      {
        title: 'Digital Marketing & Content Intern',
        company: 'InnoVibe Media',
        description: 'Create engaging infographics and social copies. Basic familiarity with Figma and Canva preferred.',
        requiredSkills: ['Figma', 'Communication', 'UI/UX'],
        location: 'Delhi NCR',
        stipend: 12000,
        mode: 'remote',
        applyLink: 'https://innovibemedia.com/join',
        recruiterEmail: 'team@innovibemedia.com',
        recruiterPhone: '01123456789',
        verified: true,
        trustScore: 88
      },
      {
        title: 'Node.js Backend Developer Trainee',
        company: 'Codex Solutions',
        description: 'Develop REST endpoints with Node and Express. Write database schemas with Mongoose and integrate third party payment APIs.',
        requiredSkills: ['Node.js', 'Express.js', 'MongoDB', 'REST API'],
        location: 'Kolkata, West Bengal',
        stipend: 20000,
        mode: 'hybrid',
        applyLink: 'https://codexsolutions.co.in/careers',
        recruiterEmail: 'jobs@codexsolutions.co.in',
        recruiterPhone: '03322114455',
        verified: true,
        trustScore: 90
      },
      {
        title: 'Python AI Research Intern',
        company: 'NeuralSync Labs',
        description: 'Pre-process datasets, conduct sentiment analysis, and train simple regression models in Scikit-Learn.',
        requiredSkills: ['Python', 'Machine Learning', 'Data Analysis', 'Git'],
        location: 'Bengaluru, Karnataka',
        stipend: 30000,
        mode: 'remote',
        applyLink: 'https://neuralsync.ai/careers',
        recruiterEmail: 'ai-interns@neuralsync.ai',
        recruiterPhone: '08022334455',
        verified: true,
        trustScore: 92
      },
      {
        title: 'Campus Ambassador Intern',
        company: 'SkillUp Network',
        description: 'Promote coding hackathons across campus. Must deposit Rs 1,000 security kit fee which is refundable after 3 months.',
        requiredSkills: ['Communication', 'Leadership'],
        location: 'Remote',
        stipend: 10000,
        mode: 'remote',
        applyLink: 'http://skillup.xyz/ambassador',
        recruiterEmail: 'ambassador.skillup@gmail.com',
        recruiterPhone: '9765432100',
        verified: false,
        trustScore: 28
      }
    ];

    const insertedInternships = await Internship.insertMany(internshipsData);

    // 3. Seed 15 Fraud Reports (Emails, phones, company names; approved, pending, rejected)
    console.log('[Seed] Creating 15 fraud reports...');
    const reportsData = [
      {
        type: 'email',
        value: 'hr.careers123@gmail.com',
        reason: 'Demanded ₹1,499 refundable deposit for laptop dispatch. Stopped answering calls afterwards.',
        reportedBy: student1._id,
        status: 'approved'
      },
      {
        type: 'phone',
        value: '9876543210',
        reason: 'Recruiter called on WhatsApp demanding Google Pay transfer of ₹2,500 for training material.',
        reportedBy: student2._id,
        status: 'approved'
      },
      {
        type: 'company',
        value: 'apex global solutions ltd',
        reason: 'Fake company name using fake address. Does not exist on MCA directory.',
        reportedBy: student1._id,
        status: 'approved'
      },
      {
        type: 'email',
        value: 'fasttrackhr@yahoo.com',
        reason: 'Sent fake job offer letter asking for ₹2,500 verification fee.',
        reportedBy: student2._id,
        status: 'approved'
      },
      {
        type: 'phone',
        value: '9123456780',
        reason: 'Threatened student saying placement score will be blocked if registration fee is not paid.',
        reportedBy: student1._id,
        status: 'approved'
      },
      {
        type: 'email',
        value: 'testingteam@hotmail.com',
        reason: 'Asks students to test betting apps and deposit real money.',
        reportedBy: student2._id,
        status: 'approved'
      },
      {
        type: 'company',
        value: 'fasttrack career hub',
        reason: 'Unregistered entity charging students for internship certificates without mentorship.',
        reportedBy: student1._id,
        status: 'approved'
      },
      {
        type: 'email',
        value: 'forexpromo@rediffmail.com',
        reason: 'Promoted illicit crypto scheme pretending to be fintech internship.',
        reportedBy: student2._id,
        status: 'approved'
      },
      {
        type: 'phone',
        value: '8877665544',
        reason: 'Anonymous Telegram recruitment spam with fake offer letter.',
        reportedBy: student1._id,
        status: 'approved'
      },
      {
        type: 'email',
        value: 'ambassador.skillup@gmail.com',
        reason: 'Non-responsive after collecting kit fee from multiple college students.',
        reportedBy: student2._id,
        status: 'approved'
      },
      {
        type: 'phone',
        value: '9765432100',
        reason: 'Calls continuously for paid certificate schemes.',
        reportedBy: student1._id,
        status: 'approved'
      },
      // Pending Reports (For Admin Moderation Queue in Exp 2)
      {
        type: 'email',
        value: 'recruit.primecareers@outlook.com',
        reason: 'Offering ₹70,000 for freshers but asking ₹300 for online aptitude test link.',
        reportedBy: student1._id,
        status: 'pending'
      },
      {
        type: 'phone',
        value: '9845012345',
        reason: 'Impersonating HR from Infosys with suspicious non-corporate phone number.',
        reportedBy: student2._id,
        status: 'pending'
      },
      {
        type: 'company',
        value: 'nextgen tech solutions india',
        reason: 'Multiple students reported receiving identical offer letters without interview.',
        reportedBy: student1._id,
        status: 'pending'
      },
      // Rejected Report
      {
        type: 'email',
        value: 'jobs@startuphub.io',
        reason: 'Did not reply to my email application within 2 days.',
        reportedBy: student2._id,
        status: 'rejected'
      }
    ];

    await Report.insertMany(reportsData);

    // 4. Seed 30 Free Courses (Across 16 core industry skills with real verified URLs)
    console.log('[Seed] Creating 30 free courses across skills...');
    const coursesData = [
      // HTML & CSS
      {
        skill: 'HTML',
        title: 'Responsive Web Design Certification (300 Hours)',
        platform: 'freeCodeCamp',
        url: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/',
        free: true
      },
      {
        skill: 'HTML',
        title: 'MDN Web Docs: HTML Structuring the Web',
        platform: 'MDN Web Docs',
        url: 'https://developer.mozilla.org/en-US/docs/Learn/HTML',
        free: true
      },
      {
        skill: 'CSS',
        title: 'Learn CSS - Modern Flexbox & Grid Masterclass',
        platform: 'web.dev by Google',
        url: 'https://web.dev/learn/css/',
        free: true
      },
      {
        skill: 'CSS',
        title: 'CSS Tutorial for Beginners',
        platform: 'W3Schools',
        url: 'https://www.w3schools.com/css/',
        free: true
      },

      // JavaScript
      {
        skill: 'JavaScript',
        title: 'JavaScript Algorithms and Data Structures',
        platform: 'freeCodeCamp',
        url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/',
        free: true
      },
      {
        skill: 'JavaScript',
        title: 'The Modern JavaScript Tutorial',
        platform: 'JavaScript.info',
        url: 'https://javascript.info/',
        free: true
      },

      // React
      {
        skill: 'React',
        title: 'Official React Documentation & Interactive Tutorials',
        platform: 'React.dev',
        url: 'https://react.dev/learn',
        free: true
      },
      {
        skill: 'React',
        title: 'Scrimba - Learn React for Free (Interactive Code Screencasts)',
        platform: 'Scrimba',
        url: 'https://scrimba.com/learn/learnreact',
        free: true
      },

      // Node.js & Express
      {
        skill: 'Node.js',
        title: 'Node.js Crash Course & API Architecture',
        platform: 'YouTube (Traversy Media)',
        url: 'https://www.youtube.com/watch?v=fBNz5xF-Kx4',
        free: true
      },
      {
        skill: 'Node.js',
        title: 'Official Node.js Learning Guides',
        platform: 'Nodejs.org',
        url: 'https://nodejs.org/en/learn',
        free: true
      },
      {
        skill: 'Express.js',
        title: 'Express / Node.js Web Framework (MDN Tutorial)',
        platform: 'MDN Web Docs',
        url: 'https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs',
        free: true
      },

      // MongoDB
      {
        skill: 'MongoDB',
        title: 'MongoDB Node.js Developer Path',
        platform: 'MongoDB University',
        url: 'https://learn.mongodb.com/',
        free: true
      },
      {
        skill: 'MongoDB',
        title: 'Mongoose ODM in Depth for Node Developers',
        platform: 'freeCodeCamp',
        url: 'https://www.freecodecamp.org/news/introduction-to-mongoose-for-mongodb-d2a7aa593c15/',
        free: true
      },

      // Python
      {
        skill: 'Python',
        title: 'Programming for Everybody (Getting Started with Python)',
        platform: 'Coursera (Free Audit)',
        url: 'https://www.coursera.org/learn/python',
        free: true
      },
      {
        skill: 'Python',
        title: 'Python for Beginners & Data Structures',
        platform: 'Kaggle Learn',
        url: 'https://www.kaggle.com/learn/python',
        free: true
      },

      // SQL
      {
        skill: 'SQL',
        title: 'Intro to SQL: Querying and Managing Data',
        platform: 'Khan Academy',
        url: 'https://www.khanacademy.org/computing/computer-programming/sql',
        free: true
      },
      {
        skill: 'SQL',
        title: 'Advanced SQL for Data Analysis & Aggregation',
        platform: 'Kaggle Learn',
        url: 'https://www.kaggle.com/learn/advanced-sql',
        free: true
      },

      // Git
      {
        skill: 'Git',
        title: 'Version Control with Git & GitHub Course',
        platform: 'Udacity (Free)',
        url: 'https://www.udacity.com/course/version-control-with-git--ud123',
        free: true
      },
      {
        skill: 'Git',
        title: 'Pro Git Book (Free Full Online Edition)',
        platform: 'Git-scm.com',
        url: 'https://git-scm.com/book/en/v2',
        free: true
      },

      // Docker & DevOps
      {
        skill: 'Docker',
        title: 'Docker for Beginners - Hands-on Labs',
        platform: 'Docker Curriculum',
        url: 'https://docker-curriculum.com/',
        free: true
      },
      {
        skill: 'Docker',
        title: 'DevOps on AWS & Containers Foundation',
        platform: 'SWAYAM / NPTEL',
        url: 'https://swayam.gov.in/',
        free: true
      },

      // Machine Learning & Data Analysis
      {
        skill: 'Machine Learning',
        title: 'Machine Learning Specialization by Andrew Ng (Audit)',
        platform: 'Coursera (Free Audit)',
        url: 'https://www.coursera.org/specializations/machine-learning-introduction',
        free: true
      },
      {
        skill: 'Data Analysis',
        title: 'Data Analysis with Python (Pandas, NumPy, Matplotlib)',
        platform: 'freeCodeCamp',
        url: 'https://www.freecodecamp.org/learn/data-analysis-with-python/',
        free: true
      },
      {
        skill: 'Pandas',
        title: 'Pandas Data Wrangling & Manipulation Micro-course',
        platform: 'Kaggle Learn',
        url: 'https://www.kaggle.com/learn/pandas',
        free: true
      },

      // UI/UX & Figma
      {
        skill: 'Figma',
        title: 'Figma for Beginners - UI/UX Crash Course',
        platform: 'YouTube (freeCodeCamp)',
        url: 'https://www.youtube.com/watch?v=jwCmIBJ8Jtc',
        free: true
      },
      {
        skill: 'UI/UX',
        title: 'Google UX Design Professional Certificate (Free Audit Mode)',
        platform: 'Coursera (Free Audit)',
        url: 'https://www.coursera.org/professional-certificates/google-ux-design',
        free: true
      },

      // Android
      {
        skill: 'Android',
        title: 'Android Basics with Compose',
        platform: 'Google Developers',
        url: 'https://developer.android.com/courses/android-basics-compose/course',
        free: true
      },
      {
        skill: 'Kotlin',
        title: 'Kotlin Bootcamp for Programmers',
        platform: 'Google Android Developers',
        url: 'https://developer.android.com/courses/kotlin-bootcamp/overview',
        free: true
      },

      // Cyber Security & Linux
      {
        skill: 'Cyber Security',
        title: 'Introduction to Cybersecurity & Threat Modeling',
        platform: 'Coursera (Free Audit)',
        url: 'https://www.coursera.org/learn/intro-cyber-security',
        free: true
      },
      {
        skill: 'Linux',
        title: 'Introduction to Linux (LFS101x)',
        platform: 'The Linux Foundation (edX Free)',
        url: 'https://www.edx.org/learn/linux/the-linux-foundation-introduction-to-linux',
        free: true
      }
    ];

    await Course.insertMany(coursesData);

    // 5. Seed Initial Alerts for Aarav Sharma based on verified listings
    console.log('[Seed] Generating initial alerts for student users...');
    const verifiedRoles = insertedInternships.filter(i => i.verified);
    if (verifiedRoles.length > 0) {
      await Alert.create({
        user: student1._id,
        internship: verifiedRoles[0]._id,
        matchPercent: 100,
        message: `High Match (100%): "${verifiedRoles[0].title}" at ${verifiedRoles[0].company} matches your skills!`,
        isRead: false
      });
      if (verifiedRoles.length > 1) {
        await Alert.create({
          user: student1._id,
          internship: verifiedRoles[1]._id,
          matchPercent: 80,
          message: `Match (80%): "${verifiedRoles[1].title}" at ${verifiedRoles[1].company} matches 4/5 of your skills.`,
          isRead: false
        });
      }
    }

    console.log('====================================================');
    console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log(`- 1 Admin User: admin@internshield.com (Password: Admin@123)`);
    console.log(`- 2 Student Users: aarav.sharma@college.edu (Password: Student@123)`);
    console.log(`- 25 Internships (15 Verified, 10 Unverified/Suspicious)`);
    console.log(`- 15 Blacklist & Fraud Reports`);
    console.log(`- 30 Free Skill Enhancement Courses`);
    console.log('====================================================');

    process.exit(0);
  } catch (error) {
    console.error('❌ SEEDING FAILED:', error);
    process.exit(1);
  }
};

seedDatabase();
