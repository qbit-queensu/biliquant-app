# BiliQuant App

A web application for the BiliQuant project by Queen's Biomedical Innovation Team (QBiT) - a low-cost, non-invasive bilirubinometer for detecting neonatal jaundice in under-resourced settings.

## 🎯 Project Overview

BiliQuant is developing an accessible medical device to combat neonatal jaundice. This web application serves as:
- An educational platform about neonatal jaundice
- A test entry system for medical professionals
- Information hub about QBiT and the BiliQuant mission

## 🚀 Tech Stack

- **Framework**: React 18.3.1
- **Build Tool**: Vite 7.2.2
- **Routing**: React Router DOM 6.26.2
- **Styling**: CSS Modules
- **Linting**: ESLint 9.39.1

## 📋 Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn package manager

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/your-org/biliquant-app.git
cd biliquant-app/bili-app
```

2. Install dependencies:
```bash
npm install
```

## 🏃‍♂️ Running the Application

### Development Mode
```bash
npm run dev
```
The app will be available at `http://localhost:5173` (or another port if 5173 is in use).

### Production Build
```bash
npm run build
```
This creates an optimized production build in the `dist` folder.

### Preview Production Build
```bash
npm run preview
```

### Linting
```bash
npm run lint
```

## 📁 Project Structure

```
bili-app/
├── public/              # Static assets
├── src/
│   ├── assets/         # Images, icons, etc.
│   ├── components/     # Reusable components
│   │   ├── Footer.jsx
│   │   ├── Footer.module.css
│   │   ├── Navbar.jsx
│   │   └── Navbar.module.css
│   ├── layouts/        # Layout components
│   │   ├── MainLayout.jsx
│   │   └── MainLayout.module.css
│   ├── pages/          # Page components
│   │   ├── AboutQBiT.jsx
│   │   ├── ContactUs.jsx
│   │   ├── Home.jsx
│   │   ├── TestEntry.jsx
│   │   ├── jaundice.jsx
│   │   └── mission.jsx
│   ├── App.jsx         # Main app component
│   ├── App.css         # Global app styles
│   ├── index.css       # CSS variables & reset
│   └── main.jsx        # Entry point
├── index.html          # HTML template
├── package.json        # Dependencies & scripts
├── vite.config.js      # Vite configuration
└── eslint.config.js    # ESLint configuration
```

## 🎨 Design System

### Color Palette
- **Primary Blue**: `#0d3b66`
- **Accent Yellow**: `#f4d35e`
- **Background Light**: `#faf0ca`
- **White Card**: `#ffffff`
- **Text Secondary**: `#335c85`

### Typography
- **Font Family**: Albert Sans (Google Fonts)
- **Icon Font**: Material Symbols Outlined

## 📄 Available Pages

1. **Home** (`/`) - Landing page
2. **About QBiT** (`/about_qbit`) - Information about the team
3. **Test Entry** (`/test_entry`) - Form for entering test results
4. **Jaundice Guide** (`/jaundice`) - Educational resource for families
5. **Mission** (`/mission`) - Project mission and vision
6. **Contact** (`/contact`) - Contact form and information

## 🔧 Configuration

### Vite Configuration
The project uses the default Vite + React setup with Fast Refresh enabled.

### ESLint Configuration
- Extends recommended React and React Hooks rules
- Custom rule: Allows unused variables with uppercase naming convention

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Contact

**Queen's Biomedical Innovation Team (QBiT)**
- Email: qbit@engsoc.queensu.ca
- Location: Kingston, ON, Canada

### Social Media
- [LinkedIn](https://www.linkedin.com/company/22307325/)
- [Facebook](https://www.facebook.com/engsocqbit)
- [Instagram](https://instagram.com/Qbit_queensu)
- [GitHub](https://github.com/qbit-queensu)

## 📝 License

© 2025 Queen's Biomedical Innovation Team. All Rights Reserved.

## 🙏 Acknowledgments

- Queen's University
- Queen's Engineering Society
- All QBiT team members and contributors

---

**Note**: This project is part of QBiT's mission to develop accessible biomedical solutions for global health challenges. The BiliQuant device aims to provide low-cost, non-invasive bilirubin testing to combat neonatal jaundice in under-resourced settings.
