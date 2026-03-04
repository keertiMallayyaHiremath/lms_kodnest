# Learning Management System (LMS)

A production-ready LMS with strict video ordering, progress tracking, and JWT authentication.

## Tech Stack

### Frontend
- Next.js 14 (App Router)
- TailwindCSS
- Zustand for state management
- react-youtube for video playback

### Backend
- Node.js + Express
- JWT authentication
- MySQL + Prisma ORM

### Deployment
- Frontend: Vercel
- Backend: Render
- Database: Aiven MySQL

## Project Structure

```
lms/
├── backend/          # Express API server
├── frontend/         # Next.js application
└── README.md
```

## Quick Start

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Configure your .env file
npx prisma migrate dev
npx prisma db seed
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env.local
# Configure your .env.local file
npm run dev
```

## Features

- ✅ JWT authentication (access + refresh tokens)
- ✅ Strict sequential video ordering
- ✅ Video progress tracking and resume
- ✅ Auto-unlock next videos on completion
- ✅ Subject completion tracking
- ✅ YouTube video integration
- ✅ Responsive UI with TailwindCSS

## Environment Variables

See `.env.example` files in backend and frontend directories.

## Database Schema

- users
- subjects
- sections
- videos
- video_progress
- refresh_tokens

## API Documentation

See `backend/API.md` for detailed endpoint documentation.
