// Personal details that aren't stored in the admin DB. Edit here, not in components.
export const profile = {
  name: 'Sahil Gupta',
  email: 'guptasahil2175@gmail.com',
  phone: '+91 9956564108',
  location: 'Orai, Uttar Pradesh, IN',
  timeZone: 'Asia/Kolkata',
  resumeUrl: '/resume/Sahil_Resume_offline_resume.pdf',
  photo: '/Sahil_Photo.jpg',
  // Team shown next to the current full-time role from the admin DB.
  // Update this if the role in Admin › Experience changes.
  team: 'Americas HPC',
  socials: [
    { label: 'GitHub', url: 'https://github.com/Sahilgupta2175' },
    { label: 'LinkedIn', url: 'https://linkedin.com/in/sahilgupta2175' },
    { label: 'Email', url: 'mailto:guptasahil2175@gmail.com' }
  ]
};

export const stats = { cgpa: 7.72, successRate: 85 };

export const stack = [
  'React', 'Node.js', 'Express', 'MongoDB', 'Mongoose', 'JavaScript', 'Java',
  'PostgreSQL', 'MySQL', 'PL/SQL', 'REST APIs', 'Passport.js', 'Socket.IO',
  'Git', 'Postman', 'Vercel', 'Cloudinary'
];

export const education = [
  {
    title: 'B.Tech (Hons), Computer Science',
    field: 'Graduated June 2026',
    institution: 'GLA University, Mathura',
    period: 'Jun 2026',
    score: '77.2%'
  },
  {
    title: 'Senior Secondary (12th)',
    field: 'Science Stream',
    institution: 'Brij Kunwar Devi Aldrich Public School, Orai',
    period: 'May 2022',
    score: '84.2%'
  }
];

export const extras = {
  certifications: ['LeetCode 150+ Problems', 'HackerRank Certified', 'PostgreSQL Training'],
  languages: ['English · Fluent', 'Hindi · Native']
};
