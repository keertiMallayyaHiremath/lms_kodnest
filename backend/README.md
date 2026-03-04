# Kodnest LMS Backend

A production-ready Learning Management System backend API built with Node.js, Express, TypeScript, and MySQL.

## Features

- **JWT Authentication**: Secure authentication with access and refresh tokens
- **Video Progress Tracking**: Track user progress through video content
- **Strict Video Ordering**: Enforce sequential video unlocking
- **YouTube Integration**: Store and manage YouTube video URLs
- **RESTful API**: Clean, well-documented API endpoints
- **TypeScript**: Full type safety throughout the application
- **Database Migrations**: Prisma-based schema management

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MySQL (via Prisma ORM)
- **Authentication**: JWT with refresh tokens
- **Validation**: Joi
- **Security**: Helmet, CORS, Rate Limiting

## Getting Started

### Prerequisites

- Node.js 18+
- MySQL database
- npm or yarn

### Installation

1. Clone the repository
2. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Set up your database URL in `.env`:
   ```
   DATABASE_URL="mysql://username:password@host:port/database"
   ```

5. Generate Prisma client:
   ```bash
   npm run db:generate
   ```

6. Run database migrations:
   ```bash
   npm run db:migrate
   ```

7. Seed the database:
   ```bash
   npm run db:seed
   ```

8. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - User logout

### Subjects
- `GET /api/subjects` - Get all published subjects
- `GET /api/subjects/:subjectId` - Get subject details
- `GET /api/subjects/:subjectId/tree` - Get subject tree with progress
- `GET /api/subjects/:subjectId/first-video` - Get first unlocked video

### Videos
- `GET /api/videos/:videoId` - Get video details with progress
- `GET /api/videos/subject/:subjectId` - Get all videos in subject

### Progress
- `POST /api/progress/videos/:videoId` - Update video progress
- `GET /api/progress/videos/:videoId` - Get video progress
- `GET /api/progress/subjects/:subjectId` - Get subject progress
- `GET /api/progress/summary` - Get user progress summary

### Health
- `GET /health` - Health check endpoint

## Environment Variables

```env
# Database
DATABASE_URL="mysql://username:password@host:port/database"

# JWT
JWT_SECRET="your-super-secret-jwt-key"
JWT_REFRESH_SECRET="your-super-secret-refresh-key"

# Server
PORT=3001
NODE_ENV=development

# CORS
FRONTEND_URL="http://localhost:3000"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Database Schema

The application uses the following main entities:

- **Users**: User accounts and authentication
- **Subjects**: Course subjects/topics
- **Sections**: Sections within subjects
- **Videos**: Individual video lessons
- **VideoProgress**: User progress tracking
- **RefreshTokens**: JWT refresh token management

## Video Ordering Logic

Videos are ordered strictly by:
1. Section order index
2. Video order index within section

Videos are locked until the previous video in the sequence is completed.

## Sample Data

The seed script includes sample YouTube URLs:
- Introduction to Web Development
- HTML Basics and Structure  
- CSS Fundamentals and Styling

## Deployment

### Environment Setup

1. Set production environment variables
2. Run database migrations
3. Build the application:
   ```bash
   npm run build
   ```
4. Start production server:
   ```bash
   npm start
   ```

### Recommended Hosting

- **Backend**: Render, Heroku, or AWS EC2
- **Database**: Aiven MySQL, PlanetScale, or AWS RDS

## Security Features

- JWT token-based authentication
- HTTP-only secure cookies for refresh tokens
- Rate limiting on API endpoints
- CORS protection
- Helmet security headers
- Input validation with Joi
- Password hashing with bcrypt

## Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data
- `npm test` - Run tests

### Project Structure

```
src/
├── config/          # Configuration files
├── middleware/      # Express middleware
├── modules/         # Feature modules
│   ├── auth/        # Authentication
│   ├── subjects/    # Subject management
│   ├── videos/      # Video management
│   ├── progress/    # Progress tracking
│   └── health/      # Health checks
├── utils/           # Utility functions
└── types/           # TypeScript type definitions
```

## License

MIT
