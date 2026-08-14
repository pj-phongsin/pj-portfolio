export const profile = {
  name: 'Phongsin (PJ) Jirapipattanaporn',
  shortName: 'PJ Phongsin',
  role: 'Software Developer · AI/ML Engineer',
  location: 'Melbourne, Australia',
  email: 'j.phongsin@gmail.com',
  linkedin: 'https://www.linkedin.com/in/pj-phongsin',
  github: 'https://github.com/pj-phongsin',
  pitch:
    'Building AI-integrated products end to end — from full-stack web and mobile apps to ML systems and published research.',
  summary:
    "Master of Information Technology graduate (Deakin University, specialising in Software and Services Development) with hands-on full-stack development experience across React, Node.js/Express, Python/FastAPI, and SQL/NoSQL databases. Built and shipped real AI-integrated products — including PhishGuard, an AI threat-intelligence tool built at a competitive Google DeepMind hackathon, and StoreMind, a full-stack operational platform combining ML demand forecasting with autonomous workforce scheduling. Daily, advanced user of AI-assisted development tools (Claude Code, Gemini API, and LLM integrations) for coding, debugging, and workflow automation. Published IEEE (2022) and Springer (2023) researcher in ML-based signal processing, with prior experience teaching Machine Learning and IoT Systems to professional engineers at Western Digital, Seagate Technology, and Benchmark Electronics. Brings a distinctive engineering foundation — Bachelor of Engineering (Automotive) and Master of Engineering (Mechanical) — combined with three years of high-volume, data-driven retail experience at Uniqlo Australia.",
  /** Deliberately does NOT restate the job title — that's Contact's job. This
      line makes the case; Contact carries the practical availability. */
  lookingFor:
    'Most interested in teams building full-stack, AI-integrated products — where the ML and the software that ships it are built by the same person.',
} as const;

export interface ExperienceEntry {
  company: string;
  role: string;
  period: string;
  location: string;
  current?: boolean;
  bullets: string[];
  logo: string;
  /** Invert the logo (black↔white) in dark mode — for dark-artwork logos that
      would otherwise vanish on the dark background. */
  invertOnDark?: boolean;
  /** Optional external link for the entry, e.g. a public profile. */
  link?: { label: string; url: string };
}

export const experience: ExperienceEntry[] = [
  {
    company: 'Uniqlo Australia Pty Ltd',
    role: 'Sales Associate (Retail Employee)',
    period: '04/2023 – Present',
    location: 'Melbourne',
    current: true,
    bullets: [
      'Analysed customer needs to provide tailored recommendations, contributing to a 24% increase in sales revenue',
      'Managed high-traffic queues at cash registers and fitting rooms, reducing wait times and improving customer experience',
      'Partnered with cross-functional teams to implement strategic layout changes, optimising merchandise visibility',
      "Leveraged live-streaming platforms to drive engagement and meet sales targets during low-traffic periods",
      "Selected as an in-store style model for Uniqlo's StyleHint platform, styling and photographing product outfit combinations to support online engagement and in-store conversion",
    ],
    logo: '/logos/uniqlo_logo.png',
    link: {
      label: 'StyleHint profile',
      url: 'https://www.stylehint.com/au/en/user/uniqlo_au_Phongsin',
    },
  },
  {
    company: 'Suranaree University of Technology',
    role: 'Teaching Assistant',
    period: '07/2019 – 08/2022',
    location: 'Thailand',
    bullets: [
      'Facilitated a Machine Learning course for engineers at Western Digital (Thailand), focusing on data analysis and custom model development',
      'Delivered IoT Systems courses for engineers at Seagate Technology and Benchmark Electronics',
      'Guided students through full IoT system implementation using Raspberry Pi',
      'Instructed Introduction to Robotics covering collaborative, welding, and parallel industrial robots',
    ],
    logo: '/logos/suranaree-university-of-technology-logo.png',
  },
  {
    company: 'Shibaura Institute of Technology',
    role: 'Research Assistant (International Co-operative Education)',
    period: '04/2019 – 07/2019',
    location: 'Japan',
    bullets: [
      'Collaborated in an international research team to develop a Dielectric Elastomer Actuator (DEA) Motor',
      'Contributed to R&D of soft material motor technology bridging mechanical engineering and material science',
    ],
    logo: '/logos/shibaura_institute_technology_logo.png',
    invertOnDark: true,
  },
  {
    company: 'Cherdchai Corporation',
    role: 'Engineer (Co-operative Education)',
    period: '03/2019 – 04/2019',
    location: 'Thailand',
    bullets: [
      'Created high-fidelity 3D models for interior components of a HINO prototype low-floor bus',
      'Developed design schematics that supported successful road tests in Bangkok',
    ],
    logo: '/logos/cherdchai_logo.jpeg',
  },
];

export interface SkillGroup {
  category: string;
  items: string[];
}

export const skills: SkillGroup[] = [
  {
    category: 'Programming Languages',
    items: ['Python', 'JavaScript', 'Java', 'C#', 'SQL', 'Solidity', 'HTML5', 'CSS3'],
  },
  {
    category: 'Front-End & Mobile',
    items: ['ReactJS', 'Android App Development (Java)', 'Figma', 'Canva'],
  },
  {
    category: 'Back-End & Web',
    items: ['Node.js', 'MongoDB', 'MySQL', 'SQLite', 'Docker', 'Kubernetes', 'Web APIs'],
  },
  {
    category: 'Cloud & Platforms',
    items: ['Google Cloud', 'Microsoft Azure', 'Git/GitHub', 'VS Code', 'Android Studio', 'Linux'],
  },
  {
    category: 'AI & Machine Learning',
    items: ['TensorFlow', 'PyTorch', 'Keras', 'Scikit-Learn', 'Pandas', 'NumPy', 'Matplotlib'],
  },
  {
    category: 'LLM & Automation',
    items: [
      'Claude Code',
      'Llama2',
      'Ollama',
      'Gemini API (Pro + TTS)',
      'Google AI Studio',
      'Google Search Grounding',
      'n8n',
      'MCP (Model Context Protocol)',
      'GitHub Copilot',
      'ChatGPT',
      'Prompt Engineering',
    ],
  },
  {
    category: 'Software & QA',
    items: ['Selenium WebDriver (Java)', 'JUnit', 'Eclipse IDE', 'GitHub Actions'],
  },
  {
    category: 'Automotive & Mechanical Engineering',
    items: [
      'ECU Systems (wiring, engine map tuning)',
      'ANSYS (FEA)',
      'SolidWorks (CAD)',
      'Sensor Data Acquisition & Instrumentation',
    ],
  },
];

export interface EducationEntry {
  institution: string;
  degree: string;
  period: string;
  location: string;
  specialisation?: string;
  competencies: string;
  note?: string;
  logo: string;
  /** Invert the logo (black↔white) in dark mode — for dark-artwork logos. */
  invertOnDark?: boolean;
}

export const education: EducationEntry[] = [
  {
    institution: 'Deakin University',
    degree: 'Master of Information Technology',
    period: '03/2024 – 02/2026',
    location: 'Australia',
    specialisation: 'Software and Services Development',
    competencies:
      'Full software development lifecycle, cloud-native development, AI, mobile apps, software testing, database management, DevOps, CI/CD',
    logo: '/logos/deakin_uni_logo.png',
    invertOnDark: true,
  },
  {
    institution: 'Suranaree University of Technology',
    degree: 'Master of Engineering (Mechanical and Process System Engineering)',
    period: '07/2019 – 08/2022',
    location: 'Thailand',
    competencies:
      'Industrial automation, intelligent systems, controller technology, machine vision, advanced numerical methods, statistics, research methodology',
    note: 'Resigned for career transition to Information Technology',
    logo: '/logos/suranaree-university-of-technology-logo.png',
  },
  {
    institution: 'Suranaree University of Technology',
    degree: 'Bachelor of Engineering (Automotive Engineering)',
    period: '07/2015 – 07/2019',
    location: 'Thailand',
    competencies:
      'Engineering mathematics, software development, computer-aided engineering, automotive systems, internal combustion engines, vehicle dynamics, electronic control units',
    logo: '/logos/suranaree-university-of-technology-logo.png',
  },
];
