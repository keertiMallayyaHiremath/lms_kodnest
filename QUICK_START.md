# Quick Start Guide

## Database Configuration

Your Aiven MySQL database needs to be configured in `backend/.env`:

```
Host: mysql-14fe18bd-keertihiremath496-53b7.d.aivencloud.com
Port: 26040
Database: defaultdb
User: avnadmin
Password: [REVEAL IN AIVEN CONSOLE]
SSL: REQUIRED
```

**IMPORTANT:** You must reveal the actual password in your Aiven console and update `backend/.env`

## Setup Instructions

### Backend Setup

1. Open a terminal and navigate to backend:
```bash
cd backend
```

2. If you're on Windows, run the setup script:
```bash
setup.bat
```

OR manually run these commands:

```bash
# Install dependencies
npm install

# Generate Prisma Client (close any running processes first)
npx prisma generate

# Push schema to database
npx prisma db push

# Seed the database
npx tsx prisma/seed.ts

# Start the server
npm run dev
```

### Frontend Setup

1. Open a NEW terminal and navigate to frontend:
```bash
cd frontend
```

2. Install and run:
```bash
npm install
npm run dev
```

## Troubleshooting

### Prisma Generate Error (Windows)
If you get "EPERM: operation not permitted" error:
1. Close all terminals and VS Code
2. Reopen and try again
3. Or delete `node_modules/.prisma` folder and run `npx prisma generate` again

### Database Connection Error
If you get connection errors:
1. Check if your IP is whitelisted in Aiven console
2. Verify the database credentials in `backend/.env`
3. Test connection: `npx prisma db push`

### SSL Certificate Error
The connection string already includes `ssl-mode=REQUIRED` which should work with Aiven.

## Test Login

Once both servers are running:
1. Open http://localhost:3000
2. Login with:
   - Email: `test@example.com`
   - Password: `password123`

## Verify Database

To view your database:
```bash
cd backend
npx prisma studio
```

This will open a GUI at http://localhost:5555
