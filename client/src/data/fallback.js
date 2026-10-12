// Last-resort data used if the backend is unreachable on first load.
// Mirrors the data that used to live inside Projects.jsx / Experience.jsx.

export const fallbackProjects = [
  {
    _id: 'fallback-1',
    title: 'Vehicle Rental Services Platform',
    description: 'A comprehensive full-stack vehicle rental management system with multi-role authentication, real-time notifications, AI-powered chatbot, and integrated payment gateway for seamless rental operations.',
    longDescription: 'Vehicle Rental Services is a secure, enterprise-grade web platform for managing end-to-end vehicle rental operations. It offers role-based dashboards for Users, Vendors, and Admins, enabling seamless vehicle booking with real-time availability, fleet and earnings management, and system-wide analytics. The platform includes JWT authentication with email verification, Razorpay payments, an AI-powered chatbot, real-time notifications, SMS and email alerts, and advanced booking management with reports and exports. Enhanced security, responsive design, automated processes, and comprehensive transaction and refund tracking ensure a reliable and scalable rental solution.',
    emoji: '🚗',
    image: '',
    technologies: ['React 19.2.0', 'Node.js', 'Express.js', 'MongoDB', 'Mongoose', 'TailwindCSS', 'Vite', 'Socket.IO', 'JWT', 'Razorpay', 'Google Gemini AI', 'Cloudinary', 'Twilio', 'SendGrid', 'Nodemailer', 'React Router DOM', 'Zustand', 'React Hook Form', 'Axios', 'React Datepicker', 'React Toastify', 'Bcrypt.js', 'Helmet', 'Express Validator', 'Multer', 'PDFKit', 'CSV Writer', 'Node Cron', 'Morgan', 'Pino'],
    category: 'web',
    liveUrl: 'https://vrs-sg.vercel.app',
    githubUrl: 'https://github.com/Sahilgupta2175/vehicle-rental-services',
    featured: true
  },
  {
    _id: 'fallback-2',
    title: 'Zerodha - Stock Trading Platform',
    description: 'Full-stack stock trading platform replicating Zerodha\'s functionality with real-time portfolio management, order execution, and user authentication.',
    longDescription: 'Full-stack stock trading platform replicating Zerodha\'s functionality with real-time portfolio management, order execution, and user authentication. Features comprehensive dashboard for tracking holdings, positions, and market data with seamless buy/sell operations. Secure user authentication system with JWT tokens and cookie-based sessions.',
    emoji: '📈',
    image: '',
    technologies: ['React.js', 'Node.js', 'Express', 'MongoDB', 'JWT', 'Axios'],
    category: 'web',
    liveUrl: 'https://zerodha-sg.vercel.app/',
    githubUrl: 'https://github.com/Sahilgupta2175/Zerodha-project',
    featured: true
  },
  {
    _id: 'fallback-3',
    title: 'Wanderlust - Property Rental Platform',
    description: 'A full-stack property rental web application inspired by Airbnb with comprehensive property management and interactive maps.',
    longDescription: 'A full-stack property rental web application inspired by Airbnb, built with Node.js and Express.js. Features comprehensive property management, real-time search functionality, interactive maps with Mapbox, secure user authentication with Passport.js, and cloud-based image storage with Cloudinary. Implements MVC architecture with MongoDB.',
    emoji: '🏠',
    image: '',
    technologies: ['Node.js', 'Express.js', 'MongoDB', 'Passport.js', 'Mapbox', 'Cloudinary'],
    category: 'web',
    liveUrl: 'https://wanderlust-sg.vercel.app/',
    githubUrl: 'https://github.com/Sahilgupta2175/Wanderlust',
    featured: true
  },
  {
    _id: 'fallback-4',
    title: 'InShare - File Sharing Application',
    description: 'A secure file sharing web application that allows users to upload, share, and download files with temporary links.',
    longDescription: 'A secure file sharing web application that allows users to upload, share, and download files with temporary links. Built with Node.js and Express, featuring real-time file management, UUID-based encrypted link generation with temporary storage, and files auto-delete after 24 hours or first download.',
    emoji: '📁',
    image: '',
    technologies: ['Node.js', 'Express.js', 'MongoDB', 'Multer', 'UUID', 'Crypto'],
    category: 'web',
    liveUrl: 'https://inshare-sg.vercel.app/',
    githubUrl: 'https://github.com/Sahilgupta2175/inshare-project',
    featured: true
  },
  {
    _id: 'fallback-5',
    title: 'Netflix UI Clone',
    description: 'A pixel-perfect recreation of Netflix\'s homepage with dynamic content loading using TMDB API.',
    longDescription: 'A pixel-perfect recreation of Netflix\'s homepage with dynamic content loading. Features responsive design and smooth animations for an authentic user experience. Dynamic content loading using The Movie Database (TMDB) API with 95% visual accuracy.',
    emoji: '🎬',
    image: '',
    technologies: ['HTML5', 'CSS3', 'JavaScript', 'TMDB API'],
    category: 'web',
    liveUrl: 'https://netflix-clone-ft.vercel.app/',
    githubUrl: 'https://github.com/Sahilgupta2175/Hunar-intern-project/tree/main/Netflix%20clone',
    featured: false
  }
];

// Shown until the admin saves an About document (and if the API is down).
// Snapshot of the live DB, Oct 2026.
export const fallbackAbout = {
  title: 'Crafting Solutions\nThrough Code',
  paragraphs: [
    "I'm a passionate software engineer and full-stack MERN developer who loves to turn ideas into scalable, user-centric applications. I have hands-on experience in building modern web solutions using React, Node.js, Express.js, MongoDB, following clean architecture and best development practices. My experience in the Cognizant Healthcare Product Consulting (HPC) program has given me hands-on exposure to SQL, PL/SQL, U.S. healthcare payer systems and TriZetto Facets, and has helped me to further develop my skills in working with enterprise software in domain-driven environments. I enjoy tackling complex technical problems, constantly learning, and building reliable applications that deliver business value."
  ],
  highlights: [
    { label: 'Location', value: 'Orai, UP, India' },
    { label: 'Education', value: 'B.Tech CSE' }
  ],
  badgeNumber: '150+',
  badgeText: 'Problems\nSolved'
};

export const fallbackExperience = [
  {
    _id: 'fallback-exp-1',
    role: 'Programmer Analyst Trainee',
    company: 'Cognizant',
    location: 'Bangalore',
    period: 'July 2026 - Present',
    employmentType: 'Full-time',
    description: "Transitioned from Cognizant's Healthcare Product Consulting (HPC) training to a full-time role, applying SQL, healthcare domain and Facets knowledge on real-world U.S. healthcare payer projects.",
    achievements: [
      'Moved from structured HPC training to a live U.S. healthcare project after completing advanced Facets learning.'
    ],
    technologies: ['Facets (TriZetto)'],
    logo: ''
  },
  {
    _id: 'fallback-exp-2',
    role: 'Program Analyst Trainee',
    company: 'Cognizant',
    location: 'Chennai',
    period: 'Mar 2026 - Jun 2026',
    employmentType: 'Internship',
    description: 'Multi-phase training under the Healthcare Product Consulting (HPC) track: MySQL and PL/SQL, U.S. healthcare payer operations, and TriZetto Facets.',
    achievements: [
      "Completed Cognizant's HPC training in SQL/PL-SQL, U.S. healthcare payer operations and TriZetto Facets."
    ],
    technologies: ['SQL', 'MySQL', 'PL/SQL', 'Facets (TriZetto)'],
    logo: ''
  },
  {
    _id: 'fallback-exp-3',
    role: 'Trainee - Job Oriented Value Added Course',
    company: 'GLA University',
    location: 'Remote',
    period: 'Jun 2024 - Jul 2024',
    employmentType: 'Internship',
    description: 'Intensive training program focused on practical industry skills: PostgreSQL, database design and SQL queries.',
    achievements: [],
    technologies: ['PostgreSQL', 'SQL'],
    logo: ''
  }
];

export const fallbackBlogs = [];
