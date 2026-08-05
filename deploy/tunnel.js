/**
 * 隧道管理脚本 - 自动创建并维护公网隧道
 * 使用 Serveo.net 免费 SSH 隧道服务
 * 
 * 用法: node tunnel.js
 * 
 * 隧道断开后会自动重连，URL 会变化
 * 当前 URL 保存在 tunnel-url.txt 文件中
 */

const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const http = require('http');

const TUNNEL_URL_FILE = path.join(__dirname, 'tunnel-url.txt');
const BACKEND_PORT = 3001;
const RECONNECT_DELAY = 5000; // 5秒后重连

let tunnelProcess = null;
let currentUrl = '';

// 检查后端是否在运行
function checkBackend() {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${BACKEND_PORT}/api/settings`, (res) => {
      resolve(res.statusCode === 200);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(3000, () => { req.destroy(); resolve(false); });
  });
}

// 启动隧道
function startTunnel() {
  if (tunnelProcess) {
    try { tunnelProcess.kill(); } catch (e) {}
    tunnelProcess = null;
  }

  console.log('[Tunnel] 正在创建公网隧道...');

  tunnelProcess = spawn('ssh', [
    '-o', 'StrictHostKeyChecking=no',
    '-o', 'ServerAliveInterval=30',
    '-o', 'ServerAliveCountMax=3',
    '-R', `80:localhost:${BACKEND_PORT}`,
    'serveo.net'
  ], {
    stdio: ['pipe', 'pipe', 'pipe']
  });

  tunnelProcess.stdout.on('data', (data) => {
    const text = data.toString();
    console.log('[Tunnel]', text.trim());

    // 提取 URL
    const match = text.match(/https:\/\/[a-z0-9-]+\.serveousercontent\.com/);
    if (match) {
      currentUrl = match[0];
      fs.writeFileSync(TUNNEL_URL_FILE, currentUrl);
      console.log('\n========================================');
      console.log('  ✅ 公网地址已就绪！');
      console.log(`  ${currentUrl}`);
      console.log('========================================\n');
    }
  });

  tunnelProcess.stderr.on('data', (data) => {
    const text = data.toString();
    // Serveo 把 URL 输出到 stderr
    console.log('[Tunnel]', text.trim());
    const match = text.match(/https:\/\/[a-z0-9-]+\.serveousercontent\.com/);
    if (match) {
      currentUrl = match[0];
      fs.writeFileSync(TUNNEL_URL_FILE, currentUrl);
      console.log('\n========================================');
      console.log('  ✅ 公网地址已就绪！');
      console.log(`  ${currentUrl}`);
      console.log('========================================\n');
    }
  });

  tunnelProcess.on('exit', (code) => {
    console.log(`[Tunnel] 隧道已断开 (exit code: ${code})`);
    console.log(`[Tunnel] ${RECONNECT_DELAY / 1000}秒后自动重连...`);
    setTimeout(startTunnel, RECONNECT_DELAY);
  });
}

// 主流程
async function main() {
  console.log('========================================');
  console.log('  生日祝福网页 - 公网隧道管理器');
  console.log('========================================\n');

  // 检查后端
  const backendRunning = await checkBackend();
  if (!backendRunning) {
    console.log('[Error] 后端服务未启动！');
    console.log(`请先确保后端在端口 ${BACKEND_PORT} 上运行`);
    console.log('启动命令: cd backend && node src/index.js\n');
    process.exit(1);
  }

  console.log(`[OK] 后端服务运行中 (端口 ${BACKEND_PORT})\n`);

  // 启动隧道
  startTunnel();

  // 读取已有的 URL
  if (fs.existsSync(TUNNEL_URL_FILE)) {
    const oldUrl = fs.readFileSync(TUNNEL_URL_FILE, 'utf-8').trim();
    if (oldUrl) {
      console.log(`[Info] 上次的公网地址: ${oldUrl}`);
      console.log('[Info] 注意: 隧道重启后地址可能变化\n');
    }
  }

  console.log('按 Ctrl+C 停止隧道\n');
}

main().catch(console.error);