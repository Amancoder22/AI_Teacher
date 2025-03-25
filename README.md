# AI Learning Companion

An interactive educational platform that generates personalized lectures using Google's Gemini AI. This application helps students learn various topics through AI-generated content tailored to their grade level.

## Features

- 🤖 AI-powered lecture generation using Google's Gemini AI
- 📚 Grade-appropriate content (grades 1-5)
- 🎨 Interactive learning interface
- 📱 Responsive design for all devices
- 🔄 Real-time content generation
- 🎯 Topic-based learning

## Prerequisites

- Node.js (v22.14.0 or higher)
- npm (Node Package Manager)
- Google Gemini API key

## Installation

1. Clone the repository:
```bash
git clone [your-repository-url]
cd AILearningCompanion
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following content:
```env
# Gemini API Key for AI Learning Companion
GEMINI_API_KEY=your_api_key_here

# Server Configuration
PORT=3000
NODE_ENV=development
```

Replace `your_api_key_here` with your actual Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey).

## Running the Application

### Development Mode

```bash
npm run dev
```

This will start the development server on port 3000. The application will be available at `http://localhost:3000`.

### Production Mode

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## Project Structure

```
AILearningCompanion/
├── client/           # Frontend React application
├── server/           # Backend Express server
├── shared/           # Shared types and utilities
├── .env              # Environment variables
├── package.json      # Project dependencies
└── README.md         # Project documentation
```

## Technology Stack

- Frontend:
  - React
  - TypeScript
  - Tailwind CSS
  - Radix UI Components

- Backend:
  - Node.js
  - Express
  - TypeScript
  - Google Gemini AI API

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Google Gemini AI for providing the AI capabilities
- The open-source community for the various tools and libraries used in this project 
