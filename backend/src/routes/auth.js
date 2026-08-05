const express = require('express');
const router = express.Router();

// 管理后台账号密码（可自行修改）
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'birthday888';

// 登录
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: '请输入用户名和密码' });
  }

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    req.session.isAdmin = true;
    return res.json({ success: true, message: '登录成功' });
  }

  return res.status(401).json({ error: '用户名或密码错误' });
});

// 登出
router.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true, message: '已登出' });
});

// 检查登录状态
router.get('/check', (req, res) => {
  res.json({ isAdmin: !!req.session.isAdmin });
});

module.exports = router;