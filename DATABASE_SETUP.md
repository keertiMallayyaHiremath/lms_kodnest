# Database Setup Guide - Aiven MySQL

## Issue: Authentication Failed

The connection is failing because either:
1. The password needs to be revealed (click "CLICK_TO_REVEAL_PASSWORD")
2. Your IP address needs to be whitelisted in Aiven
3. SSL certificate configuration

## Steps to Fix

### Step 1: Reveal the Password

In your Aiven console screenshot, I see:
- Password shows: `CLICK_TO_REVEAL_PASSWORD`

You need to:
1. Go to your Aiven console
2. Click on "CLICK_TO_REVEAL_PASSWORD" to see the actual password
3. Copy the revealed password

### Step 2: Update the .env File

Once you have the real password, update `backend/.env`:

```env
DATABASE_URL="mysql://avnadmin:YOUR_ACTUAL_PASSWORD@mysql-14fe18bd-keertihiremath496-53b7.d.aivencloud.com:26040/defaultdb?ssl-mode=REQUIRED"
```

Replace `YOUR_ACTUAL_PASSWORD` with the password you revealed.

### Step 3: Download CA Certificate (if needed)

If SSL issues persist:

1. In Aiven console, click "Show" next to "CA certificate"
2. Download the certificate file
3. Save it as `backend/ca-certificate.crt`
4. Update DATABASE_URL:

```env
DATABASE_URL="mysql://avnadmin:YOUR_PASSWORD@mysql-14fe18bd-keertihiremath496-53b7.d.aivencloud.com:26040/defaultdb?sslcert=./ca-certificate.crt"
```

### Step 4: Whitelist Your IP

1. Go to Aiven console
2. Navigate to your MySQL service
3. Go to "Overview" or "Allowed IP Addresses"
4. Add your current IP address or use `0.0.0.0/0` for testing (not recommended for production)

### Step 5: Test Connection

```bash
cd backend
npx prisma db push
```

If successful, you should see:
```
✔ Database synchronized with Prisma schema
```

### Step 6: Seed the Database

```bash
npx tsx prisma/seed.ts
```

### Step 7: Start the Server

```bash
npm run dev
```

## Alternative: Use Service URI Directly

Aiven provides a "Service URI". Try using that directly:

1. In Aiven console, find "Service URI"
2. Copy the entire URI
3. Paste it in `backend/.env` as DATABASE_URL

## Common Connection String Formats

Try these formats one by one:

### Format 1: Basic with SSL
```
mysql://avnadmin:PASSWORD@mysql-14fe18bd-keertihiremath496-53b7.d.aivencloud.com:26040/defaultdb?ssl-mode=REQUIRED
```

### Format 2: With SSL Accept
```
mysql://avnadmin:PASSWORD@mysql-14fe18bd-keertihiremath496-53b7.d.aivencloud.com:26040/defaultdb?sslaccept=strict
```

### Format 3: With SSL Reject Unauthorized False (for testing only)
```
mysql://avnadmin:PASSWORD@mysql-14fe18bd-keertihiremath496-53b7.d.aivencloud.com:26040/defaultdb?ssl={"rejectUnauthorized":false}
```

### Format 4: No SSL (if allowed)
```
mysql://avnadmin:PASSWORD@mysql-14fe18bd-keertihiremath496-53b7.d.aivencloud.com:26040/defaultdb
```

## Verify Connection

After updating the password, test with:

```bash
cd backend
npx prisma db push --accept-data-loss
```

This will:
1. Test the connection
2. Create all tables
3. Show any errors

## Need Help?

If you're still getting errors, please:
1. Reveal the actual password in Aiven
2. Check if your IP is whitelisted
3. Try the Service URI from Aiven console
4. Share the exact error message you're getting
