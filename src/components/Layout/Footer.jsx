import React from "react";

const Footer = ({ scrollToSection, navItems }) => {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white py-8 sm:py-12 w-full">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-4 sm:mb-6">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm sm:text-lg">
              SG
            </div>
            <span className="text-lg sm:text-xl font-bold">Sahil Gupta</span>
          </div>
          <p className="text-gray-400 mb-6 sm:mb-8 max-w-2xl mx-auto text-sm sm:text-base px-4">
            Building digital experiences that make a difference. Always learning, always growing, always coding.
          </p>
          
          {/* Mobile-optimized navigation */}
          <div className="mb-6 sm:mb-8">
            {/* Mobile: Grid layout for smaller screens */}
            <div className="grid grid-cols-2 gap-3 sm:hidden max-w-xs mx-auto">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-gray-400 hover:text-white transition-colors text-sm py-2 px-3 rounded-md hover:bg-gray-800 text-center"
                >
                  {item.label}
                </button>
              ))}
            </div>
            
            {/* Tablet and larger: Horizontal layout */}
            <div className="hidden sm:flex justify-center flex-wrap gap-4 lg:gap-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base py-2 px-3 rounded-md hover:bg-gray-800"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-6 sm:pt-8">
            <p className="text-gray-500 text-xs sm:text-sm px-4">
              &copy; 2025 Sahil Gupta. All rights reserved. Built with ❤️ and lots of ☕
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
