@echo off
cls
echo ===================================================
echo   New Morning Star School - Website & ERP Portal
echo ===================================================
echo.

if not exist node_modules (
    echo [INFO] node_modules not found. Installing dependencies...
    call npm install
)

echo [INFO] Starting development server...
npm run dev

if %ERRORLEVEL% neq 0 (
    echo.
    echo [ERROR] Failed to start the server. 
    echo [TIP] Try running 'npm install' manually.
)

pause
