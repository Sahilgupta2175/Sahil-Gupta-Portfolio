import React from "react";

const EducationSection = () => {
    return (
        <section id="education" className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center space-x-2 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 px-4 py-2 rounded-full text-sm font-medium mb-4">
                        <span>📚 Education</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">My Academic Background</h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        My academic journey and educational foundation in computer science.
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
                            <h3 className="text-xl font-bold">Senior Secondary Education</h3>
                            <span className="text-sm text-gray-500 dark:text-gray-400">May 2022</span>
                        </div>
                        <p className="text-blue-600 dark:text-blue-400 font-semibold mb-2">
                            Brij Kunwar Devi Aldrich Public School, Orai • 84.2%
                        </p>
                        <p className="text-gray-600 dark:text-gray-300">
                            Built a strong foundation in mathematics and science.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default EducationSection;
