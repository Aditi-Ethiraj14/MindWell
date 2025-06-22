# MindWell - AI Mental Health Companion

A comprehensive mental health application that combines gamification elements with n8n chatbot integration to encourage positive mental wellness habits.

## Features

- **Authentication System**: Secure login/registration with session-based auth
- **Mood Tracking**: Daily mood logging with progress visualization  
- **Self-Care Activities**: Guided exercises with automatic completion rewards
- **Gamification**: Points, streaks, achievements, and level progression
- **AI Chat Integration**: Floating chat button with n8n chatbot integration
- **Progress Analytics**: Weekly mood charts and activity tracking
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Node.js + Express
- **UI**: Tailwind CSS + shadcn/ui components
- **State Management**: TanStack Query
- **Storage**: In-memory storage (no database required)
- **Authentication**: Passport.js with local strategy

## Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/Aditi-Ethiraj14/MindWell.git
cd MindWell
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm run dev
```

4. **Open your browser** 
Navigate to `http://localhost:5000`

## Usage

1. **Register/Login**: Create an account or login with existing credentials
2. **Track Mood**: Select your daily mood to build progress analytics
3. **Complete Activities**: Try breathing exercises and other wellness activities
4. **Earn Rewards**: Gain points and unlock achievements for consistent usage
5. **Chat Support**: Use the floating chat button for AI assistance via n8n integration

## Project Structure

```
├── client/          # React frontend
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── hooks/       # Custom React hooks
│   │   └── lib/         # Utilities and configurations
├── server/          # Express backend
│   ├── auth.ts      # Authentication logic
│   ├── routes.ts    # API routes
│   └── storage.ts   # In-memory data storage
├── shared/          # Shared types and schemas
└── package.json     # Dependencies and scripts
```

## Building for Production

```bash
npm run build
npm start
```

## Features Overview

### Authentication
- Session-based authentication with secure password hashing
- Protected routes and user context management

### Chat Integration
- Integration with n8n chatbot at custom webhook URL
- Opens in popup window to avoid CORS restrictions
- Emergency notification in case of triggered inputs to concerned authorities via Discord.

### Telegram Mood Check-in and Response (Agentic AI via n8n)
- Sends mood check-in messages every 6 hours via Telegram
- Analyzes user replies using AI to detect sentiment
- Responds with tailored suggestions and prompts to log in or chat with their AI buddy in-app

### Mental Health Activities
- Breathing exercises with auto-completion
- Activity timer with point rewards
- Progress tracking and streaks

### Gamification System
- Point-based rewards (+15 points per activity)
- Achievement unlocking system
- Daily streak tracking
- User level progression


## Project Snippet
![image](https://github.com/user-attachments/assets/679932dc-e444-4f11-9dfd-91bd4c037fd4)


## License

MIT License - feel free to use this project for your own mental health applications.
