import { ExperienceItem, ProjectItem, EducationItem, CertificationItem } from '../types';

export interface ParsedResumeData {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  githubUrl: string;
  linkedinUrl: string;
  portfolioUrl: string;
  bio: string;
  summary: string;
  primarySkills: string[];
  backendTech: string;
  frontendTech: string;
  databases: string;
  targetRole: string;
  workType: string;
  experiences: ExperienceItem[];
  projects: ProjectItem[];
  education: EducationItem[];
  certifications: CertificationItem[];
  missingFields: {
    key: string;
    label: string;
    reason: string;
  }[];
  rawText: string;
}

/**
 * Extract text from PDF ArrayBuffer via client-side stream scanning
 */
export function extractTextFromPdfBuffer(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  const textChunks: string[] = [];
  const latin1 = new TextDecoder('latin1').decode(bytes);

  // Pattern 1: Match text inside text rendering blocks (string) Tj or [(string)...] TJ
  const tjRegex = /\((?:\\\(|\\\)|[^()])*\)\s*Tj/g;
  let match: RegExpExecArray | null;

  while ((match = tjRegex.exec(latin1)) !== null) {
    const raw = match[0].replace(/\)\s*Tj$/, '').replace(/^\(/, '');
    const cleaned = cleanPdfString(raw);
    if (cleaned.trim()) textChunks.push(cleaned);
  }

  // Pattern 2: Match text in array TJ operators: [ (text) -120 (text) ] TJ
  const arrayTjRegex = /\[((?:[^\]\\]|\\.)*)\]\s*TJ/g;
  while ((match = arrayTjRegex.exec(latin1)) !== null) {
    const inner = match[1];
    const strParts = inner.match(/\((?:\\\(|\\\)|[^()])*\)/g);
    if (strParts) {
      const line = strParts
        .map((p) => cleanPdfString(p.slice(1, -1)))
        .join('')
        .trim();
      if (line) textChunks.push(line);
    }
  }

  // If Tj patterns didn't yield enough text (e.g. compressed or alternative encoding),
  // extract ascii sequences that look like readable sentences
  if (textChunks.join(' ').length < 100) {
    const streamRegex = /stream[\r\n]+([\s\S]*?)[\r\n]+endstream/g;
    while ((match = streamRegex.exec(latin1)) !== null) {
      const streamContent = match[1];
      const asciiOnly = streamContent.replace(/[^\x20-\x7E\r\n]/g, ' ');
      const words = asciiOnly
        .split(/\s+/)
        .filter((w) => w.length > 2 && /^[a-zA-Z0-9.,@/:#_-]+$/.test(w));
      if (words.length > 20) {
        textChunks.push(words.join(' '));
      }
    }
  }

  return textChunks.join('\n').replace(/\n{3,}/g, '\n\n');
}

function cleanPdfString(str: string): string {
  return str
    .replace(/\\([0-7]{3})/g, (_, oct) => String.fromCharCode(parseInt(oct, 8)))
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t')
    .replace(/\\\(/g, '(')
    .replace(/\\\)/g, ')')
    .replace(/\\\\/g, '\\');
}

/**
 * Intelligent Heuristic Resume Parser
 */
export function parseResumeContent(text: string): ParsedResumeData {
  const normalizedText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const lines = normalizedText
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  // 1. Email Extraction
  const emailMatch = normalizedText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const email = emailMatch ? emailMatch[0].trim() : '';

  // 2. Phone Extraction
  const phoneMatch = normalizedText.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\+91[-.\s]?[6-9]\d{9}/);
  const phone = phoneMatch ? phoneMatch[0].trim() : '';

  // 3. Social & Profile Links
  const githubMatch = normalizedText.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_-]+)/i);
  const githubUrl = githubMatch
    ? (githubMatch[0].startsWith('http') ? githubMatch[0] : `https://${githubMatch[0]}`)
    : '';

  const linkedinMatch = normalizedText.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i);
  const linkedinUrl = linkedinMatch
    ? (linkedinMatch[0].startsWith('http') ? linkedinMatch[0] : `https://${linkedinMatch[0]}`)
    : '';

  const portfolioMatch = normalizedText.match(/(?:https?:\/\/)(?!github|linkedin)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?/i);
  const portfolioUrl = portfolioMatch ? portfolioMatch[0] : '';

  // 4. Candidate Name Extraction
  let name = '';
  const invalidNameKeywords = [
    'resume', 'curriculum', 'vitae', 'contact', 'email', 'phone', 'profile',
    'summary', 'experience', 'education', 'skills', 'projects', 'developer',
    'engineer', 'software', 'portfolio', 'page', 'objective'
  ];

  for (let i = 0; i < Math.min(lines.length, 8); i++) {
    const line = lines[i];
    const lower = line.toLowerCase();
    const hasInvalid = invalidNameKeywords.some((kw) => lower.includes(kw));
    const words = line.split(/\s+/);
    if (!hasInvalid && words.length >= 2 && words.length <= 4 && !line.includes('@') && !line.includes('http')) {
      name = line.replace(/[^a-zA-Z\s.]/g, '').trim();
      break;
    }
  }

  if (!name && email) {
    const prefix = email.split('@')[0].replace(/[._]/g, ' ');
    name = prefix
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }

  // 5. Title / Target Role Extraction
  let title = '';
  const titlePatterns = [
    /Full[- ]?Stack (?:Developer|Engineer)/i,
    /Backend (?:Developer|Engineer)/i,
    /Frontend (?:Developer|Engineer)/i,
    /Software (?:Engineer|Developer)/i,
    /DevOps (?:Engineer|Specialist)/i,
    /Cloud (?:Engineer|Architect)/i,
    /AI\/ML (?:Engineer|Developer)/i,
    /System (?:Architect|Engineer)/i,
    /Data (?:Engineer|Scientist)/i,
    /Mobile (?:Developer|Engineer)/i,
  ];

  for (const pattern of titlePatterns) {
    const match = normalizedText.match(pattern);
    if (match) {
      title = match[0];
      break;
    }
  }
  if (!title) {
    title = 'Full Stack Software Engineer';
  }

  // 6. Location Extraction
  let location = '';
  const locationPatterns = [
    /([A-Z][a-zA-Z]+(?:[\s-][A-Z][a-zA-Z]+)*,\s*(?:India|USA|United States|UK|Canada|Germany|Remote))/i,
    /(?:Bengaluru|Bangalore|Delhi|Mumbai|Pune|Hyderabad|Noida|Gurgaon|San Francisco|New York|Seattle|London|Remote)/i,
  ];
  for (const pat of locationPatterns) {
    const locMatch = normalizedText.match(pat);
    if (locMatch) {
      location = locMatch[0].trim();
      break;
    }
  }
  if (!location) {
    location = 'Bengaluru, India';
  }

  // 7. Sections Segmentation
  const sections = segmentSections(lines);

  // 8. Bio & Summary
  let summary = '';
  if (sections.summary) {
    summary = sections.summary.join(' ').slice(0, 350);
  } else {
    summary = `Results-driven ${title} specializing in building high-performance, resilient, and scalable software architectures.`;
  }
  const bio = summary;

  // 9. Technical Skills Segmentation
  const rawSkillsText = sections.skills ? sections.skills.join(' ') : normalizedText;
  const categorized = extractCategorizedSkills(rawSkillsText);

  // 10. Experience Extraction
  const experiences = extractExperiences(sections.experience || [], normalizedText);

  // 11. Projects Extraction
  const projects = extractProjects(sections.projects || [], normalizedText);

  // 12. Education Extraction
  const education = extractEducation(sections.education || [], normalizedText);

  // 13. Certifications Extraction
  const certifications = extractCertifications(sections.certifications || []);

  // 14. Missing Fields Detection
  const missingFields: ParsedResumeData['missingFields'] = [];

  if (!email) {
    missingFields.push({
      key: 'email',
      label: 'Email ID',
      reason: 'No valid email address found in the resume.',
    });
  }
  if (!githubUrl) {
    missingFields.push({
      key: 'githubUrl',
      label: 'GitHub Profile Link',
      reason: 'GitHub link was not detected in resume text.',
    });
  }
  if (!linkedinUrl) {
    missingFields.push({
      key: 'linkedinUrl',
      label: 'LinkedIn Profile Link',
      reason: 'LinkedIn URL was not found in the resume.',
    });
  }
  if (experiences.length === 0) {
    missingFields.push({
      key: 'experience',
      label: 'Work Experience Details',
      reason: 'Could not automatically identify formal work experience entries.',
    });
  }
  if (projects.length === 0) {
    missingFields.push({
      key: 'projects',
      label: 'Project Showcase',
      reason: 'No projects detected in the resume text.',
    });
  }

  return {
    name: name || 'Your Name',
    title,
    email: email || '',
    phone: phone || '',
    location,
    githubUrl,
    linkedinUrl,
    portfolioUrl,
    bio,
    summary,
    primarySkills: categorized.primarySkills,
    backendTech: categorized.backend,
    frontendTech: categorized.frontend,
    databases: categorized.databases,
    targetRole: title,
    workType: 'Full-time / Hybrid',
    experiences,
    projects,
    education,
    certifications,
    missingFields,
    rawText: normalizedText.slice(0, 800),
  };
}

/**
 * Split text lines into known resume sections
 */
function segmentSections(lines: string[]): Record<string, string[]> {
  const sections: Record<string, string[]> = {};
  let currentSection = 'header';
  sections[currentSection] = [];

  const headerKeywords: Record<string, string> = {
    summary: 'summary',
    profile: 'summary',
    about: 'summary',
    objective: 'summary',
    experience: 'experience',
    employment: 'experience',
    work: 'experience',
    projects: 'projects',
    skills: 'skills',
    technical: 'skills',
    competencies: 'skills',
    education: 'education',
    academic: 'education',
    certifications: 'certifications',
    certificates: 'certifications',
    achievements: 'certifications',
  };

  for (const line of lines) {
    const cleanLine = line.toLowerCase().replace(/[^a-z\s]/g, '').trim();
    let detectedSection: string | null = null;

    for (const [kw, sec] of Object.entries(headerKeywords)) {
      if (cleanLine === kw || cleanLine.startsWith(`${kw} `) || cleanLine.endsWith(` ${kw}`)) {
        detectedSection = sec;
        break;
      }
    }

    if (detectedSection) {
      currentSection = detectedSection;
      if (!sections[currentSection]) sections[currentSection] = [];
    } else {
      if (!sections[currentSection]) sections[currentSection] = [];
      sections[currentSection].push(line);
    }
  }

  return sections;
}

/**
 * Categorize skills into Frontend, Backend, Databases, and Primary
 */
function extractCategorizedSkills(text: string) {
  const commonSkills = [
    'React', 'Next.js', 'TypeScript', 'JavaScript', 'Node.js', 'Express',
    'Python', 'Django', 'FastAPI', 'Java', 'Spring Boot', 'Go', 'C++',
    'PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'Docker', 'Kubernetes',
    'AWS', 'Git', 'GraphQL', 'REST API', 'Tailwind CSS', 'Redux', 'Kafka',
    'Linux', 'CI/CD', 'Microservices', 'HTML', 'CSS', 'Prisma', 'Socket.io'
  ];

  const foundSkills = new Set<string>();
  for (const skill of commonSkills) {
    const regex = new RegExp(`\\b${skill.replace('.', '\\.')}\\b`, 'i');
    if (regex.test(text)) {
      foundSkills.add(skill);
    }
  }

  const primarySkills = Array.from(foundSkills);
  if (primarySkills.length === 0) {
    primarySkills.push('JavaScript', 'TypeScript', 'React', 'Node.js', 'SQL', 'Git');
  }

  const backendKeywords = ['Node.js', 'Express', 'Python', 'Django', 'FastAPI', 'Java', 'Spring Boot', 'Go', 'REST API', 'GraphQL', 'Microservices'];
  const frontendKeywords = ['React', 'Next.js', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'Redux', 'HTML', 'CSS'];
  const dbKeywords = ['PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'Prisma'];

  const backend = primarySkills.filter((s) => backendKeywords.includes(s)).join(', ') || 'Node.js, Express, REST APIs';
  const frontend = primarySkills.filter((s) => frontendKeywords.includes(s)).join(', ') || 'React, TypeScript, Tailwind CSS';
  const databases = primarySkills.filter((s) => dbKeywords.includes(s)).join(', ') || 'PostgreSQL, MongoDB, Redis';

  return {
    primarySkills: primarySkills.slice(0, 14),
    backend,
    frontend,
    databases,
  };
}

/**
 * Extract experiences from lines
 */
function extractExperiences(lines: string[], fullText: string): ExperienceItem[] {
  const experiences: ExperienceItem[] = [];

  // Group lines into blocks by dates (e.g. 2021 - 2023, Jan 2022 - Present)
  const dateRegex = /(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|20\d{2})[-–\s\d]+(?:Present|Current|20\d{2})/i;
  
  let currentBlock: string[] = [];
  const blocks: string[][] = [];

  for (const line of lines) {
    if (dateRegex.test(line) && currentBlock.length > 0) {
      blocks.push(currentBlock);
      currentBlock = [line];
    } else {
      currentBlock.push(line);
    }
  }
  if (currentBlock.length > 0) blocks.push(currentBlock);

  blocks.forEach((block, idx) => {
    if (block.length === 0) return;
    const headerLine = block[0];
    const dateMatch = headerLine.match(dateRegex);
    const period = dateMatch ? dateMatch[0] : '2023 - Present';

    const rolePart = block[0].replace(dateRegex, '').trim() || 'Software Engineer';
    const companyPart = block[1] && !block[1].startsWith('•') ? block[1] : 'Technology Corporation';

    const highlights = block
      .filter((l) => l.startsWith('•') || l.startsWith('-') || l.startsWith('*') || l.length > 25)
      .map((l) => l.replace(/^[•\-*]\s*/, '').trim())
      .filter((l) => l.length > 15)
      .slice(0, 4);

    if (highlights.length === 0) {
      highlights.push('Engineered scalable systems, architected core microservices, and elevated application throughput.');
    }

    experiences.push({
      id: `exp_parsed_${idx + 1}`,
      role: rolePart.slice(0, 50),
      company: companyPart.slice(0, 50),
      period,
      location: 'Bengaluru, India',
      highlights,
      techStack: ['TypeScript', 'React', 'Node.js', 'PostgreSQL'],
    });
  });

  return experiences.slice(0, 4);
}

/**
 * Extract projects from lines
 */
function extractProjects(lines: string[], fullText: string): ProjectItem[] {
  const projects: ProjectItem[] = [];
  
  // Segment projects by heading or link
  let currentLines: string[] = [];
  const projectBlocks: string[][] = [];

  for (const line of lines) {
    if ((line.startsWith('•') || line.startsWith('-')) && currentLines.length === 0) {
      currentLines.push(line);
    } else if (line.length > 3 && line.length < 50 && !line.startsWith('•') && currentLines.length > 0) {
      projectBlocks.push(currentLines);
      currentLines = [line];
    } else {
      currentLines.push(line);
    }
  }
  if (currentLines.length > 0) projectBlocks.push(currentLines);

  projectBlocks.forEach((block, idx) => {
    if (block.length === 0) return;
    const title = block[0].replace(/^[•\-*]\s*/, '').slice(0, 45);
    const bullets = block
      .slice(1)
      .map((b) => b.replace(/^[•\-*]\s*/, '').trim())
      .filter((b) => b.length > 15);

    const desc = bullets.join(' ').slice(0, 220) || `Scalable engineering project demonstrating production-grade architecture and robust performance.`;

    projects.push({
      id: `proj_parsed_${idx + 1}`,
      title,
      subtitle: 'Full-Stack Architecture & Cloud Deployment',
      category: 'Full Stack',
      description: desc,
      metrics: 'Production Deployed • High Throughput',
      tags: ['React', 'Node.js', 'PostgreSQL', 'Docker'],
      githubUrl: 'https://github.com',
      liveUrl: '',
    });
  });

  return projects.slice(0, 6);
}

/**
 * Extract education from lines
 */
function extractEducation(lines: string[], fullText: string): EducationItem[] {
  const education: EducationItem[] = [];
  const degreeRegex = /(?:B\.?Tech|B\.?E\.?|B\.?S\.?|Bachelor|M\.?Tech|M\.?S\.?|Master|Diploma)/i;

  let degree = '';
  let institution = '';
  let period = '';

  for (const line of lines) {
    if (degreeRegex.test(line) && !degree) {
      degree = line.slice(0, 60);
    } else if (!institution && (line.includes('University') || line.includes('Institute') || line.includes('College') || line.includes('School'))) {
      institution = line.slice(0, 60);
    }
    const yearMatch = line.match(/20\d{2}\s*[-–]\s*20\d{2}|20\d{2}/);
    if (yearMatch && !period) {
      period = yearMatch[0];
    }
  }

  if (degree || institution) {
    education.push({
      degree: degree || 'Bachelor of Technology in Computer Science',
      institution: institution || 'Engineering Institute of Technology',
      period: period || '2020 - 2024',
      location: 'India',
      details: 'Focus on distributed systems, data structures, and algorithms.',
    });
  }

  return education;
}

/**
 * Extract certifications from lines
 */
function extractCertifications(lines: string[]): CertificationItem[] {
  return lines
    .filter((l) => l.length > 5 && l.length < 80)
    .slice(0, 4)
    .map((name, i) => ({
      title: name.replace(/^[•\-*]\s*/, '').trim(),
      issuer: 'Accredited Credential Authority',
      year: '2024',
      description: 'Verified professional credential and technical competency.',
    }));
}
