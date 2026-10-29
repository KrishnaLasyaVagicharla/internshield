/**
 * Skill Extractor & Dictionary
 * Syllabus: Exp 11 (Text analysis, RegExp keyword matching, String manipulation)
 */

// Comprehensive dictionary of ~150 tech and soft skills
const SKILLS_DICTIONARY = [
  // Web & Frontend
  'html', 'html5', 'css', 'css3', 'sass', 'scss', 'bootstrap', 'tailwind', 'tailwind css',
  'javascript', 'typescript', 'react', 'react.js', 'reactjs', 'next.js', 'vue', 'vue.js',
  'angular', 'svelte', 'redux', 'context api', 'jquery', 'webpack', 'vite', 'responsive design',
  
  // Backend & Runtime
  'node.js', 'nodejs', 'express', 'express.js', 'nestjs', 'fastify', 'deno', 'bun',
  'python', 'django', 'flask', 'fastapi', 'java', 'spring', 'spring boot', 'c', 'c++',
  'c#', '.net', 'asp.net', 'golang', 'go', 'rust', 'php', 'laravel', 'ruby', 'ruby on rails',
  
  // Databases & Storage
  'mongodb', 'mongoose', 'sql', 'mysql', 'postgresql', 'postgres', 'sqlite', 'redis',
  'oracle', 'firebase', 'supabase', 'cassandra', 'dynamodb', 'elasticsearch', 'prisma',
  
  // APIs & Architecture
  'rest', 'rest api', 'restful apis', 'graphql', 'grpc', 'microservices', 'mvc', 'websocket',
  'socket.io', 'oauth', 'jwt', 'json', 'xml',
  
  // Cloud, DevOps & Tools
  'git', 'github', 'gitlab', 'docker', 'kubernetes', 'aws', 'amazon web services', 'azure',
  'google cloud', 'gcp', 'ci/cd', 'jenkins', 'github actions', 'linux', 'bash', 'shell scripting',
  'nginx', 'terraform', 'ansible', 'prometheus', 'grafana', 'postman',
  
  // Mobile App Development
  'react native', 'flutter', 'dart', 'android', 'kotlin', 'ios', 'swift', 'xcode',
  
  // Data Science, ML & AI
  'machine learning', 'deep learning', 'artificial intelligence', 'data analysis', 'pandas',
  'numpy', 'scikit-learn', 'tensorflow', 'pytorch', 'nlp', 'computer vision', 'opencv',
  'tableau', 'power bi', 'excel', 'r', 'hadoop', 'spark',
  
  // Cybersecurity & Testing
  'cyber security', 'penetration testing', 'ethical hacking', 'owasp', 'cryptography',
  'network security', 'jest', 'mocha', 'chai', 'cypress', 'selenium', 'unit testing',
  
  // UI/UX & Design
  'ui/ux', 'figma', 'adobe xd', 'wireframing', 'prototyping', 'user research',
  
  // Soft Skills & Professional
  'problem solving', 'communication', 'teamwork', 'agile', 'scrum', 'leadership',
  'time management', 'critical thinking', 'debugging', 'code review'
];

/**
 * Extracts recognized skills from text
 * @param {string} text
 * @returns {string[]} unique array of skills found (title-cased)
 */
const extractSkills = (text = '') => {
  if (!text || typeof text !== 'string') return [];

  const lowerText = ` ${text.toLowerCase().replace(/[\r\n\t,.;:()\[\]{}]/g, ' ')} `;
  const matched = new Set();

  for (const skill of SKILLS_DICTIONARY) {
    // Escape special regex characters in skill (e.g. c++, c#, node.js)
    const escaped = skill.replace(/([.+*?^=!:${}()|\[\]\/\\])/g, '\\$1');
    const regex = new RegExp(`(^|\\s|[^a-zA-Z0-9])${escaped}($|\\s|[^a-zA-Z0-9])`, 'i');

    if (regex.test(lowerText)) {
      // Standardize skill display name
      const formatted = formatSkillName(skill);
      matched.add(formatted);
    }
  }

  return Array.from(matched);
};

/**
 * Capitalize/Format skill properly
 */
const formatSkillName = (skill) => {
  const customMap = {
    'html': 'HTML',
    'html5': 'HTML5',
    'css': 'CSS',
    'css3': 'CSS3',
    'javascript': 'JavaScript',
    'typescript': 'TypeScript',
    'react': 'React',
    'react.js': 'React',
    'reactjs': 'React',
    'next.js': 'Next.js',
    'node.js': 'Node.js',
    'nodejs': 'Node.js',
    'express': 'Express.js',
    'express.js': 'Express.js',
    'mongodb': 'MongoDB',
    'sql': 'SQL',
    'mysql': 'MySQL',
    'postgresql': 'PostgreSQL',
    'postgres': 'PostgreSQL',
    'aws': 'AWS',
    'gcp': 'GCP',
    'ci/cd': 'CI/CD',
    'ui/ux': 'UI/UX',
    'php': 'PHP',
    'rest': 'REST API',
    'rest api': 'REST API',
    'restful apis': 'REST API',
    'jwt': 'JWT',
    'git': 'Git',
    'github': 'GitHub',
    'c++': 'C++',
    'c#': 'C#',
    '.net': '.NET',
    'docker': 'Docker',
    'kubernetes': 'Kubernetes'
  };

  const key = skill.toLowerCase();
  if (customMap[key]) return customMap[key];

  return skill
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
};

module.exports = {
  SKILLS_DICTIONARY,
  extractSkills,
  formatSkillName
};
