@echo off
echo ================================================
echo   GITHUB SETUP SCRIPT
echo ================================================
echo.

echo Step 1: Checking Git installation...
where git >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Git is not installed!
    echo Please install Git from: https://git-scm.com/download/win
    pause
    exit /b 1
)
echo [OK] Git is installed

echo.
echo Step 2: Initializing Git repository...
if exist .git (
    echo [OK] Git repository already initialized
) else (
    git init
    echo [OK] Git repository initialized
)

echo.
echo Step 3: Checking .gitignore...
if exist .gitignore (
    echo [OK] .gitignore exists
) else (
    echo [WARNING] .gitignore not found
)

echo.
echo Step 4: Adding files to Git...
git add .
echo [OK] Files staged

echo.
echo Step 5: Creating first commit...
git commit -m "Initial commit: Healthcare AI Application"
if %ERRORLEVEL% EQU 0 (
    echo [OK] Commit created
) else (
    echo [WARNING] Commit may have failed or nothing to commit
)

echo.
echo ================================================
echo   SETUP COMPLETE!
echo ================================================
echo.
echo NEXT STEPS:
echo.
echo 1. Go to GitHub.com and create a new repository
echo 2. Copy the repository URL
echo 3. Run this command (replace with your URL):
echo    git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
echo 4. Push to GitHub:
echo    git branch -M main
echo    git push -u origin main
echo.
echo Full guide available in: GITHUB_HOSTING_GUIDE.md
echo.
pause
