import React from "react";
import { Mail, Linkedin, Github, ChevronDown, Download, Eye } from "lucide-react";
import { Button } from "../ui/button";

const HeroSection = ({ scrollToSection }) => {
  return (
    <section id="home" className="pt-16 sm:pt-20 min-h-screen flex items-center w-full">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center space-x-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-4 py-2 rounded-full text-sm font-medium">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Available for new opportunities</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Building Digital
                <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Experiences
                </span>
                That Matter
              </h1>
              <h2 className="text-lg sm:text-xl text-blue-600 dark:text-blue-400 font-semibold">
                Full Stack Developer & Problem Solver
              </h2>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
                I create scalable web applications using modern technologies. Passionate about clean code, user
                experience, and solving complex problems through innovative solutions.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                onClick={() => scrollToSection("projects")}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white w-full sm:w-auto transition-all duration-300"
              >
                View My Work
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => scrollToSection("contact")} 
                className="w-full sm:w-auto border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20"
              >
                Get In Touch
                <Mail className="w-4 h-4 ml-2" />
              </Button>
              <div className="relative group">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white w-full sm:w-auto transition-all duration-300"
                  asChild
                >
                  <a 
                    href="/resume/Sahil Gupta Resume.pdf" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Resume
                  </a>
                </Button>

                <div className="absolute top-full left-0 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                  <a 
                    href="/resume/Sahil Gupta Resume.pdf" 
                    download="Sahil_Gupta_Resume.pdf"
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 whitespace-nowrap"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </a>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">150+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Problems Solved</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">7.46</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">CGPA</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">85%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Success Rate</div>
              </div>
            </div>
          </div>

          <div className="relative order-first lg:order-last">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-2xl border border-gray-200 dark:border-gray-700">
              <div className="text-center space-y-4 sm:space-y-6">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white overflow-hidden mx-auto">
                  <img 
                    src="/Sahil Photo.jpg" 
                    alt="Sahil Gupta" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold">Sahil Gupta</h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Full Stack Developer</p>
                </div>
                <div className="flex justify-center space-x-3 sm:space-x-4">
                  <a
                    href="mailto:guptasahil2175@gmail.com"
                    aria-label="Email"
                    className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-colors touch-friendly"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                  <a
                    href="https://linkedin.com/in/sahilgupta2175"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-colors touch-friendly"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a
                    href="https://github.com/Sahilgupta2175"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                    className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-colors touch-friendly"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
