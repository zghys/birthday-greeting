const express = require('express');
const router = express.Router();
const { queryAll, queryOne, execute } = require('../db');

function requireAdmin(req, res, next) {
  if (!req.session.isAdmin) {
    return res.status(401).json({ error: '未登录' });
  }
  next();
}

// 记录访客祝福（公开）
router.post('/', (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: '姓名不能为空' });
    }
    execute('INSERT INTO visitors (name) VALUES (?)', [name.trim()]);
    res.json({ success: true, message: '祝福已记录' });
  } catch (err) {
    console.error('[POST /api/visitors] 错误:', err);
    res.status(500).json({ error: '记录失败' });
  }
});

// 获取所有访客（需登录）
router.get('/', requireAdmin, (req, res) => {
  try {
    const rows = queryAll('SELECT * FROM visitors ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error('[GET /api/visitors] 错误:', err);
    res.status(500).json({ error: '获取访客列表失败' });
  }
});

module.exports = router;