import React from "react";

const Footer = ({ scrollToSection, navItems }) => {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12 w-full">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              SG
            </div>
            <span className="text-xl font-bold">Sahil Gupta</span>
          </div>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Building digital experiences that make a difference. Always learning, always growing, always coding.
          </p>
          <div className="flex justify-center space-x-8 mb-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="border-t border-gray-800 pt-8">
            <p className="text-gray-500">&copy; 2025 Sahil Gupta. All rights reserved. Built with ❤️ and lots of ☕</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
