import React from "react";
import { Code, Database, Palette, Settings } from "lucide-react";

const SkillsSection = () => {
  const skills = [
    {
      category: "Frontend Development",
      icon: <Palette className="w-6 h-6" />,
      technologies: ["React.js", "HTML5", "CSS3", "JavaScript", "Responsive Design", "UI/UX"],
    },
    {
      category: "Backend Development",
      icon: <Settings className="w-6 h-6" />,
      technologies: ["Node.js", "Express.js", "Java", "RESTful APIs", "Authentication", "Server Architecture"],
    },
    {
      category: "Database & Analytics",
      icon: <Database className="w-6 h-6" />,
      technologies: ["MongoDB", "MySQL", "PostgreSQL", "SQL", "Power BI", "Data Modeling"],
    },
    {
      category: "Tools & Platforms",
      icon: <Code className="w-6 h-6" />,
      technologies: ["Git", "GitHub", "Postman", "VS Code", "Vercel", "Deployment"],
    },
  ];

  return (
    <section id="skills" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <span>🛠️ Technical Skills</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Technologies I Work With</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            A comprehensive toolkit for building modern, scalable web applications from frontend to backend and
            everything in between.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {skills.map((skill, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white">
                  {skill.icon}
                </div>
                <h3 className="font-bold text-lg">{skill.category}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {skill.technologies.map((tech, techIndex) => (
                  <span
                    key={techIndex}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-colors cursor-default"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
