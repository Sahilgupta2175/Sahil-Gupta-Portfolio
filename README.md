# 🚀 Modern Portfolio - MERN Stack

A stunning, professional portfolio website built with the MERN stack featuring modern UI/UX design, smooth animations, and a responsive layout.

![Portfolio Preview](https://via.placeholder.com/1200x600/0a0a0f/6366f1?text=Portfolio+Preview)

## ✨ Features

- **Modern Design** - Clean, professional UI with glass morphism effects
- **Smooth Animations** - Framer Motion powered animations throughout
- **Custom Cursor** - Interactive cursor that responds to hover states
- **Responsive Layout** - Perfect display on all devices
- **Dark Theme** - Elegant dark color scheme with gradient accents
- **Contact Form** - Functional contact form with MongoDB storage
- **Loading Animation** - Beautiful loader with progress indicator
- **Section Transitions** - Scroll-triggered animations using Intersection Observer

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI Library
- **Framer Motion** - Animation library
- **React Router** - Client-side routing
- **React Scroll** - Smooth scrolling
- **React Type Animation** - Typing effect
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM

## 📁 Project Structure

```
Portfolio/
├── client/                    # React frontend
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── components/
│       │   ├── About/
│       │   ├── Contact/
│       │   ├── Cursor/
│       │   ├── Experience/
│       │   ├── Footer/
│       │   ├── Hero/
│       │   ├── Loader/
│       │   ├── Navbar/
│       │   ├── Projects/
│       │   └── Skills/
│       ├── App.js
│       ├── App.css
│       ├── index.js
│       └── index.css
├── server/                    # Express backend
│   ├── models/
│   │   ├── Contact.js
│   │   └── Project.js
│   ├── routes/
│   │   ├── contact.js
│   │   └── projects.js
│   └── index.js
├── .env
├── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/portfolio.git
   cd portfolio
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   npm install

   # Install client dependencies
   cd client
   npm install
   cd ..
   ```

   Or use the shorthand:
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/portfolio
   PORT=5000
   ```

4. **Start MongoDB**
   
   Make sure MongoDB is running on your system.

5. **Run the application**
   
   ```bash
   # Run both client and server
   npm run dev
   
   # Or run separately:
   npm run server  # Backend on port 5000
   npm run client  # Frontend on port 3000
   ```

6. **Open in browser**
   
   Navigate to `http://localhost:3000`

## 🎨 Customization

### Personal Information

Update the following files with your information:

- `client/src/components/Hero/Hero.jsx` - Name, title, social links
- `client/src/components/About/About.jsx` - Bio, highlights
- `client/src/components/Experience/Experience.jsx` - Work history
- `client/src/components/Projects/Projects.jsx` - Your projects
- `client/src/components/Contact/Contact.jsx` - Contact details
- `client/public/index.html` - Page title and meta

### Color Scheme

Modify CSS variables in `client/src/index.css`:

```css
:root {
  --primary: #6366f1;        /* Primary color */
  --secondary: #f472b6;      /* Secondary color */
  --accent: #22d3ee;         /* Accent color */
  --bg-primary: #0a0a0f;     /* Main background */
  --bg-secondary: #12121a;   /* Secondary background */
}
```

### Fonts

The portfolio uses:
- **Inter** - Primary font
- **Space Grotesk** - Display font

To change fonts, update the Google Fonts link in `client/public/index.html`.

## 📱 Responsive Breakpoints

- **Desktop**: 1200px+
- **Tablet**: 768px - 1199px
- **Mobile**: < 768px

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Run both frontend and backend |
| `npm run server` | Run backend only |
| `npm run client` | Run frontend only |
| `npm start` | Start production server |

## 📝 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/projects` | Get all projects |
| GET | `/api/projects/:id` | Get single project |
| POST | `/api/projects` | Create project |
| POST | `/api/contact` | Submit contact form |

## 🚀 Deployment

### Frontend (Vercel/Netlify)

1. Build the client:
   ```bash
   cd client
   npm run build
   ```

2. Deploy the `build` folder to Vercel or Netlify.

### Backend (Heroku/Railway)

1. Set environment variables on your hosting platform.
2. Deploy the server folder.

### Full Stack (Render)

1. Create a new Web Service.
2. Set build command: `npm install && cd client && npm install && npm run build`
3. Set start command: `npm start`

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contact

**Sahil Gupta**
- Website: [sahilgupta.dev](https://sahilgupta.dev)
- Email: hello@sahilgupta.dev
- LinkedIn: [sahilgupta](https://linkedin.com/in/sahilgupta)
- GitHub: [sahilgupta](https://github.com/sahilgupta)

---

⭐ If you found this helpful, please give it a star!
