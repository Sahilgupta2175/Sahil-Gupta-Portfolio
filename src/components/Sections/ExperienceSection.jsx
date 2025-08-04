import React from "react";

const ExperienceSection = () => {
  return (
    <section id="experience" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <span>📚 Experience & Education</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">My Journey in Technology</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            From academic excellence to hands-on industry experience, here's how I've built my foundation in computer
            science and software development.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
              <h3 className="text-xl font-bold">Bachelor of Technology - Computer Science (Honors)</h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">Expected Jun 2026</span>
            </div>
            <p className="text-blue-600 dark:text-blue-400 font-semibold mb-2">
              GLA University, Mathura • CGPA: 7.46
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Pursuing comprehensive education in computer science with specialized focus on software development,
              data structures, algorithms, and modern web technologies.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
              <h3 className="text-xl font-bold">Trainee - Job Oriented Value Added Course</h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">Jun 2024 - Jul 2024</span>
            </div>
            <p className="text-blue-600 dark:text-blue-400 font-semibold mb-3">GLA University • Remote</p>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Intensive training program focused on practical industry skills and database management.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start space-x-3">
                <div className="w-1.5 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-600 dark:text-gray-300 text-sm">
                  Gained hands-on experience with PostgreSQL through instructor-led sessions
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-1.5 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-600 dark:text-gray-300 text-sm">
                  Achieved Top 3 Performer status among 50 interns in the summer cohort
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
              <h3 className="text-xl font-bold">Senior Secondary Education</h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">May 2022</span>
            </div>
            <p className="text-blue-600 dark:text-blue-400 font-semibold mb-2">
              Brij Kunwar Devi Aldrich Public School, Orai • 84.2%
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Built a strong foundation in mathematics, science, and computer applications.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
