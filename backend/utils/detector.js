/**
 * Rule-based Detector for Fake Internships
 * Syllabus: Exp 11 (Algorithmic rule processing & DB blacklist cross-referencing)
 */
const Report = require('../models/Report');

/**
 * Analyzes internship details and computes trust score (0-100)
 * @param {Object} input - { text, company, recruiterEmail, recruiterPhone, link, stipend }
 * @returns {Promise<Object>} { trustScore, verdict, flags, tips }
 */
const analyzeInternship = async ({ text = '', company = '', recruiterEmail = '', recruiterPhone = '', link = '', stipend = 0 }) => {
  let score = 100;
  const flags = [];
  const tips = [];
  const lowerText = (text + ' ' + company).toLowerCase();
  const lowerEmail = (recruiterEmail || '').toLowerCase();
  const lowerLink = (link || '').toLowerCase();

  // 1. Asks for money / fees (-35)
  const feeKeywords = ['registration fee', 'security deposit', 'training fee', 'processing fee', 'refundable deposit', 'pay rs', 'pay in advance', 'pay money'];
  const matchedFees = feeKeywords.filter(k => lowerText.includes(k));
  if (matchedFees.length > 0 || /\bpay\b.*\b(fee|amount|money|charge)\b/i.test(lowerText)) {
    score -= 35;
    flags.push({
      rule: 'Payment / Security Deposit Demand',
      penalty: 35,
      explanation: `Legitimate internships NEVER ask candidates to pay registration, training, or deposit fees.`
    });
    tips.push('Never transfer money or share UPI credentials for an internship offer.');
  }

  // 2. Free email domain for corporate recruiter (-15)
  const freeEmailDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'rediffmail.com', 'yandex.com', 'proton.me'];
  const emailDomain = lowerEmail.includes('@') ? lowerEmail.split('@')[1] : '';
  if (emailDomain && freeEmailDomains.includes(emailDomain)) {
    score -= 15;
    flags.push({
      rule: 'Generic Free Email Domain',
      penalty: 15,
      explanation: `Official recruiters use corporate domain emails (e.g. @company.com), not generic providers like ${emailDomain}.`
    });
    tips.push('Verify recruiter identity on LinkedIn before responding to generic emails.');
  }

  // 3. Email domain does not match company name (-10)
  if (emailDomain && !freeEmailDomains.includes(emailDomain) && company) {
    const cleanCompanyName = company.toLowerCase().replace(/[^a-z0-9]/g, '');
    const domainPart = emailDomain.split('.')[0].replace(/[^a-z0-9]/g, '');
    if (cleanCompanyName.length > 3 && !domainPart.includes(cleanCompanyName) && !cleanCompanyName.includes(domainPart)) {
      score -= 10;
      flags.push({
        rule: 'Email Domain Mismatch',
        penalty: 10,
        explanation: `Recruiter email domain "${emailDomain}" does not match company name "${company}".`
      });
    }
  }

  // 4. Urgency words (-10)
  const urgencyWords = ['apply within', 'limited seats', 'hurry', 'immediately', 'last chance', 'urgent hiring for all', 'guaranteed placement'];
  const foundUrgency = urgencyWords.filter(w => lowerText.includes(w));
  if (foundUrgency.length > 0) {
    score -= 10;
    flags.push({
      rule: 'Artificial Urgency Tactics',
      penalty: 10,
      explanation: `Uses urgency triggers (${foundUrgency.join(', ')}). Scammers frequently rush victims to bypass critical thinking.`
    });
    tips.push('Take your time to thoroughly research the company registration and reviews.');
  }

  // 5. Contact exclusively via WhatsApp / Telegram (-15)
  const hasAppContact = lowerText.includes('whatsapp only') || lowerText.includes('telegram') || lowerText.includes('dm on whatsapp') || lowerText.includes('t.me/');
  if (hasAppContact) {
    score -= 15;
    flags.push({
      rule: 'Unverified Chat Platform Contact',
      penalty: 15,
      explanation: `Recruiting solely through Telegram/WhatsApp without official portals or emails is a frequent scam pattern.`
    });
    tips.push('Reputable enterprises interview through formal video calls or in-person, not anonymous chat apps.');
  }

  // 6. Unrealistic stipend (> 50,000 for beginner / no experience) (-15)
  const numericStipend = Number(stipend) || 0;
  const mentionsNoExp = lowerText.includes('no experience') || lowerText.includes('no qualification') || lowerText.includes('fresher can earn');
  if (numericStipend > 50000 && mentionsNoExp) {
    score -= 15;
    flags.push({
      rule: 'Unrealistic Compensation Promise',
      penalty: 15,
      explanation: `Stipend of ₹${numericStipend.toLocaleString()} for candidates with "no experience" is unusually inflated.`
    });
    tips.push('Check glassdoor or AmbitionBox for typical market internship stipends in this domain.');
  }

  // 7. Very short or vague job description (-15)
  if (text.trim().length < 80) {
    score -= 15;
    flags.push({
      rule: 'Vague / Insufficient Job Details',
      penalty: 15,
      explanation: 'Description is under 80 characters and lacks specific responsibilities, prerequisites, or learning outcomes.'
    });
  }

  // 8. Shortened link or suspicious TLD (-10)
  const suspiciousTldRegex = /\.(xyz|top|click|link|work|loan|gq|cf|ml|tk|monster|surf)($|\/)/i;
  const urlShortenerRegex = /(bit\.ly|tinyurl\.com|t\.co|goo\.gl|is\.gd|buff\.ly|ow\.ly)/i;
  if (urlShortenerRegex.test(lowerLink) || suspiciousTldRegex.test(lowerLink)) {
    score -= 10;
    flags.push({
      rule: 'Suspicious or Obfuscated Application Link',
      penalty: 10,
      explanation: 'Application uses a shortened link or a high-risk suspicious top-level domain.'
    });
    tips.push('Hover over links and inspect the true target URL before clicking.');
  }

  // 9. Blacklist check from Approved Reports in MongoDB (-40)
  try {
    const queryConditions = [];
    if (lowerEmail) queryConditions.push({ type: 'email', value: lowerEmail });
    if (recruiterPhone) queryConditions.push({ type: 'phone', value: recruiterPhone.replace(/\D/g, '') });
    if (company) queryConditions.push({ type: 'company', value: company.toLowerCase().trim() });

    if (queryConditions.length > 0) {
      const existingReports = await Report.find({
        status: 'approved',
        $or: queryConditions
      });

      if (existingReports.length > 0) {
        score -= 40;
        flags.push({
          rule: 'Reported in InternShield Fraud Registry',
          penalty: 40,
          explanation: `This recruiter, phone, or company has ${existingReports.length} verified scam report(s) in our database.`
        });
        tips.push('Avoid all interaction with this entity as verified fraud reports exist.');
      }
    }
  } catch (err) {
    console.error('Error querying reports collection for blacklist check:', err);
  }

  // 10. Invalid or missing link — must be a valid http(s) URL with a real domain (-15)
  const validLinkRegex = /^https?:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const hasValidLink = link && validLinkRegex.test(link.trim());
  if (!hasValidLink) {
    score -= 15;
    flags.push({
      rule: 'Invalid or Missing Application Link',
      penalty: 15,
      explanation: 'The link is missing or not a valid HTTP/HTTPS URL with a recognizable domain.'
    });
    tips.push('Always verify that the application URL belongs to the company\'s official website.');
  }

  // 11. Invalid Indian phone number — must be 10 digits starting with 6-9 (-10)
  const cleanPhone = (recruiterPhone || '').replace(/[\s\-+]/g, '').replace(/^91/, '');
  if (cleanPhone && !/^[6-9]\d{9}$/.test(cleanPhone)) {
    score -= 10;
    flags.push({
      rule: 'Invalid Phone Number Format',
      penalty: 10,
      explanation: `Phone "${recruiterPhone}" is not a valid Indian mobile number (must be 10 digits starting with 6-9).`
    });
  }

  // 12. Gibberish text detection — low vowel ratio or too few real English words (-15)
  const combinedText = ((text || '') + ' ' + (company || '')).toLowerCase();
  const letters = combinedText.replace(/[^a-z]/g, '');
  const vowels = letters.replace(/[^aeiou]/g, '');
  const vowelRatio = letters.length > 0 ? vowels.length / letters.length : 0;
  // Count "dictionary-like" words: 3+ chars that contain at least one vowel
  const words = combinedText.split(/\s+/).filter(w => w.length >= 3);
  const realWords = words.filter(w => /[aeiou]/i.test(w));
  if (letters.length > 0 && (vowelRatio < 0.2 || realWords.length < 3)) {
    score -= 15;
    flags.push({
      rule: 'Gibberish or Non-English Text Detected',
      penalty: 15,
      explanation: `Text has a very low vowel ratio (${(vowelRatio * 100).toFixed(0)}%) or too few recognizable English words.`
    });
  }

  // 13. Company name too short (< 3 chars) or has no vowels (-10)
  const trimmedCompany = (company || '').trim();
  if (trimmedCompany && (trimmedCompany.length < 3 || !/[aeiouAEIOU]/.test(trimmedCompany))) {
    score -= 10;
    flags.push({
      rule: 'Suspicious Company Name',
      penalty: 10,
      explanation: `Company name "${trimmedCompany}" is too short or contains no vowels, which is unusual for a real business.`
    });
  }

  // 14. Free email domain + no corporate domain in link — additional penalty (-10)
  const hasFreeEmail = emailDomain && freeEmailDomains.includes(emailDomain);
  if (hasFreeEmail && !hasValidLink) {
    score -= 10;
    flags.push({
      rule: 'Free Email Without Company Website',
      penalty: 10,
      explanation: 'Using a free email (e.g. Gmail) combined with no valid company website makes verification impossible.'
    });
  }

  // 15. Multiple red flags — if 3+ flags already fired, extra -10
  if (flags.length >= 3) {
    score -= 10;
    flags.push({
      rule: 'Multiple Red Flags Detected',
      penalty: 10,
      explanation: `${flags.length} separate warning rules were triggered — the overall risk profile is significantly elevated.`
    });
  }

  // Clamp score between 0 and 100
  score = Math.max(0, Math.min(100, score));

  // Cap at 69 ("Suspicious") if link is invalid OR recruiter uses a free email domain.
  // A posting MUST have a valid link AND a corporate email to ever be labeled "Likely Real".
  if (!hasValidLink || hasFreeEmail) {
    score = Math.min(score, 69);
  }

  // Determine verdict based on threshold:
  // >= 70: "Likely Real"
  // 40 - 69: "Suspicious"
  // < 40: "Likely Fake"
  let verdict = 'Likely Real';
  if (score < 40) {
    verdict = 'Likely Fake';
  } else if (score < 70) {
    verdict = 'Suspicious';
  }

  if (tips.length === 0) {
    tips.push('Always verify the company on the Ministry of Corporate Affairs (MCA) portal or official LinkedIn page.');
    tips.push('Request an official offer letter on letterhead before signing or sharing government ID.');
  }

  return {
    trustScore: score,
    verdict,
    flags,
    tips
  };
};

module.exports = {
  analyzeInternship
};
