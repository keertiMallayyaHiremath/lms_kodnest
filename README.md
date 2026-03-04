# Kodnest Learning Management System

A production-ready LMS built with Next.js 14 (frontend) and Express.js (backend) with MySQL database.

## 🚀 Features

- **JWT Authentication**: Secure login/register with refresh tokens
- **Video Learning**: YouTube integration with progress tracking
- **Sequential Learning**: Strict video ordering with prerequisite completion
- **Progress Tracking**: Resume videos, track completion, auto-unlock next content
- **Modern UI**: Responsive design with TailwindCSS
- **Type Safety**: Full TypeScript implementation

## 📋 Prerequisites

- Node.js 18+
- MySQL database
- npm or yarn

## 🛠️ Installation

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

4. Configure your `.env` file:
   ```env
   DATABASE_URL="mysql://username:password@host:port/database"
   JWT_SECRET="your-super-secret-jwt-key"
   JWT_REFRESH_SECRET="your-super-secret-refresh-key"
   PORT=3001
   NODE_ENV=development
   FRONTEND_URL="http://localhost:3000"
   ```

5. Generate Prisma client:
   ```bash
   npm run db:generate
   ```

6. Run database migrations:
   ```bash
   npm run db:migrate
   ```

7. Seed database with sample data:
   ```bash
   npm run db:seed
   ```

8. Start backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.local.example .env.local
   ```

4. Configure your `.env.local` file:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
   ```

5. Start frontend server:
   ```bash
   npm run dev
   ```

## 🌐 Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

## 👤 Default Login

After seeding the database, you can login with:
- **Email**: admin@kodnest.com
- **Password**: admin123

## 📚 Sample Content

The system includes sample YouTube videos:
- Introduction to Web Development
- HTML Basics and Structure
- CSS Fundamentals and Styling

## 🏗️ Architecture

### Backend (Express.js)
- **Authentication**: JWT with refresh tokens
- **Database**: MySQL with Prisma ORM
- **Validation**: Joi schema validation
- **Security**: Helmet, CORS, rate limiting
- **Structure**: Modular with controllers, services, repositories

### Frontend (Next.js 14)
- **Framework**: Next.js 14 with App Router
- **Styling**: TailwindCSS
- **State**: Zustand for client state
- **API**: Axios with interceptors
- **Components**: Reusable UI components

## 📊 Database Schema

```
Users
├── id, email, password_hash, name
├── refresh_tokens
└── video_progress

Subjects
├── id, title, slug, description
├── sections
└── enrollments

Sections
├── id, subject_id, title, order_index
└── videos

Videos
├── id, section_id, title, youtube_url
├── order_index, duration_seconds
└── video_progress

Video Progress
├── user_id, video_id
├── last_position_seconds, is_completed
└── completed_at
```

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - User logout

### Subjects
- `GET /api/subjects` - Get all subjects
- `GET /api/subjects/:id` - Get subject details
- `GET /api/subjects/:id/tree` - Get subject with progress
- `GET /api/subjects/:id/first-video` - Get first unlocked video

### Videos
- `GET /api/videos/:id` - Get video details
- `GET /api/videos/subject/:subjectId` - Get videos by subject

### Progress
- `POST /api/progress/videos/:id` - Update video progress
- `GET /api/progress/videos/:id` - Get video progress
- `GET /api/progress/subjects/:id` - Get subject progress
- `GET /api/progress/summary` - Get user progress summary

## 🎯 Key Features

### Sequential Learning
- Videos unlock only after completing previous videos
- Strict ordering enforced by backend
- Visual indicators for locked/unlocked content

### Progress Tracking
- Resume videos from last position
- Track completion status
- Automatic progress updates every 5 seconds

### Security
- JWT tokens with 15-minute expiry
- Refresh tokens stored in HTTP-only cookies
- Rate limiting and CORS protection
- Input validation and sanitization

## 🚀 Deployment

### Backend (Render)
1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically

### Frontend (Vercel)
1. Connect GitHub repository
2. Set `NEXT_PUBLIC_API_BASE_URL`
3. Deploy automatically

### Database (Aiven MySQL)
1. Create MySQL instance
2. Get connection string
3. Update `DATABASE_URL` in backend

## 🧪 Development

### Available Scripts

**Backend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate` - Run migrations
- `npm run db:seed` - Seed database

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server

## 📝 Environment Variables

### Backend (.env)
```env
DATABASE_URL="mysql://username:password@host:port/database"
JWT_SECRET="your-super-secret-jwt-key"
JWT_REFRESH_SECRET="your-super-secret-refresh-key"
PORT=3001
NODE_ENV=development
FRONTEND_URL="http://localhost:3000"
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues and questions:
1. Check the documentation
2. Review existing issues
3. Create a new issue with detailed description

---

Built with ❤️ for Kodnest LMS
