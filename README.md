# Pausitive Breathing

A simple, effective web application and Chrome extension that helps users practice breathing techniques for stress relief and relaxation through visual guidance and customizable sessions.

## 🌟 Features

### Core Breathing Techniques
- **4-8 Breathing** (Beginner): 4 counts inhale, 8 counts exhale
- **7-11 Breathing** (Standard): 7 counts inhale, 11 counts exhale  
- **6-10 Breathing** (Intermediate): 6 counts inhale, 10 counts exhale
- **8-12 Breathing** (Advanced): 8 counts inhale, 12 counts exhale

### Session Modes
- **Quick Break**: 5 sets (~2-3 minutes)
- **Slow Down**: 15 sets (~6-8 minutes)
- **Meditate**: 25 sets (~10-15 minutes)
- **Custom**: User-defined number of sets (1-50 range)

### Visual Elements
- Circular progress indicator with smooth animations
- Dynamic background gradients that evolve throughout sessions
- Clear breathing cues and progress tracking
- Responsive design for all device sizes

## 🚀 Getting Started

### Web Application
1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Open `http://localhost:3000` in your browser

### Chrome Extension
1. Build the project: `npm run build:extension`
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the `dist` folder
5. The extension icon will appear in your toolbar
6. Click the icon to open the breathing app in a new tab

## 🛠️ Development

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Project Structure
```
src/
├── components/          # UI components
├── modules/            # Core functionality
├── styles/             # CSS and styling
├── utils/              # Utilities and constants
└── main.js            # Application entry point
```

## 📱 Usage

1. **Choose a breathing technique** based on your experience level
2. **Select a session mode** that fits your available time
3. **Follow the visual guidance** - the circle will guide your breathing rhythm
4. **Use controls** to pause, stop, or navigate back
5. **Complete your session** and feel the benefits of mindful breathing

## 🎨 Customization

The app automatically adjusts to different screen sizes and can be customized through:
- CSS variables for colors and timing
- Breathing technique parameters
- Session duration settings
- Visual animation preferences

## 🌐 Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+
- Mobile browsers (iOS Safari 13+, Android Chrome 80+)

## 📦 Deployment

### Web App
- Build with `npm run build`
- Deploy the `dist` folder to any static hosting service
- Recommended: Netlify, Vercel, or GitHub Pages

### Chrome Extension
- Build with `npm run build`
- The `dist` folder contains all necessary extension files
- Upload to Chrome Web Store for public distribution

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

Made with ❤️ by [ravoluzen](https://x.com/ravoluzen)

---

**Take a breath, find your calm, and breathe mindfully with Pausitive Breathing.** 🍃✨
