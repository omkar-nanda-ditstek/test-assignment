# Test Assignment - Monorepo

A full-stack application featuring a React-based seating map frontend and a TypeScript Express.js backend API with advanced caching and rate limiting.

---

## Project Structure

This is a monorepo containing two main applications:

```
test-assignment/
├── backend/          # Express.js REST API
├── frontend/         # React + Vite application
└── README.md         # This file
```

---

## Backend - User Data API

A production-ready Express.js API built with TypeScript, providing user management with in-memory caching, rate limiting, and clean architecture.

### Backend Features

- In-memory LRU caching (no Redis by default)
- Rate limiting to prevent abuse
- Concurrent request deduplication
- Optional BullMQ + Redis for async jobs
- Centralized error handling and logging
- TypeScript for type safety
- Clean architecture (controllers, services, routes)
- Request validation using Joi
- Health check and cache monitoring APIs

### Backend Tech Stack

- Node.js (>= 18)
- Express.js
- TypeScript
- lru-cache
- express-rate-limit
- Joi
- Winston
- Jest
- BullMQ + Redis (optional)

---

## Frontend - Seating Map

A modern React application built with Vite and TypeScript, featuring a seating map interface.

### Frontend Features

- React 19 with TypeScript
- Vite for fast development and building
- TanStack Query for data fetching and state management
- Zustand for client-side state management
- Tailwind CSS v4 for styling
- React Query DevTools for debugging

### Frontend Tech Stack

- React 19
- TypeScript
- Vite
- TanStack Query
- Zustand
- Tailwind CSS v4

---

## Prerequisites

- Node.js 18+
- npm or pnpm
- Redis (optional, only if backend queue is enabled)

---

## Getting Started

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

The backend API will be available at `http://localhost:3000`

For detailed backend documentation, see [backend/Readme.md](backend/Readme.md)

### Frontend Setup

```bash
cd frontend
pnpm install
pnpm dev
```

The frontend will be available at `http://localhost:5173` (default Vite port)

For detailed frontend documentation, see [frontend/README.md](frontend/README.md)

---

## Development Workflow

### Running Both Applications

In separate terminal windows:

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
pnpm dev
```

### Building for Production

Backend:
```bash
cd backend
npm run build
npm start
```

Frontend:
```bash
cd frontend
pnpm build
pnpm preview
```

---

## Testing

### Backend Tests

```bash
cd backend
npm test                 # Run tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
```

---

## Code Quality

### Backend

```bash
cd backend
npm run lint             # Run ESLint
npm run lint:fix         # Fix linting issues
npm run format           # Format code with Prettier
npm run check            # Run all checks
```

### Frontend

```bash
cd frontend
pnpm lint                # Run ESLint
```

---

## API Documentation

### Backend Endpoints

Base URL: `http://localhost:3000`

#### Users
- `GET /api/users/:id` - Get user by ID (cached)
- `GET /api/users` - Get all users
- `POST /api/users` - Create a user

#### Cache
- `GET /api/cache/status` - Cache statistics
- `DELETE /api/cache` - Clear cache

#### Health
- `GET /api/health` - Service health check

---

## License

MIT
