# 🚀 Sahil Gupta - Personal Portfolio

A modern, responsive personal portfolio website built with React, Vite, and Tailwind CSS. Features a contact form with EmailJS integration and auto-reply functionality.

## ✨ Features

- **Modern Design** - Clean, professional UI with dark/light theme support
- **Responsive Layout** - Optimized for all devices (mobile, tablet, desktop)
- **Contact Form** - Integrated with EmailJS for real email sending
- **Auto-Reply** - Automatic confirmation emails to visitors
- **Smooth Animations** - Engaging user interactions and transitions
- **Component-Based** - Modular React architecture for easy maintenance
- **Fast Performance** - Built with Vite for lightning-fast development and builds

## 🛠️ Built With

- **React 18** - Modern React with hooks
- **Vite** - Next-generation frontend tooling
- **Tailwind CSS** - Utility-first CSS framework
- **EmailJS** - Email service integration
- **Lucide React** - Beautiful, customizable icons
- **ESLint** - Code linting and formatting

## 🏗️ Project Structure

```
src/
├── components/
│   ├── Layout/
│   │   ├── Navigation.jsx    # Main navigation component
│   │   └── Footer.jsx        # Footer component
│   ├── Sections/
│   │   ├── HeroSection.jsx      # Landing/hero section
│   │   ├── AboutSection.jsx     # About me section
│   │   ├── SkillsSection.jsx    # Technical skills
│   │   ├── ProjectsSection.jsx  # Project showcase
│   │   ├── ExperienceSection.jsx # Education & experience
│   │   └── ContactSection.jsx   # Contact form
│   └── ui/
│       └── button.jsx        # Reusable button component
├── hooks/
│   ├── useTheme.js          # Theme management hook
│   └── useNavigation.js     # Navigation logic hook
├── utils/
│   └── emailjs.js           # EmailJS integration utilities
├── lib/
│   └── utils.js             # Utility functions
├── App.jsx                  # Main app component
└── main.jsx                 # App entry point
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Sahilgupta2175/Sahil-Gupta-Portfolio.git
   cd Sahil-Gupta-Portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your EmailJS credentials:
   ```env
   VITE_EMAILJS_SERVICE_ID=your_service_id
   VITE_EMAILJS_TEMPLATE_ID=your_template_id
   VITE_EMAILJS_AUTO_REPLY_TEMPLATE_ID=your_auto_reply_template_id
   VITE_EMAILJS_PUBLIC_KEY=your_public_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser** and navigate to `http://localhost:5173`

## 📧 EmailJS Setup

For the contact form to work, you need to set up EmailJS:

1. Create an account at [EmailJS](https://www.emailjs.com/)
2. Set up an email service (Gmail, Outlook, etc.)
3. Create two email templates (main contact form + auto-reply)
4. Get your credentials and update the `.env` file

See `EMAILJS_SETUP.md` for detailed instructions.

## 🎨 Customization

### Personal Information
Update your personal details in:
- `src/components/Sections/HeroSection.jsx` - Name, title, stats
- `src/components/Sections/AboutSection.jsx` - Bio and contact info
- `src/components/Sections/SkillsSection.jsx` - Technical skills
- `src/components/Sections/ProjectsSection.jsx` - Your projects
- `src/components/Sections/ExperienceSection.jsx` - Education and work history

### Styling
- Edit `src/index.css` for global styles
- Modify Tailwind classes in components for design changes
- Update `tailwind.config.js` for theme customization

### Contact Information
Update email addresses and social links in:
- `src/utils/emailjs.js` - Auto-reply sender info
- Contact section components - Social media links

## 📱 Responsive Design

The portfolio is fully responsive with breakpoints for:
- **Mobile** - 320px to 768px
- **Tablet** - 768px to 1024px
- **Desktop** - 1024px and above

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Netlify
1. Build the project: `npm run build`
2. Upload the `dist` folder to Netlify
3. Set up environment variables
4. Configure redirects if needed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Contact

**Sahil Gupta**
- Email: guptasahil2175@gmail.com
- LinkedIn: [sahilgupta2175](https://linkedin.com/in/sahilgupta2175)
- GitHub: [Sahilgupta2175](https://github.com/Sahilgupta2175)

---

⭐ Star this repository if you found it helpful!
