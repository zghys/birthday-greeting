const express = require('express');
const cors = require('cors');
const session = require('express-session');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { initDatabase } = require('./db');
const authRoutes = require('./routes/auth');
const settingsRoutes = require('./routes/settings');
const photoRoutes = require('./routes/photos');
const visitorRoutes = require('./routes/visitors');

const app = express();
const PORT = process.env.PORT || 3001;

// 确保 uploads 目录存在
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// 文件上传配置
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = Date.now() + '-' + Math.random().toString(36).substring(2, 8) + ext;
    cb(null, name);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = /\.(jpg|jpeg|png|gif|webp)$/i;
    if (allowed.test(path.extname(file.originalname))) {
      cb(null, true);
    } else {
      cb(new Error('仅支持 jpg、png、gif、webp 格式图片'));
    }
  }
});

// 中间件
app.use(cors({
  origin: (origin, callback) => {
    // 允许所有 localhost 和局域网 IP 访问
    const allowed = !origin || origin.startsWith('http://localhost') || origin.startsWith('http://192.168.') || origin.startsWith('http://127.0.0.1') || origin.startsWith('http://10.') || origin.startsWith('http://172.');
    callback(null, allowed);
  },
  credentials: true
}));
app.use(express.json());
app.use(session({
  secret: 'birthday-secret-key-2024',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// 静态文件服务
app.use('/uploads', express.static(uploadsDir));

// 文件上传接口
app.post('/api/upload', (req, res) => {
  upload.single('photo')(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ error: '文件大小不能超过 10MB' });
        }
        return res.status(400).json({ error: err.message });
      }
      return res.status(400).json({ error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ error: '请选择要上传的图片' });
    }
    res.json({
      url: '/uploads/' + req.file.filename,
      filename: req.file.filename
    });
  });
});

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/photos', photoRoutes);
app.use('/api/visitors', visitorRoutes);

// 服务前端构建产物
const frontendDist = path.join(__dirname, '..', '..', 'frontend', 'dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  // SPA 回退：非 API 路由返回 index.html
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api/') && !req.path.startsWith('/uploads/')) {
      res.sendFile(path.join(frontendDist, 'index.html'));
    } else {
      res.status(404).json({ error: 'Not found' });
    }
  });
  console.log('[Server] 前端静态文件已加载');
}

// 初始化数据库并启动
initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`[Server] 后端服务已启动: http://localhost:${PORT}`);
    console.log(`[Server] 上传目录: ${uploadsDir}`);
  });
});