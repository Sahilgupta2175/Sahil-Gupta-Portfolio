import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";

const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-gray-50 dark:bg-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <span>👨‍💻 About Me</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Crafting Solutions Through Code</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            A passionate developer with a strong foundation in computer science and a keen eye for creating
            exceptional digital experiences.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-3 max-w-3xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>
                  I'm a passionate full-stack developer currently pursuing my Bachelor of Technology in Computer
                  Science (Honors) at GLA University, Mathura. With a strong foundation in modern web technologies and
                  a keen eye for user experience, I love creating applications that solve real-world problems.
                </p>
                <p>
                  My journey in tech has been driven by curiosity and a constant desire to learn. I've completed over
                  150 coding challenges on platforms like LeetCode and HackerRank, maintaining an 85% success rate.
                  This has helped me develop strong problem-solving skills and a deep understanding of data structures
                  and algorithms.
                </p>
                <p>
                  When I'm not coding, you'll find me exploring new technologies, contributing to open-source
                  projects, or mentoring fellow students. I believe in the power of collaboration and continuous
                  learning in the ever-evolving world of technology.
                </p>
              </div>
            </div>
          </div>

          {/* <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                SG
              </div>
              <h3 className="text-xl font-bold">Sahil Gupta</h3>
              <p className="text-gray-600 dark:text-gray-400">Computer Science Student</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">GLA University, Mathura</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3">
                <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="text-sm">guptasahil2175@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3 p-3">
                <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="text-sm">+91 9956564108</span>
              </div>
              <div className="flex items-center space-x-3 p-3">
                <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="text-sm">Orai, Uttar Pradesh, India</span>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
