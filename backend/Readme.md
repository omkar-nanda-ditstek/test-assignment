# User Data API

A production-ready Express.js API built with TypeScript.  
It provides user management with in-memory caching, rate limiting, and clean architecture.  
Redis-based async queue processing is optional.

---

## Features

- In-memory LRU caching (no Redis by default)
- Rate limiting to prevent abuse
- Concurrent request deduplication
- Optional BullMQ + Redis for async jobs
- Centralized error handling and logging
- TypeScript for type safety
- Clean architecture (controllers, services, routes)
- Request validation using Joi
- Health check and cache monitoring APIs

---

## Tech Stack

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

## Project Structure

src/
├── config/
├── controllers/
├── middleware/
├── routes/
├── services/
├── types/
├── utils/
├── app.ts
└── server.ts


---

## Prerequisites

- Node.js 18+
- npm or yarn
- Redis (only if queue is enabled)

---

## Installation

```bash
npm install
cp .env.example .env
```

---

## Environment Variables

```bash
NODE_ENV=development
PORT=3000
CACHE_TTL=60
CACHE_MAX_SIZE=500
LOG_LEVEL=info
```
---


## Running the Application
# Development
npm run dev

# Build
```bash
npm run build
```

# Production
```bash
npm start
```

---

## API Overview
```bash
Base URL: http://localhost:3000
```

# Users
```bash
GET /api/users/:id – Get user by ID (cached)
GET /api/users – Get all users
POST /api/users – Create a user
```

# Cache
```bash
GET /api/cache/status – Cache statistics
DELETE /api/cache – Clear cache
```


# Health
```bash
GET /api/health – Service health check
```