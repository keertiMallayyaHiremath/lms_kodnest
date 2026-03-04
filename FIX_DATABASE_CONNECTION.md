# Fix Database Connection - Action Required

## The Problem

The database connection is failing because the password in your screenshot shows `CLICK_TO_REVEAL_PASSWORD`, which means you need to reveal the actual password first.

## Solution - Follow These Steps

### Step 1: Get Your Real Password

1. Go to your Aiven console: https://console.aiven.io
2. Navigate to your MySQL service
3. Find the "Password" field that shows `CLICK_TO_REVEAL_PASSWORD`
4. **Click on it** to reveal the actual password
5. **Copy the revealed password**

### Step 2: Update backend/.env

Open `backend/.env` and replace `YOUR_ACTUAL_PASSWORD` with the password you just copied:

```env
DATABASE_URL="mysql://avnadmin:PASTE_YOUR_PASSWORD_HERE@mysql-14fe18bd-keertihiremath496-53b7.d.aivencloud.com:26040/defaultdb?ssl={\"rejectUnauthorized\":true}"
```

### Step 3: Whitelist Your IP (Important!)

1. In Aiven console, go to your MySQL service
2. Look for "Allowed IP Addresses" or "Access Control"
3. Add your current IP address
   - Or temporarily use `0.0.0.0/0` for testing (allows all IPs)

### Step 4: Setup Database

Open terminal in the `backend` folder and run:

```bash
# Generate Prisma Client
npx prisma generate

# Create tables in database
npx prisma db push

# Seed with sample data
npx tsx prisma/seed.ts
```

### Step 5: Start Backend

```bash
npm run dev
```

You should see:
```
🚀 Server running on port 5000
📝 Environment: development
```

### Step 6: Start Frontend

Open a NEW terminal in the `frontend` folder:

```bash
npm install
npm run dev
```

### Step 7: Test

1. Open http://localhost:3000
2. Login with:
   - Email: `test@example.com`
   - Password: `password123`
3. You should see the course with your 3 YouTube videos!

## Still Getting Errors?

### Error: Authentication Failed
- Double-check you revealed and copied the correct password
- Make sure there are no extra spaces when pasting

### Error: TLS/SSL Connection
Try this simpler connection string in `backend/.env`:
```env
DATABASE_URL="mysql://avnadmin:YOUR_PASSWORD@mysql-14fe18bd-keertihiremath496-53b7.d.aivencloud.com:26040/defaultdb"
```

### Error: Connection Timeout
- Check if your IP is whitelisted in Aiven
- Try adding `0.0.0.0/0` temporarily

### Error: Database doesn't exist
The database `defaultdb` should exist by default. If not, create it in Aiven console.

## Quick Test

To quickly test if your connection works:

```bash
cd backend
npx prisma db push
```

If you see "✔ Database synchronized", your connection is working!

## Need More Help?

Check these files:
- `DATABASE_SETUP.md` - Detailed database setup guide
- `QUICK_START.md` - Quick start instructions
- `SETUP.md` - Complete setup guide

The main issue is just revealing the password in Aiven console and updating the `.env` file!
