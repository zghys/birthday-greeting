# 基于 Node.js 镜像
FROM node:20-slim

WORKDIR /app

# 复制后端
COPY backend/ ./backend/
COPY frontend/package.json frontend/package-lock.json ./frontend/
COPY frontend/ ./frontend/

# 安装依赖并构建前端
RUN cd frontend && npm install && npm run build && cd ../backend && npm install

# 暴露端口
EXPOSE 3001

# 启动命令
CMD ["node", "backend/src/index.js"]