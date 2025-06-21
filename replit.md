# MindWell - AI Mental Health Companion

## Overview

MindWell is a comprehensive mental health application that combines AI-powered chat support with gamification elements to encourage positive mental wellness habits. The application features mood tracking, self-care activities, progress monitoring, and a reward system that includes blockchain token conversion capabilities.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for client-side routing
- **UI Components**: Radix UI primitives with custom styling
- **Authentication**: Context-based auth with session management

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ESM modules
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Passport.js with local strategy and session-based auth
- **AI Integration**: Dual support for HuggingFace Inference API and OpenAI API

### Data Storage Solutions
- **Primary Database**: Supabase (PostgreSQL)
- **ORM**: Drizzle with schema-first approach
- **Session Storage**: In-memory store (MemoryStore)
- **Database Schema**: 
  - Users table with gamification fields (points, streaks, levels)
  - Moods table for tracking emotional states
  - Activities table for self-care exercises
  - User activities for completion tracking
  - Achievements system for rewards
  - Chat messages for AI conversation history

## Key Components

### Authentication and Authorization
- Session-based authentication using express-session
- Password hashing with Node.js crypto (scrypt)
- Protected routes with authentication middleware
- User context provider for React components

### AI Chat System
- Dual AI provider support (HuggingFace and OpenAI)
- Mental health-focused system prompts
- Conversation history persistence
- Fallback mechanisms between AI providers

### Gamification System
- Point-based reward system
- Daily streak tracking
- Achievement unlocking
- User level progression
- Activity completion rewards

### Mental Health Features
- Mood tracking with emotional state logging
- Self-care activity library (breathing, meditation, journaling)
- Progress visualization with charts
- Weekly mood analytics

### Blockchain Integration
- Mock Polygon network integration for token conversion
- Points-to-token conversion system
- Wallet connection simulation
- Token balance tracking

## Data Flow

1. **User Authentication**: Login/register → Session creation → Protected route access
2. **Mood Tracking**: Mood selection → Database storage → Analytics processing
3. **Activity Completion**: Activity selection → Completion tracking → Points award → Achievement check
4. **AI Chat**: User message → AI provider API → Response processing → History storage
5. **Progress Tracking**: Data aggregation → Chart generation → Trend analysis
6. **Token Conversion**: Points validation → Mock blockchain transaction → Balance update

## External Dependencies

### Core Dependencies
- **@supabase/supabase-js**: Database connectivity and authentication
- **@huggingface/inference**: AI model inference
- **drizzle-orm**: Database ORM and query builder
- **express**: Web server framework
- **passport**: Authentication middleware

### UI Dependencies
- **@radix-ui/***: Accessible UI primitives
- **@tanstack/react-query**: Server state management
- **recharts**: Data visualization
- **tailwindcss**: Utility-first CSS framework

### Development Dependencies
- **vite**: Build tool and dev server
- **typescript**: Type checking
- **tsx**: TypeScript execution

## Deployment Strategy

- **Platform**: Replit with Cloud Run deployment target
- **Build Process**: Vite for frontend, esbuild for backend bundling
- **Environment**: Node.js 20 runtime
- **Port Configuration**: Internal port 5000, external port 80
- **Database**: Supabase hosted PostgreSQL instance

## Changelog

- June 21, 2025: Initial setup
- June 21, 2025: Removed all unused environment variables and API dependencies (OpenAI, HuggingFace, Supabase)
- June 21, 2025: Project now uses only in-memory storage with no external API requirements

## User Preferences

Preferred communication style: Simple, everyday language.