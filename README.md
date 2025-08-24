# Infinite Pi Phrase Search Engine

A full-stack web application that allows users to search for any English phrase within the infinite digits of Pi. The system converts phrases to numeric patterns and efficiently searches through dynamically generated Pi digits without storing the entire sequence.

## 🎯 Features

- **Infinite Pi Search**: Find any English phrase in the digits of Pi
- **Real-time Results**: Live search progress and streaming results
- **Memory Efficient**: Generates Pi digits on-demand without storage
- **High Performance**: C-based backend for optimal search speed
- **Modern UI**: React + Vite frontend with responsive design
- **Concurrent Searches**: Support for multiple simultaneous users
- **Configurable Mapping**: Customizable letter-to-digit conversion

## 🏗️ Architecture

### Frontend (React + Vite + TypeScript)
- **SearchInput**: Phrase input with validation
- **ResultsDisplay**: Shows position and Pi digit context
- **ProgressIndicator**: Real-time search status
- **APIClient**: WebSocket/HTTP communication

### Backend (Python + C)
- **TextMapper**: Converts phrases to numeric patterns
- **PiGenerator**: Streaming Pi digit generation (C library)
- **StreamingSearcher**: Efficient pattern search (KMP algorithm)
- **APIHandler**: FastAPI REST/WebSocket endpoints

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Python 3.8+
- GCC compiler and GMP library (for C modules)

### Installation

1. **Clone and setup**:
   ```bash
   git clone <repository-url>
   cd pi-universe
   ```

2. **Backend setup**:
   ```bash
   cd backend
   pip install -r requirements.txt
   cd c_modules && make all  # Build C libraries
   python run_tests.py --install  # Run tests
   ```

3. **Frontend setup**:
   ```bash
   cd frontend  # or root directory
   npm install
   ```

### Running the Application

1. **Start Backend**:
   ```bash
   cd backend
   python src/api_handler.py
   # Server runs on http://localhost:8000
   ```

2. **Start Frontend**:
   ```bash
   npm run dev
   # Frontend runs on http://localhost:5173
   ```

3. **Access Application**:
   Open http://localhost:5173 in your browser

## 📖 Usage Examples

### Basic Search
1. Enter any English phrase (e.g., "HELLO")
2. Click "Search in Pi"
3. View the position where the phrase first appears
4. See surrounding Pi digits for context

### Advanced Features
- **Custom Mapping**: Define your own letter-to-number conversion
- **Long Phrases**: Search for sentences or paragraphs
- **Real-time Progress**: Watch the search progress live
- **Multiple Searches**: Run concurrent searches

## 🧪 Testing

The project uses comprehensive Test-Driven Development (TDD):

### Backend Tests
```bash
cd backend
python run_tests.py                # All tests
python run_tests.py unit          # Unit tests only
python run_tests.py integration   # Integration tests
python run_tests.py --coverage    # With coverage report
```

### Frontend Tests
```bash
npm test          # Run frontend tests
npm run test:watch # Watch mode
```

## 🏎️ Performance

- **Search Algorithm**: KMP (Knuth-Morris-Pratt) for O(n+m) complexity
- **Memory Usage**: Constant memory, no Pi digit storage
- **Typical Performance**:
  - Single letters: < 5 seconds
  - Short words: < 15 seconds
  - Longer phrases: Variable (depends on position in Pi)

## 🔧 Development

### Project Structure
```
pi-universe/
├── frontend/              # React + Vite application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── services/      # API communication
│   │   └── utils/         # Utility functions
│   └── package.json
├── backend/               # Python + C backend
│   ├── src/               # Python modules
│   ├── c_modules/         # High-performance C libraries
│   ├── tests/             # Comprehensive test suite
│   └── requirements.txt
└── README.md
```

### API Endpoints

#### Search for Phrase
```http
POST /search
{
  "phrase": "HELLO WORLD"
}
```

#### WebSocket Real-time Search
```javascript
const ws = new WebSocket('ws://localhost:8000/ws/search');
ws.send(JSON.stringify({phrase: "HELLO"}));
```

### Building for Production

#### Backend
```bash
cd backend
pip install gunicorn
gunicorn src.api_handler:app --workers 4 --bind 0.0.0.0:8000
```

#### Frontend
```bash
npm run build
npm run preview
```

## 🔬 Technical Details

### Pi Generation Algorithm
- **Bailey–Borwein–Plouffe (BBP) Formula**: For arbitrary precision
- **Spigot Algorithm**: Memory-efficient streaming generation
- **GMP Library**: High-precision arithmetic in C

### Search Algorithm
- **KMP (Knuth-Morris-Pratt)**: Optimal string searching
- **Streaming Processing**: Handles infinite sequences
- **Partial Match Handling**: Correctly processes overlapping patterns

### Letter-to-Digit Mapping
Default mapping: A=01, B=02, C=03, ..., Z=26
- Case-insensitive conversion
- Ignores spaces and punctuation
- Configurable for alternative mappings

## 🚀 Deployment

### Docker (Recommended)
```bash
# Build and run with Docker Compose
docker-compose up --build
```

### Manual Deployment
1. Deploy backend to cloud service (AWS, GCP, etc.)
2. Build and deploy frontend to CDN/static hosting
3. Configure environment variables and scaling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Write tests for new functionality
4. Ensure all tests pass: `npm test && cd backend && python run_tests.py`
5. Submit a pull request

### Development Guidelines
- Follow TDD principles (write tests first)
- Maintain high test coverage (>90%)
- Use TypeScript for frontend type safety
- Follow Python PEP 8 style guidelines
- Document C code thoroughly

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Pi Generation**: Based on Bailey–Borwein–Plouffe formula
- **Search Algorithm**: Knuth-Morris-Pratt string matching
- **Inspiration**: The fascinating mathematical properties of Pi

---

**Fun Fact**: Every possible finite sequence of digits appears somewhere in the infinite expansion of Pi (if Pi is a normal number, which is widely believed but not yet proven)!
