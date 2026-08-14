export interface Project {
  id: string;
  title: string;
  /** Short type label shown on the card, e.g. "AI / Full-Stack", "Published Research — IEEE". */
  kind: string;
  tagline: string;
  tech: string[];
  githubUrl?: string;
  demoUrl?: string;
  /** External demo video link (e.g. YouTube) — rendered as a link, not an embed. */
  videoUrl?: string;
  /** Published paper DOI/link for research entries. */
  paperUrl?: string;
  /** Full published paper title, shown for research entries. */
  publication?: string;
  /**
   * Looping background footage for the detail-page hero (path under /public).
   * Optional per project — the hero falls back to the plain header when absent.
   */
  heroVideo?: string;
  /**
   * Brand mark used as an oversized watermark behind the detail-page hero, for
   * projects with a logo but no footage. Needs a transparent PNG.
   */
  heroLogo?: string;
  /** Brand colour for the glow behind `heroLogo`; defaults to the site accent. */
  heroLogoGlow?: string;
  /** App screenshots for the detail-page carousel, in display order. */
  screens?: { src: string; caption: string }[];
  /** 'split' (default) puts the description beside the phone; 'center' beneath. */
  screensLayout?: 'split' | 'center';
  /** false when the screenshots already carry a device frame of their own. */
  screensFramed?: boolean;
  /** Aspect of an unframed screenshot, e.g. '640 / 1353'. */
  screensAspect?: string;
  /** Event photography for a "Highlights" section, in display order. */
  photos?: { src: string; caption: string }[];
  /** Aspect the photos are normalised to, e.g. '3 / 2'. */
  photosAspect?: string;
  /**
   * Recorded demo, shown cropped to just the device. `crop` is the device
   * region within the source frame, in source pixels — it lets a screen
   * recording keep its black surround on disk and still display tight.
   */
  demo?: {
    src: string;
    poster: string;
    /** false for silent screen recordings — hides the player's mute control. */
    hasAudio?: boolean;
    crop: {
      x: number;
      y: number;
      width: number;
      height: number;
      sourceWidth: number;
      sourceHeight: number;
      cornerRadius?: number;
    };
  };
  image?: string;
  description: string;
  problem: string;
  approach: string[];
  architecture: string[];
  results: string[];
}

export const projects: Project[] = [
  {
    id: 'storemind',
    title: 'StoreMind',
    kind: 'AI / Full-Stack Platform',
    tagline: 'AI retail intelligence platform — demand forecasting meets autonomous workforce scheduling',
    tech: [
      'React',
      'Vite',
      'Tailwind CSS',
      'Chart.js',
      'Node.js',
      'Express',
      'Python',
      'FastAPI',
      'Scikit-Learn',
      'MySQL 8',
      'Docker',
    ],
    githubUrl: 'https://github.com/pj-phongsin/storemind',
    // Captured from the running stack via CDP at a fixed 1600×1000 viewport, so
    // every shot is framed identically. Kept as PNG: flat UI colour and small
    // text compress better losslessly here than JPEG (which made the Gantt
    // *larger*), unlike the photographic captures on other projects.
    heroVideo: '/project/storemind/storemind_hero_video.mp4',
    screensLayout: 'center',
    screensFramed: false,
    screensAspect: '1600 / 1000',
    screens: [
      {
        src: '/project/storemind/shots/1_dws.png',
        caption:
          'Daily Work Schedule — every staff member auto-assigned across the day, with task rotation and staggered breaks',
      },
      {
        src: '/project/storemind/shots/2_agent.png',
        caption:
          'AI agent covering an absence: it reallocated a P3 fitting-room staffer onto the vacant P1 floor task, matched 5/5 on skill',
      },
      {
        src: '/project/storemind/shots/3_forecast.png',
        caption: 'Demand forecast — predicted daily revenue per product category, 7 days ahead',
      },
      {
        src: '/project/storemind/shots/4_roster.png',
        caption: 'Roster — editable day schedule with assigned task, priority band and status per employee',
      },
      {
        src: '/project/storemind/shots/5_sales.png',
        caption: 'Sales overview — revenue trend and category split across a year of trading data',
      },
      {
        src: '/project/storemind/shots/6_inventory.png',
        caption: 'Inventory — stock on hand against reorder points, flagged by status',
      },
    ],
    description:
      'A full-stack retail management platform combining ML demand forecasting with autonomous AI workforce scheduling, inspired by Uniqlo-style Australian retail operations.',
    problem:
      'Retailers struggle to align staffing with demand — leading to overstocking, understaffing, and lost revenue. Forecasting and scheduling are usually handled as separate, manual processes with no feedback loop between them.',
    approach: [
      'Engineered a Python/FastAPI ML service running 4 Random Forest models (one per product category), trained on 365 days of Australian seasonal sales data, forecasting demand 1–30 days ahead',
      'Designed a period-first Daily Work Schedule (DWS) generator that auto-assigns every staff member to P1/P2/P3 priority tasks with staggered breaks and TIDY (store prep) periods across real shift templates',
      'Built a rule-based AI agent that autonomously handles sick leave and shift swaps — finding eligible replacements via skill matching and availability masks, wrapped in full DB transactions with rollback',
      'Delivered a 6-page React dashboard (Sales, Inventory, Roster, Forecast, AI Agent, DWS) with Chart.js visualisations, an editable roster grid, and a Gantt-style DWS view',
    ],
    architecture: [
      'Dockerised across 4 containers: MySQL 8, Node.js/Express API (port 3001), Python/FastAPI ML service (port 8000), and nginx serving a multi-stage-built React frontend',
      '10-table MySQL schema covering products, inventory, sales, employees, skills, tasks, shifts, and generated DWS assignments/breaks',
      'Node/Express layer exposes REST endpoints for sales, inventory, employees, shifts, tasks, forecasting, agent actions, and DWS, proxying ML-specific calls to the FastAPI service internally',
      'DWS assignment algorithm builds per-employee state, generates period boundaries from shift/break edges and 120-minute ticks, then assigns tasks by priority with stickiness and rotation rules before merging into a final schedule',
    ],
    results: [
      'Forecasts 1–30 days ahead per product category using Random Forest models trained on a full year of seasonal sales data',
      'Automates end-to-end daily scheduling — including sick-leave reassignment — that would otherwise be a manual, error-prone process',
      'Traced and resolved an intermittent cross-container integration bug by following the request/response chain across the Docker network, identifying a health-check race condition and fixing it with a readiness probe',
      'Shipped a focused roster-dws-only branch as a stripped-down deployment option for teams that only need the scheduling features',
    ],
  },
  {
    id: 'phishguard',
    title: 'PhishGuard',
    kind: 'AI / Hackathon',
    tagline: 'AI cyber threat intelligence tool that turns a suspicious message into a plain-language verdict',
    tech: [
      'React 19',
      'Vite',
      'TypeScript',
      'Tailwind CSS',
      'Google Gemini API',
      'Google Search Grounding',
      'Node.js',
      'Express',
    ],
    githubUrl: 'https://github.com/pj-phongsin/phishguard',
    heroVideo: '/project/phishguard/phishguard_hero_video.mp4',
    // Copies under photos/ are centre-cropped to a common 3:2 and resized to
    // 2x the max display width — the originals are 6000×4000 / 4032×3024
    // camera files totalling 23 MB.
    photosAspect: '3 / 2',
    photos: [
      {
        src: '/project/phishguard/photos/1_DSC_0331.jpg',
        caption: 'At the Google office hosting the hackathon',
      },
      {
        src: '/project/phishguard/photos/2_IMG_3498.jpg',
        caption: 'The venue, overlooking the city',
      },
      {
        src: '/project/phishguard/photos/3_IMG_3707.jpg',
        caption: 'With the team at the venue',
      },
      {
        src: '/project/phishguard/photos/4_PMJ00098.jpg',
        caption: 'A session with the other participants',
      },
      {
        src: '/project/phishguard/photos/5_PMJ00352.jpg',
        caption: 'The team working through the build',
      },
      {
        src: '/project/phishguard/photos/6_PMJ00354.jpg',
        caption: 'Mid-build, talking through the approach',
      },
    ],
    demo: {
      src: '/project/phishguard/phishguard_demo_video.mp4',
      poster: '/project/phishguard/phishguard_demo_poster.jpg',
      // Silent screen recording — the source has no audio track at all.
      hasAudio: false,
      // Already cropped to the window and scaled during encoding, so this is
      // the identity crop; cornerRadius rounds off the recording's black
      // surround showing through the window's rounded corners.
      crop: {
        x: 0,
        y: 0,
        width: 1640,
        height: 956,
        sourceWidth: 1640,
        sourceHeight: 956,
        cornerRadius: 28,
      },
    },
    description:
      'A single-page app that lets a worried user drop in a suspicious message, email, screenshot, or PDF and instantly get back a plain-language cyber threat verdict — built in a 3-person team at the GDG Melbourne: DeepMind AI Sprint Hackathon.',
    problem:
      "Everyday people — especially non-technical or non-English-speaking users — receive phishing SMS, scam emails, and fake invoices they can't confidently evaluate. Existing security tools are built for analysts, not for someone who just wants a fast, calm, trustworthy answer: is this safe, and what do I do?",
    approach: [
      'Integrated Gemini 3.1 Pro via Google AI Studio with Search Grounding to triage suspicious text, emails, screenshots, and PDFs — extracting Indicators of Compromise (URLs, domains, emails, phone numbers, crypto addresses) and identifying social engineering tactics',
      'Grounded domain and brand-impersonation checks against live Google Search results, with an explicit calibration rubric (0–20 Benign, 21–50 Low, 51–79 Suspicious, 80–100 Malicious) to avoid over-flagging legitimate messages',
      'Implemented Gemini TTS to read threat briefings aloud in a warm, reassuring voice, with Web Speech API fallback and output support across 19+ languages',
      'Built an offline "failsafe" mode that swaps in a realistic mock verdict if no API key is configured or the live call fails, so the demo always works',
    ],
    architecture: [
      'React 19 + TypeScript single-page app (Vite 6, Tailwind CSS 4) with no backend required for the core feature — Gemini calls run client-side',
      'Two Gemini models: `gemini-3.1-pro-preview` for structured JSON threat analysis with search grounding, and `gemini-3.1-flash-tts-preview` for speech, decoded and played via the Web Audio API',
      'Two API key handling paths: build-time injection for trusted hosting, or a client-side settings panel where a visitor pastes their own key (held only in local component state) for zero-cost public static hosting',
    ],
    results: [
      'Built and pitched to a judging panel in a 3-person team at a competitive hackathon format (June 2026, Google Office Melbourne)',
      'Handles multi-channel input — pasted text or dragged-in screenshots/PDFs — with a live animated threat-score gauge and IOC breakdown',
      'Produces calibrated verdicts across 6 classifications (Phishing, Credential Spoofing, Fake Invoice, Impersonation, Smishing, Benign) with confidence scoring',
      'Ships an offline deployment guide covering both static hosting and Docker-based server-side key handling',
    ],
  },
  {
    id: 'welding-arc-sound',
    title: 'Welding Arc Sound Anomaly Detection',
    kind: 'Published Research — IEEE',
    tagline: 'Classifying weld quality from arc sound alone with RNN, LSTM, and one-class SVM',
    tech: ['Python', 'Librosa', 'Matplotlib', 'RNN', 'LSTM', 'One-class SVM', 'MFCC', 'Raspberry Pi'],
    paperUrl: 'https://doi.org/10.1109/KST53302.2022.9729058',
    publication:
      'Development of Anomaly Detection Model for Welding Classification Using Arc Sound — 2022 14th International Conference on Knowledge and Smart Technology (KST), IEEE',
    heroVideo: '/project/welding_arc_sound_anomaly_detection/welding_hero_video.mp4',
    description:
      'First-author research classifying Gas Metal Arc Welding (GMAW) weld bead quality — normal vs. burn-through — purely from the sound of the welding arc, published at IEEE KST 2022.',
    problem:
      'Weld bead quality is normally checked via destructive or non-destructive testing after welding is complete — slow, and destructive testing damages the test piece. The goal: a non-invasive, real-time way to monitor weld quality during the process using only recorded arc sound.',
    approach: [
      'Designed a full-factorial Design of Experiments across 16 welding runs (ABB robot arm + KEMPPI welder), varying travel speed, voltage, and wire feed speed',
      'Captured arc sound with a Raspberry Pi 3B + Respeaker 2-Mics microphone array at 22,050 Hz',
      'Built a Python signal-processing pipeline (Librosa, Matplotlib) generating spectrograms, Mel-spectrograms, and MFCC features from 1,801 sliced 300ms audio clips',
      'Trained two parallel model tracks: RNN and LSTM for 3-class classification (normal / burn-through / noise), and a one-class SVM for binary anomaly detection',
    ],
    architecture: [
      'MFCC feature extraction with a 2048-sample FFT window and 512-sample sliding window, stored as JSON',
      'RNN/LSTM: 2 recurrent layers (64 units) + dense layers with softmax output, Adam optimizer, 70/20/10 train/test/validation split',
      'Spectrogram analysis showed burn-through beads produce visibly discontinuous waveforms vs. the smooth pattern of normal welds — confirming arc sound alone carries the quality signal',
    ],
    results: [
      'Best model (LSTM) achieved 94.77% training / 92.24% test accuracy, with all models exceeding 70% per-class accuracy',
      'Demonstrated that real-time, non-invasive weld quality monitoring from sound is viable without stopping production',
      'Published: 2022 14th International Conference on Knowledge and Smart Technology (KST), IEEE',
    ],
  },
  {
    id: 'tool-wear-analysis',
    title: 'Tool Wear Analysis from Milling Sound',
    kind: 'Published Research — Springer',
    tagline: 'Detecting CNC tool wear non-invasively from machining sound via signal processing',
    tech: ['Python', 'Librosa', 'Fourier Transform', 'Raspberry Pi', 'CNC Milling', 'ISO 8688-2'],
    paperUrl: 'https://doi.org/10.1007/978-981-19-6841-9_7',
    publication:
      'Tool Wear Analysis on Time-Domain and Frequency-Domain Data of Machining S45C Using Signal Processing Technique — Recent Advances in Manufacturing Engineering and Processes, Lecture Notes in Mechanical Engineering, Springer Nature Singapore (2023)',
    heroVideo: '/project/tool_wear_analysis_from_milling_sound/cnc_milling_hero_video.mp4',
    description:
      'Research investigating whether CNC face-milling tool wear can be monitored non-invasively from machining sound alone — avoiding costly microscope-based inspection — published as a Springer book chapter (2023).',
    problem:
      'Tool wear directly affects workpiece quality, machine power consumption, and production cost — but existing inspection methods either require stopping the machine for microscopy or need expensive specialized sensors.',
    approach: [
      'Ran 6 milling experiments (1–6 minutes each, fresh HSS end mill per run) on S45C steel with fixed cutting parameters',
      'Measured ground-truth flank wear per ISO 8688-2:1989 via light and scanning-electron microscopy — wear progressed from ~240μm to ~700μm across runs',
      'Recorded each run with a Raspberry Pi + Re-speaker microphone array, capturing ambient → spindle start → milling → ambient phases as WAV',
      'Built a Python (Librosa) pipeline converting audio into time-domain and frequency-domain (Fourier transform) representations',
    ],
    architecture: [
      'Same low-cost Raspberry Pi + mic-array capture rig as the companion welding study, applied to a different manufacturing process',
      'Comparative spectrum analysis across wear levels: 0–3000 Hz proved to be the invariant "normal milling" signature, isolating the wear signal to specific higher bands',
    ],
    results: [
      'Identified two specific frequency bands — 3350 Hz and 3755 Hz — whose magnitude increased systematically with measured tool wear',
      'Established a foundation for future ML-based tool-wear monitoring using only a low-cost microphone',
      'Published: Recent Advances in Manufacturing Engineering and Processes, Lecture Notes in Mechanical Engineering, Springer Nature Singapore (2023)',
    ],
  },
  {
    id: 'greeneye',
    title: 'GreenEye',
    kind: 'Startup Venture / Product Design',
    tagline: 'AI-powered kitchen inventory and food-waste app — from empathy interviews to investor pitch, as CEO/Founder',
    tech: ['Figma', 'Canva', 'Business Planning', 'Lean Canvas', 'Go-To-Market Strategy'],
    heroLogo: '/project/green_eye/greeneye_mark.png',
    heroLogoGlow: '#6ac697',
    screens: [
      {
        src: '/project/green_eye/1_greeneye_home.jpg',
        caption: "Home — today's highlight, suggested recipes, and items nearing expiry",
      },
      {
        src: '/project/green_eye/2_greeneye_inventory.jpg',
        caption: 'Inventory — every item with its purchase and expiry date, each linking to a recipe',
      },
      {
        src: '/project/green_eye/3_greeneye_grocery.jpg',
        caption: 'Grocery list — recommended restocks with per-item prices and a direct buy action',
      },
      {
        src: '/project/green_eye/4_greeneye_recommend1.jpg',
        caption: 'Recipe recommendations generated from what is already in the inventory',
      },
      {
        src: '/project/green_eye/5_greeneye_recommend2.jpg',
        caption: 'Recipe detail — ingredients and step-by-step instructions',
      },
      {
        src: '/project/green_eye/6_greeneye_barcode_scaner.jpg',
        caption: 'Barcode scan — reads an item, then adds it to the inventory with its expiry date',
      },
    ],
    demo: {
      src: '/project/green_eye/greeneye_demo_video.mp4',
      poster: '/project/green_eye/greeneye_demo_poster.jpg',
      // Cropped to the device at encode time (was a CSS crop of the full
      // 1920×1080 frame), so this is now the identity — only cornerRadius does
      // any work. 482 not 483: libx264 needs an even width for yuv420p.
      crop: {
        x: 0,
        y: 0,
        width: 482,
        height: 974,
        sourceWidth: 482,
        sourceHeight: 974,
        cornerRadius: 84,
      },
    },
    description:
      'An AI-powered food-waste-reduction app concept taken through a full entrepreneurship lifecycle as CEO/Founder of a 6-person team: empathy interviews → ideation → branding → business plan → high-fidelity Figma prototype → pitching → Innovation Showcase application.',
    problem:
      'Households routinely buy food they forget about, don\'t track expiration dates, and throw away a large share of what they purchase — the FAO estimates ~30% of household food in developed countries goes to waste.',
    approach: [
      'Shaped the concept from a live empathy interview about the everyday "what to eat today" struggle, brainstorming 5 concepts before converging on inventory tracking + AI recipes',
      'Designed the product: barcode-scanning kitchen inventory with expiry notifications, AI-generated recipe suggestions from what\'s on hand, and automated shopping lists with per-seller price comparison',
      'Authored the full Business Plan — market analysis, competitive positioning against Fridge Pal/FoodKeeper, B2C freemium/subscription/affiliate revenue model, and a funding roadmap from self-funding through crowdfunding to VC',
      'Delivered a high-fidelity interactive Figma prototype covering Homepage, Inventory, Recipe, Grocery List, and Barcode Scan flows, plus a recorded pitch video',
    ],
    architecture: [
      'Planned (not built) technical stack documented in the Design & Technology Plan: React frontend with Capacitor mobile wrapper, ASP.NET Core API, Azure SQL + SQLite offline storage, ZXing barcode scanning, ML.NET recipe recommendations, Azure Notification Hubs',
      'Branding system: mint-green palette, "See what you have, waste less" slogan, and a stylized green-eye-with-sprout logo',
    ],
    results: [
      'Led a 6-person team end-to-end through a full trimester as CEO/Founder — the role and topic I ranked #1 at unit start',
      'Submitted a formal application as "Founder of GreenEye" to the Startupbootcamp Australia Innovation Showcase panel',
      'Complete venture package delivered: branding, landing page copy, business plan, hi-fi prototype, demo video, and two rounds of pitching',
    ],
  },
  {
    id: 'personalized-learning',
    title: 'Personalized Learning App',
    kind: 'Android / Mobile',
    tagline: 'Adaptive Android quiz app that shapes content around each learner\'s chosen tech interests',
    tech: ['Java', 'Android SDK', 'SQLite', 'Volley', 'Google Pay API', 'Material Design 3', 'Fragments + Navigation'],
    githubUrl:
      'https://github.com/pj-phongsin/SIT708/tree/master/Task%2010.1D/Personalized%20Learning%20Experiences%20App',
    videoUrl: 'https://youtu.be/TlqkUbXQR5M',
    // Screens are normalised copies under screens/ — cropped to the device,
    // resized to a common 640×1353, and masked to transparent corners. The
    // originals are emulator captures that still carry the IDE background, at
    // two different capture sizes.
    screensFramed: false,
    screensAspect: '640 / 1353',
    screens: [
      {
        src: '/project/personalized_learning_app/screens/1_personal_learning_login.png',
        caption: 'Login — the entry point for returning learners',
      },
      {
        src: '/project/personalized_learning_app/screens/2_personal_learning_register.png',
        caption: 'Sign up — account creation with email, password and phone fields',
      },
      {
        src: '/project/personalized_learning_app/screens/3_personal_learning_interest.png',
        caption: 'Interests — pick up to 10 topics; these drive what the quiz generator produces',
      },
      {
        src: '/project/personalized_learning_app/screens/4_personal_learning_home.png',
        caption: 'Home — the generated task built from the selected interests',
      },
      {
        src: '/project/personalized_learning_app/screens/5_personal_learning_quiz1.png',
        caption: 'Quiz — "What is the primary goal of supervised learning in machine learning?"',
      },
      {
        src: '/project/personalized_learning_app/screens/6_personal_learning_quiz2.png',
        caption: 'Quiz — "Which of the following is NOT a type of machine learning?"',
      },
      {
        src: '/project/personalized_learning_app/screens/7_personal_learning_quiz3.png',
        caption: 'Quiz — "What does the term \'overfitting\' refer to in machine learning?"',
      },
      {
        src: '/project/personalized_learning_app/screens/8_personal_learning_result.png',
        caption: 'Results — the score, with the correct answer shown for every question',
      },
      {
        src: '/project/personalized_learning_app/screens/9_personal_learning_profile.png',
        caption: 'Profile — plan, running totals, and an AI summary of incorrect answers',
      },
      {
        src: '/project/personalized_learning_app/screens/10_personal_learning_quiz_history.png',
        caption: 'History — every past question with the answer given and the correct one',
      },
      {
        src: '/project/personalized_learning_app/screens/11_personal_learning_share.png',
        caption: "Share — quiz stats handed to Android's native share sheet",
      },
      {
        src: '/project/personalized_learning_app/screens/12_personal_learning_upgrade.png',
        caption: 'Upgrade — Starter, Intermediate and Advanced tiers',
      },
      {
        src: '/project/personalized_learning_app/screens/13_personal_learning_pay.png',
        caption: 'Payment — Google Pay checkout running against a test card',
      },
    ],
    demo: {
      src: '/project/personalized_learning_app/personal_learning_demo_video.mp4',
      poster: '/project/personalized_learning_app/personal_learning_demo_poster.jpg',
      // Already cropped to the device during encoding, so the crop here is the
      // identity — only cornerRadius does any work, rounding off the IDE
      // background that sits behind the emulator's rounded bezel.
      crop: {
        x: 0,
        y: 0,
        width: 424,
        height: 912,
        sourceWidth: 424,
        sourceHeight: 912,
        cornerRadius: 47,
      },
    },
    description:
      'A native Android app that delivers adaptive quizzes based on a student\'s selected tech interests, tracks performance over time, and simulates AI-generated question content and premium upgrades — built for Deakin SIT708 Mobile Application Development.',
    problem:
      "Generic quiz apps don't adapt to what a learner actually wants to study, and don't give students an easy way to review past performance or see where they're improving.",
    approach: [
      'Onboarding lets users register, log in, and pick up to 10 tech interests (Algorithms, Machine Learning, Cyber Security, Blockchain, etc.) that shape quiz content — simulating AI-driven quiz generation',
      'Every answered question is persisted to a SQLite history (topic, timestamp, selected vs. correct answer) powering a History page with full answer-option review',
      'Profile page computes live quiz statistics (total/correct/incorrect) and exports them as shareable text via the Android share sheet',
      'Mock Premium upgrade flow using the Google Play Services Wallet (Google Pay) API across 3 pricing tiers, with plan state persisted via SharedPreferences',
    ],
    architecture: [
      'Modern Android practice: single-Activity architecture with Fragments + Navigation, Material Design 3 components',
      'SQLite schema (SQLiteOpenHelper) with users and quiz_history tables, including per-user stats queries',
      'RecyclerView + custom adapters for the history list and per-question result review',
    ],
    results: [
      'Complete flow shipped: registration → interest selection → adaptive quiz → scoring → history → profile → upgrade',
      'Scaffolded for real LLM integration: quiz generation currently mocks prompts like "Create a quiz about Cybersecurity", with a roadmap for LLM-generated questions, answer explanations, and a conversational tutor',
      'Demonstrates payments UX via the Google Pay sandbox without a real billing backend',
    ],
  },
  {
    id: 'practicourse',
    title: 'Practicourse',
    kind: 'Full-Stack / Team Project',
    tagline: 'MERN-style online learning platform for practical, certificate-backed skill courses',
    tech: ['Node.js', 'Express', 'MongoDB', 'Mongoose', 'Socket.IO', 'Multer', 'bcrypt', 'Mocha/Chai/Supertest', 'Docker'],
    githubUrl: 'https://github.com/nicholassuganda/SIT725-Final-Project-Practicourse',
    // Landscape browser captures. Copies under shots/ are cropped to the window
    // (the originals bake the macOS drop shadow onto a white background, which
    // would read as a white slab on the dark theme) and downscaled to 2x the
    // max display width. Corners are rounded in CSS, not in the asset.
    screensLayout: 'center',
    screensFramed: false,
    screensAspect: '1720 / 1012',
    screens: [
      {
        src: '/project/practicourse/shots/1_practicourse_home1.jpg',
        caption: 'Home — hero carousel of featured courses',
      },
      {
        src: '/project/practicourse/shots/2_practicourse_home2.jpg',
        caption: 'Home — category sidebar alongside the featured slide',
      },
      {
        src: '/project/practicourse/shots/3_practicourse_login.jpg',
        caption: 'Login',
      },
      {
        src: '/project/practicourse/shots/4_practicourse_register.jpg',
        caption: 'Registration — account details, date of birth and gender',
      },
      {
        src: '/project/practicourse/shots/5_practicourse_about.jpg',
        caption: 'About — the mission and community sections',
      },
      {
        src: '/project/practicourse/shots/6_practicourse_course_browse.jpg',
        caption: 'Browse courses — priced listings with search and sort',
      },
      {
        src: '/project/practicourse/shots/7_practicourse_course_detail.jpg',
        caption: 'Course detail — preview video, rating and price',
      },
      {
        src: '/project/practicourse/shots/8_practicourse_mycourse.jpg',
        caption: 'My Courses — enrolled courses, payment history and course status',
      },
      {
        src: '/project/practicourse/shots/9_practicourse_profile.jpg',
        caption: 'Profile — personal details and bio',
      },
    ],
    description:
      'A full-stack online course platform delivering practical, hands-on courses with certification, built by a 4-person team over two sprints for Deakin SIT725 Applied Software Engineering. I built the frontend for the Register, Log-in, Course Detail, and Browse Courses pages, plus backend work on the My Profile page.',
    problem:
      'Existing online course platforms are often theory-heavy and language-limited. Practicourse targets the gap between theoretical knowledge and job-ready practical skills, with AI-generated multilingual subtitles as the planned differentiator to make courses accessible to non-native speakers.',
    approach: [
      'Built as a 4-person Agile team across two sprints (Aug–Sep 2024), managed via a Trello board with backlog-to-completed workflow columns',
      'I delivered the frontend for the Register, Log-in, Course Detail, and Browse Courses pages, and contributed backend work on the My Profile page',
      'User registration/login with bcrypt password hashing, and duplicate-account rejection via MongoDB unique indexes',
      'Course upload flow handling image and video files via Multer with mimetype filtering',
    ],
    architecture: [
      'Node.js + Express (ESM) REST API with MongoDB Atlas + Mongoose schemas for users and courses',
      'Socket.IO emitting live login-status updates to the navigation bar',
      'Vanilla HTML/CSS/JS frontend — one page script per view talking to the REST API via fetch',
      'Mocha/Chai/Supertest test suite with mongodb-memory-server, plus Docker/docker-compose (app + MongoDB + dedicated test service)',
    ],
    results: [
      'All 9 core pages shipped: Home, About, Browse Courses, Course Detail, Log-in, Register, My Courses, My Profile, NavBar',
      'Working course upload, listing, and detail retrieval with real file storage',
      'Automated test suite and containerised dev/test environments delivered alongside the app',
      'Full SRS document delivered covering functional and non-functional requirements',
    ],
  },
  {
    id: 'lost-and-found',
    title: 'Lost & Found App',
    kind: 'Android / Mobile',
    tagline: 'Map-based Android lost & found board with Google Maps, Places, and live device location',
    tech: ['Java', 'Android SDK', 'SQLite', 'Google Maps SDK', 'Google Places SDK', 'FusedLocationProviderClient'],
    githubUrl: 'https://github.com/pj-phongsin/SIT708/tree/master/Task%209.1P/Lost%20and%20Found%20App',
    videoUrl: 'https://youtu.be/IguHby5yChY',
    description:
      'A native Android app for posting and browsing local lost/found item adverts, delivered across two iterations: a base CRUD prototype, then a "commercial extension" adding location awareness with Google Maps and Places.',
    problem:
      "People who lose or find items have no lightweight way to post and browse local lost/found listings with real location context — text-only location fields don't convey where an item actually is spatially.",
    approach: [
      'Started as a CRUD prototype (create/list/detail/remove adverts with SQLite persistence), then extended with location features to reach "commercial" polish',
      'Integrated the Google Maps SDK to plot every stored item as a map marker (SupportMapFragment) with title/snippet, camera auto-centred on the first item',
      'Added Google Places Autocomplete for location entry on the create-advert form, returning both place name and coordinates',
      'Added device geolocation via FusedLocationProviderClient ("Get Current Location" button) with runtime permission handling for ACCESS_FINE_LOCATION',
    ],
    architecture: [
      'Multi-Activity Android architecture with Material Components and CardView-based listing UI',
      'SQLite schema migrated v1→v2 to add latitude/longitude columns supporting map markers without breaking existing CRUD',
      'Maps API key secured via local.properties + Gradle manifestPlaceholders rather than hardcoding — set up after discovering the Places API requires a billing-enabled Google Cloud project even for free-tier calls',
    ],
    results: [
      'Full advert lifecycle working: create (with autocomplete or GPS-filled location) → browse → detail → remove',
      'Every advert with coordinates renders as a live map marker — a small feature with outsized impact on perceived product polish',
      'Hands-on lessons in SQLite schema migration risk and secure cloud API key management, documented in the project reflection',
    ],
  },
  {
    id: 'chatbot-app',
    title: 'Llama 2 ChatBot App',
    kind: 'Android / LLM',
    tagline: 'Native Android chat client talking to a self-hosted Llama 2 model',
    tech: ['Java', 'Android SDK', 'RecyclerView', 'HttpURLConnection', 'Flask', 'Llama 2'],
    githubUrl: 'https://github.com/pj-phongsin/SIT708/tree/master/Task%208.1C/ChatBot%20App',
    videoUrl: 'https://youtu.be/CHFImyjgCdQ',
    description:
      'A native Android chat client that connects to a locally-hosted Llama 2 model through a custom Flask backend, letting a user hold a live text conversation with a locally-run open-weight LLM.',
    problem:
      'Demonstrates how to wire a mobile front end to a locally-run open-weight LLM rather than a hosted commercial API — a learning exercise in client/server architecture, background networking on Android, and chat UI patterns.',
    approach: [
      'Username-gated welcome screen passes the session into a RecyclerView-based chat thread with distinct bubble layouts for user vs. bot messages',
      'Each message POSTs to a local Flask server wrapping a locally-running Llama 2 instance, and the reply renders as a bot bubble',
      'Auto-scroll to the newest message keeps the conversation readable as it grows',
    ],
    architecture: [
      'Two-Activity app (Login → Chat) using AppCompat, Material, and ConstraintLayout — deliberately minimal dependencies',
      'Raw HttpURLConnection POST run on a background Thread with the result marshalled back via runOnUiThread — no networking library, keeping the UI responsive while awaiting model responses',
      'Emulator-to-host networking via the 10.0.2.2 loopback alias, with cleartext traffic scoped for local development',
    ],
    results: [
      'Working end-to-end chat loop against a self-hosted Llama 2 — ask "What is the capital of Australia?" and get a live model answer on-device',
      'Clean demonstration of background-threaded networking without blocking the Android UI thread',
    ],
  },
  {
    id: 'gpbl-iot',
    title: 'Global PBL in IoT Development',
    kind: 'Published Research — SEATUC',
    tagline: 'Designing and statistically evaluating a cross-border online IoT engineering program',
    tech: ['IoT', 'Raspberry Pi', 'Program Design', 'Statistical Evaluation', 'Zoom/Teams'],
    publication:
      'Global Project Based Learning in IoT System Development Based on Online Platform — SEATUC (South East Asia Technological University Consortium) Symposium (2021)',
    description:
      'Co-designed and evaluated an international online Project-Based Learning program pairing engineering students from Suranaree University of Technology (Thailand) and Shibaura Institute of Technology (Japan), run entirely online during COVID-19 and published at the SEATUC Symposium (2021).',
    problem:
      'Traditional classroom engineering education restricts students to textbook problems, leaving them unprepared for real-world work across diverse cultures and languages — and COVID-19 threatened to cancel the in-person international program that existed to close that gap.',
    approach: [
      'Structured mixed-nationality teams (every group included Thai and Japanese students) collaborating in English over Zoom and Microsoft Teams',
      'Teams built IoT prototypes solving real local problems at a university farm and hospital, including on-site field trips for requirements gathering from actual staff',
      'Foundational online coursework delivered first: microcontroller & sensor programming, networking & data communication, and data analysis',
      'Designed a 3-stage assessment framework — proposal, design-review, and final presentations, plus pre/post self-assessment and satisfaction surveys — to statistically evaluate learning outcomes',
    ],
    architecture: [
      'Program structure: coursework → team formation → field trips → prototype build → three milestone presentations, all coordinated across two countries and time zones',
      'Assessment instruments covering technical skill (IoT knowledge, programming), communication (English confidence, presentations), and collaboration (group work, problem-solving)',
    ],
    results: [
      'Statistically significant pre/post improvement across every measured skill category: IoT knowledge, English communication confidence, group work, presentation, and problem-solving',
      'Every team delivered a working IoT prototype addressing its assigned real-world problem',
      'Published at the SEATUC (South East Asia Technological University Consortium) Symposium, 2021 — evidence that community-connected international engineering education can survive a fully-online format',
    ],
  },
];

export const getProject = (id: string) => projects.find((project) => project.id === id);
