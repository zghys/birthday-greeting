@echo off
chcp 65001 >nul
title 生日祝福网页 - 启动器

echo ========================================
echo    生日祝福网页 - 启动器
echo ========================================
echo.

:: 获取脚本所在目录
set "ROOT_DIR=%~dp0.."
cd /d "%ROOT_DIR%"

:: 检查后端是否已运行
echo [1/3] 检查后端服务...
curl -s -o nul http://localhost:3001/api/settings
if %ERRORLEVEL% equ 0 (
    echo [OK] 后端服务已在运行
) else (
    echo [..] 启动后端服务...
    start /B "Birthday-Backend" cmd /c "cd /d backend && node src/index.js"
    timeout /t 5 /nobreak >nul
    echo [OK] 后端服务已启动
)

:: 检查前端构建
echo [2/3] 检查前端构建...
if exist "frontend\dist\index.html" (
    echo [OK] 前端已构建
) else (
    echo [..] 构建前端...
    cd /d "%ROOT_DIR%\frontend"
    call npx vite build
    cd /d "%ROOT_DIR%"
    echo [OK] 前端构建完成
)

:: 启动隧道
echo [3/3] 启动公网隧道...
echo.
echo 隧道连接中，请稍候...
echo.

:: 使用 Serveo 隧道
ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=30 -R 80:localhost:3001 serveo.net

echo.
echo 隧道已断开，按任意键退出...
pause >nul