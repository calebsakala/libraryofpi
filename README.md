# 🥧 Library of Pi

> *"Everything that can ever be said or written is contained within Pi's infinite digits"*

<img width="1896" height="929" alt="Screenshot 2025-08-24 230511" src="https://github.com/user-attachments/assets/239c46d2-66d0-45c2-a4bb-b9990c1051b9" />


A mystical, interactive web application that searches for words and phrases hidden within the infinite digits of Pi. Built with React, TypeScript, and mathematical wonder.

## ✨ Features

- **🔍 Word Search**: Search for any (20 character) word or phrase within the first billion digits of Pi
- **🎭 Beautiful Visualization**: Animated spirograph patterns based on Pi's mathematical properties
- **📊 Probability Analysis**: Advanced mathematical calculations showing the likelihood of finding patterns
- **🎵 Ambient Experience**: Subtle background music to enhance the cosmic exploration
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices
- **🌌 Cosmic Theme**: Mystical dark theme with golden accents and floating animations

## 🚀 Live Demo

Visit the live application: [Library of Pi](https://libraryofpi.com) 

## 🧮 How It Works

### Letter-to-Number Mapping
Words are converted to numbers using a simple mapping system:
- A=00, B=01, C=04... Z=25
- "HELLO" becomes "0704111114"
- This numeric sequence is then searched within Pi's digits

### Mathematical Search
- Searches through over **10 billion digits of Pi** using the [pilookup.com API](https://pilookup.com) and a Go API hosted on AWS EC2.
- Displays the exact position where your phrase appears
- Shows surrounding context with both numeric and letter representations

### Probability Calculation
When a sequence isn't found, we calculate the probability using:
- **Finite State Automata** to track partial pattern matches
- **Markov Chain Analysis** for modeling the search process
- **Matrix Exponentiation** for efficient probability calculations
- Assumes Pi's digits are statistically random (which they appear to be)

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Custom CSS with Tailwind CSS utilities
- **Animations**: GSAP (GreenSock)
- **UI Components**: Custom components with shadcn/ui base
- **Build Tool**: Vite
- **API**: pilookup.com for Pi digit searches

## 🏗️ Project Structure

```
src/
├── components/
│   ├── ui/              # Base UI components
│   └── PiVisualization/ # Mathematical visualization component
├── App.tsx              # Main application component
├── App.css              # Cosmic styling and animations
└── main.tsx             # Application entry point
```

## 🎨 Design Philosophy

The Library of Pi embraces a **cosmic, mystical aesthetic** that reflects the infinite nature of Pi:

- **Dark cosmic background** with subtle gradients
- **Golden color palette** (rgba(205, 193, 147)) for mathematical elegance
- **Floating animations** and particle effects
- **Typography**: Playfair Display for headings, Crimson Text for body
- **Smooth transitions** and micro-interactions throughout

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/calebsakala/libraryofpi.git
   cd libraryofpi
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:5173
   ```

### Build for Production

```bash
npm run build
```

## 🎭 Features in Detail

### 🌟 Loading Experience
- Animated loading screen with progress simulation
- Cosmic ambiance preparation
- One-time experience with session persistence

### 🔍 Search Interface
- Real-time input validation
- Character limit (20 characters)
- Smooth animations and feedback
- Mobile-optimized input experience

### 📊 Result Display
- **Success**: Beautiful card showing discovery details, position, and context
- **Not Found**: Probability analysis with mathematical explanation
- **Context Visualization**: Shows before/after sequences in both numbers and letters

### 🎵 Audio Experience
- Embedded YouTube player with ambient music
- Subtle positioning and transparency
- User-controllable playback
- Auto-play after user interaction

## 🧠 The Mathematics

Pi contains every possible finite sequence of digits, which means:
- Every book ever written exists somewhere in Pi
- Every conversation, including this README
- Every possible combination of letters and numbers
- The challenge is finding them within computational limits

Our search covers the first **10 billion digits**, giving us a substantial window into Pi's infinite sequence.

## 🤝 Contributing

Contributions are welcome! Whether you want to:
- Improve the mathematical algorithms
- Enhance the visual design
- Add new features
- Fix bugs
- Improve documentation

Please feel free to open issues and pull requests.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 About the Creator

**Caleb Sakala** - Inspired by the infinite beauty of mathematics and the wonder of Pi.

### Connect with me:
- 💼 **LinkedIn**: [linkedin.com/in/calebsakala](https://linkedin.com/in/calebsakala)
- 🐦 **Twitter/X**: [@bytecaleb](https://x.com/bytecaleb)
- 💻 **GitHub**: [@calebsakala](https://github.com/calebsakala)

---

## 🌟 Star This Repository

If you find this project interesting or useful, please consider giving it a star! It helps others discover the infinite beauty of Pi.

---


*"In the digits of Pi, every story has already been written, every equation already solved, every dream already dreamed. We're just archaeologists of the infinite, uncovering what was always there."*

