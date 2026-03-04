# Setup Instructions

## Prerequisites

- Node.js 18+ and npm
- MySQL database (local or Aiven)
- Git

## Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="mysql://user:password@localhost:3306/lms"
JWT_ACCESS_SECRET=your-super-secret-access-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=30d
FRONTEND_URL=http://localhost:3000
```

5. Generate Prisma client:
```bash
npx prisma generate
```

6. Run database migrations:
```bash
npx prisma migrate dev --name init
```

7. Seed the database:
```bash
npm run prisma:seed
```

8. Start the development server:
```bash
npm run dev
```

Backend will run on http://localhost:5000

## Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env.local
```

4. Update `.env.local`:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
```

5. Start the development server:
```bash
npm run dev
```

Frontend will run on http://localhost:3000

## Test Credentials

After seeding, you can login with:
- Email: `test@example.com`
- Password: `password123`

## Verify Setup

1. Open http://localhost:3000
2. Click "Register" or "Login"
3. Browse available courses
4. Click on a course to start watching videos
5. Video progress should be saved automatically
6. Complete a video to unlock the next one

## Troubleshooting

### Database Connection Issues
- Verify MySQL is running
- Check DATABASE_URL format
- Ensure database exists

### CORS Errors
- Verify FRONTEND_URL in backend .env
- Check that both servers are running

### Prisma Issues
- Run `npx prisma generate` after schema changes
- Run `npx prisma migrate reset` to reset database

### Port Already in Use
- Change PORT in backend .env
- Change port in frontend .env.local NEXT_PUBLIC_API_BASE_URL

## Development Commands

### Backend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run migrations
npm run prisma:seed      # Seed database
```

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run linter
```

## Database Management

### View Database
```bash
cd backend
npx prisma studio
```

### Reset Database
```bash
cd backend
npx prisma migrate reset
npm run prisma:seed
```

### Create Migration
```bash
cd backend
npx prisma migrate dev --name migration_name
```
