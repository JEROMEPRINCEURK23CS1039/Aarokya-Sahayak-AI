@echo off
echo ========================================
echo   Aarogya Sahayak - Stopping Services
echo ========================================
echo.

REM Kill Node processes (Backend & Frontend)
echo Stopping Node.js services...
taskkill /F /IM node.exe /T 2>nul
if errorlevel 1 (
    echo No Node.js processes found
) else (
    echo Node.js services stopped
)
echo.

REM Kill Python processes (ML Service)
echo Stopping Python ML service...
taskkill /F /IM python.exe /T 2>nul
if errorlevel 1 (
    echo No Python processes found
) else (
    echo Python services stopped
)
echo.

echo ========================================
echo   All Services Stopped
echo ========================================
echo.
pause
