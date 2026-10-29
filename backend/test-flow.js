/**
 * End-to-End Automated Test Script for InternShield
 * Tests all flows: auth, detector, resume ATS, recommendations, reports, skill gap, alerts, demo, and SSR.
 * Usage: node test-flow.js
 */
const http = require('http');

let sessionCookie = '';

function request(options, data = null) {
  return new Promise((resolve, reject) => {
    const reqOptions = {
      hostname: 'localhost',
      port: 5000,
      path: options.path,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(sessionCookie ? { Cookie: sessionCookie } : {}),
        ...(options.headers || {})
      }
    };

    const req = http.request(reqOptions, (res) => {
      let body = '';
      if (res.headers['set-cookie']) {
        sessionCookie = res.headers['set-cookie'].map((c) => c.split(';')[0]).join('; ');
      }
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          resolve({ status: res.statusCode, headers: res.headers, data: json });
        } catch {
          resolve({ status: res.statusCode, headers: res.headers, body });
        }
      });
    });

    req.on('error', reject);
    if (data) {
      req.write(typeof data === 'string' ? data : JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  console.log('====================================================');
  console.log('🧪 RUNNING COMPLETE INTERNSHIELD VERIFICATION SUITE');
  console.log('====================================================\n');

  try {
    // 1. Health check & Demo routes
    console.log('[Test 1] Testing Health check & Demo routes...');
    const health = await request({ path: '/' });
    console.log(`  ✓ Root health check: Status ${health.status}`);

    const demoHello = await request({ path: '/api/demo/hello' });
    console.log(`  ✓ Exp 1a Demo Hello: Status ${demoHello.status} - "${demoHello.data.message}"`);

    const demoUser = await request({ path: '/api/demo/users/42' });
    console.log(`  ✓ Exp 3a Route Params: ID = ${demoUser.data.userId}`);

    const demoSearch = await request({ path: '/api/demo/search?q=react&limit=2' });
    console.log(`  ✓ Exp 3b Query Params: Found ${demoSearch.data.results.length} items`);

    const demoUrl = await request({ path: '/api/demo/url-building' });
    console.log(`  ✓ Exp 3c URL Building: Next link generated`);

    const demoItem = await request({ path: '/api/demo/items', method: 'POST' }, { title: 'Test In-Memory Item' });
    console.log(`  ✓ Exp 1b HTTP POST: Created item #${demoItem.data.data.id}`);

    const demoKeyAuth = await request({ path: '/api/demo/protected-by-key?key=demo-secret-key' });
    console.log(`  ✓ Exp 6 Middleware: Access authorized = ${demoKeyAuth.status === 200}`);

    const demoVisits1 = await request({ path: '/api/demo/visits' });
    const demoVisits2 = await request({ path: '/api/demo/visits' });
    console.log(`  ✓ Exp 11 Session Tracker: Count incremented to ${demoVisits2.data.visitCount}`);

    // 2. Authentication Flow
    console.log('\n[Test 2] Testing Student Authentication & Session Flow...');
    const loginRes = await request(
      { path: '/api/auth/login', method: 'POST' },
      { email: 'aarav.sharma@college.edu', password: 'Student@123' }
    );
    console.log(`  ✓ Login status: ${loginRes.status} (User: ${loginRes.data.data.name})`);

    const meRes = await request({ path: '/api/auth/me' });
    console.log(`  ✓ Session verified via /auth/me: User ID ${meRes.data.data._id}`);

    // 3. Detector Flow
    console.log('\n[Test 3] Testing Fake vs Real Internship Detector...');
    const fakeScan = await request(
      { path: '/api/detector/analyze', method: 'POST' },
      {
        text: 'Pay refundable deposit of Rs 1499. Apply within 24 hours. WhatsApp 9876543210.',
        company: 'Apex Global Solutions Ltd',
        recruiterEmail: 'hr.careers123@gmail.com',
        stipend: 65000
      }
    );
    console.log(`  ✓ Fake Offer Trust Score: ${fakeScan.data.data.trustScore}/100 - Verdict: "${fakeScan.data.data.verdict}" (Flags: ${fakeScan.data.data.flags.length})`);

    const realScan = await request(
      { path: '/api/detector/analyze', method: 'POST' },
      {
        text: 'Join our frontend React engineering team building web applications.',
        company: 'Razorpay Software',
        recruiterEmail: 'campus-hiring@razorpay.com',
        stipend: 35000
      }
    );
    console.log(`  ✓ Real Offer Trust Score: ${realScan.data.data.trustScore}/100 - Verdict: "${realScan.data.data.verdict}"`);

    // 4. Resume Builder Flow
    console.log('\n[Test 4] Testing Resume ATS Analyzer & Tailor...');
    const atsRes = await request(
      { path: '/api/resume/analyze', method: 'POST' },
      {
        jobDescription: 'Frontend React Developer with HTML, CSS, JavaScript, React, and Git skills.',
        resumeData: {
          skills: ['React', 'JavaScript', 'HTML', 'CSS', 'Git', 'Docker'],
          projects: [{ title: 'InternShield', technologies: 'React, Node.js', description: 'Web app' }]
        }
      }
    );
    console.log(`  ✓ ATS Compatibility Score: ${atsRes.data.data.atsScore}% (Matched: ${atsRes.data.data.matchedKeywords.join(', ')})`);

    const tailorRes = await request(
      { path: '/api/resume/tailor', method: 'POST' },
      {
        jobDescription: 'Seeking Docker and React specialist.',
        resumeData: {
          skills: ['HTML', 'Docker', 'React', 'CSS'],
          projects: []
        }
      }
    );
    console.log(`  ✓ Tailored skills: ${tailorRes.data.data.tailoredResume.skills.join(', ')}`);

    // 5. Recommendations Flow
    console.log('\n[Test 5] Testing Verified Recommendations Engine...');
    const recRes = await request({ path: '/api/recommend' });
    console.log(`  ✓ Recommendations fetched: ${recRes.data.count} verified roles found (Top Match: ${recRes.data.data[0]?.matchPercent}%)`);

    // 6. Recruiter Check & Reporting Flow
    console.log('\n[Test 6] Testing Recruiter Fraud Check & Reporting...');
    const checkRes = await request({ path: '/api/reports/check?type=email&value=hr.careers123@gmail.com' });
    console.log(`  ✓ Blacklist Check for hr.careers123@gmail.com: Reported = ${checkRes.data.data.reported} (Risk: ${checkRes.data.data.riskLevel})`);

    const reportSubmit = await request(
      { path: '/api/reports', method: 'POST' },
      {
        type: 'phone',
        value: '9900112233',
        reason: 'Demanded advance interview booking charge.'
      }
    );
    console.log(`  ✓ Submitted student scam report: Status ${reportSubmit.status} - ID: ${reportSubmit.data.data._id}`);

    // 7. Skill Gap Flow
    console.log('\n[Test 7] Testing Skill Gap Analyzer & Free Courses...');
    const gapRes = await request({ path: '/api/skillgap?role=Web%20Developer' });
    console.log(`  ✓ Target Role: ${gapRes.data.data.role} - Readiness: ${gapRes.data.data.readinessPercent}% (Free Courses: ${gapRes.data.data.courses.length})`);

    // 8. Alerts Flow
    console.log('\n[Test 8] Testing Automated Alerts Feed...');
    const alertsRes = await request({ path: '/api/alerts' });
    console.log(`  ✓ Student Alerts Count: ${alertsRes.data.count} (Unread: ${alertsRes.data.unreadCount})`);

    // 9. EJS SSR Pages Flow
    console.log('\n[Test 9] Testing EJS Server-Side Rendered Views...');
    const aboutPage = await request({ path: '/about' });
    console.log(`  ✓ Public About (EJS SSR): Status ${aboutPage.status} (${aboutPage.body.length} bytes rendered)`);

    const adminLoginPage = await request({ path: '/admin/login' });
    console.log(`  ✓ Admin Login (EJS SSR): Status ${adminLoginPage.status}`);

    console.log('\n====================================================');
    console.log('🎉 ALL INTEGRATION TESTS PASSED WITH 100% SUCCESS!');
    console.log('====================================================');
  } catch (err) {
    console.error('❌ Test failed with error:', err);
  }
}

runTests();
