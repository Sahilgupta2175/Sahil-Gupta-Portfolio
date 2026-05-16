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
    liveUrl: 'https://vrs-frontend-sg.vercel.app',
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

export const fallbackExperience = [
  {
    _id: 'fallback-exp-1',
    role: 'Trainee - Job Oriented Value Added Course',
    company: 'GLA University',
    location: 'Remote',
    period: 'Jun 2024 - Jul 2024',
    description: 'Intensive training program focused on practical industry skills and database management.',
    achievements: [
      'Gained hands-on experience with PostgreSQL through instructor-led sessions',
      'Achieved Top 3 Performer status among 50 interns in the summer cohort',
      'Developed practical skills in database design and SQL queries'
    ],
    technologies: ['PostgreSQL', 'SQL', 'Database Design'],
    logo: ''
  }
];

export const fallbackBlogs = [];
