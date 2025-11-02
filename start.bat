@echo off
echo ========================================
echo   Aarogya Sahayak - Starting Application
echo ========================================
echo.

REM Check if MongoDB is running
echo [1/4] Checking MongoDB status...
sc query MongoDB | find "RUNNING" >nul
if errorlevel 1 (
    echo MongoDB is not running. Starting MongoDB...
    net start MongoDB
    timeout /t 3 /nobreak >nul
) else (
    echo MongoDB is already running
)
echo.

REM Start Backend Server
echo [2/4] Starting Backend Server...
start "Aarogya Backend" cmd /k "cd /d "%~dp0server" && npm run dev"
timeout /t 5 /nobreak >nul
echo Backend server starting on http://localhost:5000
echo.

REM Start ML Service (if available)
echo [3/4] Checking ML Service...
if exist "%~dp0ml-service\app.py" (
    REM Hint ML service where the model files are located (project root by default)
    set "AAROGYA_ML_MODELS_DIR=%~dp0"
    start "Aarogya ML Service" cmd /k "cd /d "%~dp0ml-service" && set AAROGYA_ML_MODELS_DIR=%~dp0 && py app.py"
    timeout /t 3 /nobreak >nul
    echo ML service starting on http://localhost:5001
) else (
    echo ML service not found, skipping...
)
echo.

REM Start Frontend
echo [4/4] Starting Frontend...
start "Aarogya Frontend" cmd /k "cd /d "%~dp0client" && npm run dev"
timeout /t 3 /nobreak >nul
echo Frontend starting on http://localhost:5173
echo.

echo ========================================
echo   All Services Started Successfully!
echo ========================================
echo.
echo   Backend:  http://localhost:5000
echo   Frontend: http://localhost:5173
echo   ML API:   http://localhost:5001
echo.
echo ========================================
echo All services are starting in new windows!
echo.
echo Please wait 10-15 seconds for services to be ready.
echo Opening browser to: http://localhost:5173
echo.
echo Backend:  http://localhost:5000/api/health
echo Frontend: http://localhost:5173
echo.
echo To stop all services: Run stop.bat or close the terminal windows
echo ========================================
echo.

REM Wait a moment then open browser
timeout /t 2 /nobreak >nul
start http://localhost:5173
