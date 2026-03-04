@echo off
echo Setting up LMS Backend...
echo.

echo Step 1: Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Failed to install dependencies
    pause
    exit /b %errorlevel%
)

echo.
echo Step 2: Generating Prisma Client...
timeout /t 2 /nobreak >nul
call npx prisma generate
if %errorlevel% neq 0 (
    echo Failed to generate Prisma client
    echo Please close any running processes and try again
    pause
    exit /b %errorlevel%
)

echo.
echo Step 3: Running database migrations...
call npx prisma migrate deploy
if %errorlevel% neq 0 (
    echo Failed to run migrations
    pause
    exit /b %errorlevel%
)

echo.
echo Step 4: Seeding database...
call npx tsx prisma/seed.ts
if %errorlevel% neq 0 (
    echo Failed to seed database
    pause
    exit /b %errorlevel%
)

echo.
echo ========================================
echo Setup completed successfully!
echo ========================================
echo.
echo You can now run: npm run dev
echo.
pause
