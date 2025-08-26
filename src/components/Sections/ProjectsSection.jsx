import React from "react";
import { ExternalLink, Github } from "lucide-react";
import { Button } from "../ui/button";

const ProjectsSection = () => {
  const projects = [
    {
      title: "Wanderlust",
      description:
        "A comprehensive accommodation booking platform that connects travelers with unique stays. Features complete user authentication, property listings, and advanced search capabilities.",
      technologies: ["React.js", "Node.js", "Express.js", "MongoDB", "Mongoose"],
      features: [
        "Full-stack accommodation booking platform with secure user authentication",
        "Advanced search and filter system increasing user session time by 60%",
        "Responsive React UI ensuring seamless cross-device compatibility",
        "Optimized backend APIs with 30% faster response times",
      ],
      liveUrl: "https://wanderlust-nlnm.onrender.com/",
      githubUrl: "https://github.com/Sahilgupta2175/Wanderlust",
      period: "May - July 2025",
    },
    {
      title: "InShare Application",
      description:
        "A secure file sharing platform designed for seamless document exchange. Supports large file uploads with real-time progress tracking and email notifications.",
      technologies: ["Node.js", "Express.js", "MongoDB", "Multer", "Nodemailer"],
      features: [
        "Secure file sharing platform supporting 100MB+ uploads for 2000+ users",
        "Intuitive drag-and-drop interface with real-time progress tracking",
        "Automated email notifications accelerating file retrieval by 75%",
        "Frontend optimizations reducing average file access time by 40%",
      ],
      liveUrl: "https://inshare-sg.vercel.app/",
      githubUrl: "https://github.com/Sahilgupta2175/InShare-Application-Project",
      period: "Mar - Apr 2025",
    },
    {
      title: "Netflix UI Clone",
      description:
        "A pixel-perfect recreation of Netflix's homepage with dynamic content loading. Features responsive design and smooth animations for an authentic user experience.",
      technologies: ["HTML5", "CSS3", "JavaScript", "TMDB API"],
      features: [
        "Recreated Netflix's homepage UI with 95% visual accuracy",
        "Dynamic content loading using The Movie Database (TMDB) API",
        "Fully responsive design optimized for mobile, tablet, and desktop",
        "Lightning-fast authentication flows with 300ms response times",
      ],
      liveUrl: "https://netflix-clone-ft.vercel.app/",
      githubUrl: "https://github.com/Sahilgupta2175/Hunar-intern-project/tree/main/Netflix%20clone",
      period: "Jun - Jul 2024",
    },
  ];

  return (
    <section id="projects" className="py-20 bg-gray-50 dark:bg-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <span>🚀 Featured Work</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Projects That Showcase My Skills</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            A collection of projects that demonstrate my ability to build scalable, user-friendly applications using
            modern web technologies.
          </p>
        </div>

        <div className="space-y-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-2xl transition-all duration-300"
            >
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                  <h3 className="text-2xl font-bold mb-2 sm:mb-0">{project.title}</h3>
                  <span className="text-sm bg-white/20 px-3 py-1 rounded-full">{project.period}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, techIndex) => (
                    <span key={techIndex} className="px-3 py-1 bg-white/20 rounded-lg text-sm font-medium">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-6">
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">{project.description}</p>

                <div className="mb-6">
                  <ul className="space-y-2">
                    {project.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-3">
                        <div className="w-5 h-5 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full"></div>
                        </div>
                        <span className="text-gray-600 dark:text-gray-300 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  {project.liveUrl && (
                    <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto">
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                        Live Demo
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </a>
                    </Button>
                  )}
                  <Button asChild variant="outline" className="w-full sm:w-auto">
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
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
