# Deployment Guide

## Prerequisites

1. Aiven MySQL database
2. Render account
3. Vercel account

## Database Setup (Aiven)

1. Create a MySQL instance on Aiven
2. Note down the connection string
3. Update `DATABASE_URL` in your environment

## Backend Deployment (Render)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure:
   - Build Command: `npm install && npx prisma generate && npm run build`
   - Start Command: `npm start`
   
4. Add Environment Variables:
   ```
   DATABASE_URL=your-aiven-mysql-url
   JWT_ACCESS_SECRET=your-secret-key
   JWT_REFRESH_SECRET=your-refresh-secret
   JWT_ACCESS_EXPIRES_IN=15m
   JWT_REFRESH_EXPIRES_IN=30d
   FRONTEND_URL=https://your-vercel-app.vercel.app
   NODE_ENV=production
   ```

5. Run migrations:
   ```bash
   npx prisma migrate deploy
   ```

6. Seed the database:
   ```bash
   npm run prisma:seed
   ```

## Frontend Deployment (Vercel)

1. Import your project to Vercel
2. Configure:
   - Framework Preset: Next.js
   - Root Directory: `frontend`
   
3. Add Environment Variable:
   ```
   NEXT_PUBLIC_API_BASE_URL=https://your-render-app.onrender.com/api
   ```

4. Deploy

## Post-Deployment

1. Test authentication flow
2. Test video playback
3. Verify progress tracking
4. Check token refresh mechanism

## Monitoring

- Check Render logs for backend errors
- Check Vercel logs for frontend errors
- Monitor database connections on Aiven

## Troubleshooting

### CORS Issues
- Verify `FRONTEND_URL` in backend matches your Vercel URL
- Check CORS configuration in `backend/src/app.ts`

### Database Connection
- Verify `DATABASE_URL` format
- Check Aiven firewall settings
- Ensure SSL is enabled if required

### Token Issues
- Verify JWT secrets are set
- Check cookie settings for production
- Ensure `secure` flag is enabled in production
