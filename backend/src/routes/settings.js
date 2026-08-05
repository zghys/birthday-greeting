const express = require('express');
const router = express.Router();
const { queryAll, queryOne, execute } = require('../db');

function requireAdmin(req, res, next) {
  if (!req.session.isAdmin) {
    return res.status(401).json({ error: '未登录' });
  }
  next();
}

// 获取所有设置（公开）
router.get('/', (req, res) => {
  try {
    const rows = queryAll('SELECT * FROM settings');
    const settings = {};
    rows.forEach(r => { settings[r.key] = r.value; });
    res.json(settings);
  } catch (err) {
    console.error('[GET /api/settings] 错误:', err);
    res.status(500).json({ error: '获取设置失败' });
  }
});

// 更新设置（需登录）
router.put('/', requireAdmin, (req, res) => {
  try {
    const updates = req.body; // { key: value, ... }
    for (const [key, value] of Object.entries(updates)) {
      const existing = queryOne('SELECT * FROM settings WHERE key = ?', [key]);
      if (existing) {
        execute('UPDATE settings SET value = ? WHERE key = ?', [String(value), key]);
      } else {
        execute('INSERT INTO settings (key, value) VALUES (?, ?)', [key, String(value)]);
      }
    }
    const rows = queryAll('SELECT * FROM settings');
    const settings = {};
    rows.forEach(r => { settings[r.key] = r.value; });
    res.json(settings);
  } catch (err) {
    console.error('[PUT /api/settings] 错误:', err);
    res.status(500).json({ error: '更新设置失败' });
  }
});

module.exports = router;