@echo off
echo ========================================
echo   Aarogya Sahayak - Quick Setup
echo ========================================
echo.
echo This will install all dependencies for the project.
echo This may take several minutes...
echo.
pause

REM Install Backend Dependencies
echo [1/3] Installing Backend Dependencies...
cd /d "%~dp0server"
call npm install
if errorlevel 1 (
    echo ERROR: Backend installation failed!
    pause
    exit /b 1
)
echo Backend dependencies installed successfully!
echo.

REM Install Frontend Dependencies
echo [2/3] Installing Frontend Dependencies...
cd /d "%~dp0client"
call npm install
if errorlevel 1 (
    echo ERROR: Frontend installation failed!
    pause
    exit /b 1
)
echo Frontend dependencies installed successfully!
echo.

REM Install ML Service Dependencies (if Python is available)
echo [3/3] Installing ML Service Dependencies...
cd /d "%~dp0ml-service"
if exist "requirements.txt" (
    python --version >nul 2>&1
    if errorlevel 1 (
        echo Python not found. Skipping ML service installation.
        echo You can install Python later from https://www.python.org/
    ) else (
        pip install -r requirements.txt
        if errorlevel 1 (
            echo WARNING: ML service installation failed. You can skip this for now.
        ) else (
            echo ML service dependencies installed successfully!
        )
    )
) else (
    echo ML service requirements.txt not found, skipping...
)
echo.

REM Seed Database
echo.
echo ========================================
echo   Seeding Database with Sample Data
echo ========================================
cd /d "%~dp0server"
echo Seeding symptoms...
node scripts/seedSymptoms.js
echo.
echo Seeding hospitals...
node scripts/seedHospitals.js
echo.

echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo You can now start the application by running start.bat
echo.
pause
