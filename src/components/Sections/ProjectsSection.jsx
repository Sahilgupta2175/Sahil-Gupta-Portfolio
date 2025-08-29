import React from "react";
import { ExternalLink, Github } from "lucide-react";
import { Button } from "../ui/button";

const ProjectsSection = () => {
  const projects = [
    {
      title: "Zerodha - Stock Trading Platform",
      description:
        "Full-stack stock trading platform replicating Zerodha's functionality with real-time portfolio management, order execution, and user authentication. Features comprehensive dashboard for tracking holdings, positions, and market data with seamless buy/sell operations.",
      technologies: [
        "CSS3",
        "React.js",
        "Vite",
        "Axios",
        "Node.js",
        "Express",
        "RESTful APIs",
        "MongoDB",
        "Mongoose",
        "JWT Authentication"
      ],
      features: [
        "Secure user authentication system with JWT tokens and cookie-based sessions, supporting 100% secure login/logout functionality across multiple browser sessions",
        "Real-time portfolio management dashboard tracking 13+ holdings with live P&L calculations, displaying ₹31.43k current value and +5.20% profit metrics",
        "Interactive trading interface enabling seamless buy/sell order execution with instant portfolio updates and margin calculations (₹3.74k available margin)",
        "Comprehensive RESTful API architecture with 8+ endpoints handling user data, orders, holdings, and positions with <2s response time and proper error handling",
      ],
      liveUrl: "https://zerodha-sg.vercel.app", 
      githubUrl: "https://github.com/Sahilgupta2175/Zerodha-project",
      period: "Jul - Aug 2025",
    },
    // Other projects remain the same
    {
      title: "Wanderlust - Property Rental Platform",
      description: "A full-stack property rental web application inspired by Airbnb, built with Node.js and Express.js. Features comprehensive property management, real-time search functionality, interactive maps, secure user authentication, and cloud-based image storage. Implements MVC architecture with MongoDB for scalable data management and responsive frontend design.",
      technologies: [
        "HTML5",
        "CSS3",
        "Bootstrap",
        "JavaScript",
        "EJS Templating",
        "Node.js",
        "Express.js",
        "Multer",
        "Flash Messages",
        "Session Management",
        "Passport.js",
        "Joi Validation",
        "MongoDB",
        "Mongoose ODM",
        "Cloudinary API",
        "Mapbox API"
      ],
      features: [
        "Implemented intelligent search and instant filtering using MongoDB regex queries across multiple fields, achieving <200ms response time for 100+ property listings.",
        "Integrated Mapbox Geocoding API for interactive maps with precise markers, delivering 99% accuracy across 50+ cities.",
        "Built a secure authentication & authorization system with Passport.js, bcrypt, session management, custom middleware, and Joi validation ensuring 100% access security.  ",
        "Developed a scalable image upload pipeline using Cloudinary & Multer with automatic optimization, CDN delivery, and 70% faster load times for 10+ images per property."
      ],
      liveUrl: "https://wanderlust-nlnm.onrender.com/",
      githubUrl: "https://github.com/Sahilgupta2175/Wanderlust",
      period: "May - Jul 2025"
    },
    {
      title: "InShare Application",
      description: "A secure file sharing web application that allows users to upload, share, and download files with temporary links. Built with Node.js and Express, featuring real-time file management and secure file transfer capabilities.",
      technologies: [
        "HTML5",
        "CSS3",
        "JavaScript",
        "Node.js",
        "Express.js",
        "Multer",
        "MongoDB / File System",
        "UUID",
        "Path",
        "Crypto"
      ],
      features: [
        "Built a secure file upload system supporting multiple formats up to 100MB with real-time progress tracking (95% accuracy).",
        "Implemented UUID-based encrypted link generation with temporary storage; files auto-delete after 24 hours or first download.", 
        "Developed responsive file management dashboard for viewing, organizing, and managing uploads across devices.",
        "Integrated usage analytics to track sharing metrics and download statistics, enabling data-driven insights.",
        "Ensured high security & performance with input validation, file type restrictions, and fast uploads at 2–5MB/s.",
      ],
      liveUrl: "https://inshare-sg.vercel.app/",
      githubUrl: "https://github.com/Sahilgupta2175/inshare-project",
      period: "Mar - Apr 2025",
    },
    {
      title: "Netflix UI Clone",
      description:
        "A pixel-perfect recreation of Netflix's homepage with dynamic content loading. Features responsive design and smooth animations for an authentic user experience.",
      technologies: [
        "HTML5", 
        "CSS3", 
        "JavaScript", 
        "TMDB API"
      ],
      features: [
        "Recreated Netflix's homepage UI with 95% visual accuracy",
        "Dynamic content loading using The Movie Database (TMDB) API",
        "Fully responsive design optimized for mobile, tablet, and desktop",
        "Lightning-fast authentication flows with 300ms response times",
      ],
      liveUrl: "https://netflix-clone-ft.vercel.app/",
      githubUrl:
        "https://github.com/Sahilgupta2175/Hunar-intern-project/tree/main/Netflix%20clone",
      period: "Jun - Jul 2024",
    },
  ];

  return (
    <section id="projects" className="py-12 sm:py-16 lg:py-20 w-full">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <div className="inline-flex items-center space-x-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4">
            <span>🚀 Featured Work</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 px-2">
            Projects That Showcase My Skills
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4">
            A collection of projects that demonstrate my ability to build
            scalable, user-friendly applications using modern web technologies.
          </p>
        </div>

        <div className="space-y-8 sm:space-y-12">
          {projects.map((project, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700"
            >
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                  <h3 className="text-xl lg:text-2xl font-bold mb-2 sm:mb-0">
                    {project.title}
                  </h3>
                  <span className="text-sm bg-white/20 px-3 py-1 rounded-full w-fit">
                    {project.period}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-3 py-1 bg-white/20 rounded-md text-sm font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6">
                <p className="text-base text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  {project.description}
                </p>

                <div className="space-y-3 mb-6">
                  {project.features.map((feature, featureIndex) => (
                    <div
                      key={featureIndex}
                      className="flex items-start space-x-3"
                    >
                      <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0 mt-2"></div>
                      <span className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
{/*  */}
                <div className="flex flex-col sm:flex-row gap-3">
                  {project.liveUrl && (
                    <Button
                      asChild
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Live Demo
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </a>
                    </Button>
                  )}
                  <Button asChild variant="outline">
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Code
                      <Github className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
