const express = require('express');
const router = express.Router();
const { queryAll, queryOne, execute } = require('../db');
const fs = require('fs');
const path = require('path');

function requireAdmin(req, res, next) {
  if (!req.session.isAdmin) {
    return res.status(401).json({ error: '未登录' });
  }
  next();
}

// 获取所有照片（公开）
router.get('/', (req, res) => {
  try {
    const rows = queryAll('SELECT * FROM photos ORDER BY sort_order ASC, created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error('[GET /api/photos] 错误:', err);
    res.status(500).json({ error: '获取照片列表失败' });
  }
});

// 添加照片（需登录）
router.post('/', requireAdmin, (req, res) => {
  try {
    const { photo_url, caption, sort_order } = req.body;
    if (!photo_url) {
      return res.status(400).json({ error: '照片URL不能为空' });
    }
    const result = execute(
      'INSERT INTO photos (photo_url, caption, sort_order) VALUES (?, ?, ?)',
      [photo_url, caption || '', sort_order !== undefined ? sort_order : 0]
    );
    const newRow = queryOne('SELECT * FROM photos WHERE id = ?', [result.lastInsertRowid]);
    res.status(201).json(newRow);
  } catch (err) {
    console.error('[POST /api/photos] 错误:', err);
    res.status(500).json({ error: '添加照片失败' });
  }
});

// 更新照片（需登录）
router.put('/:id', requireAdmin, (req, res) => {
  try {
    const { caption, sort_order } = req.body;
    const existing = queryOne('SELECT * FROM photos WHERE id = ?', [req.params.id]);
    if (!existing) {
      return res.status(404).json({ error: '照片不存在' });
    }
    execute(
      'UPDATE photos SET caption = ?, sort_order = ? WHERE id = ?',
      [
        caption !== undefined ? caption : existing.caption,
        sort_order !== undefined ? sort_order : existing.sort_order,
        req.params.id
      ]
    );
    const updated = queryOne('SELECT * FROM photos WHERE id = ?', [req.params.id]);
    res.json(updated);
  } catch (err) {
    console.error('[PUT /api/photos/:id] 错误:', err);
    res.status(500).json({ error: '更新照片失败' });
  }
});

// 删除照片（需登录）
router.delete('/:id', requireAdmin, (req, res) => {
  try {
    const existing = queryOne('SELECT * FROM photos WHERE id = ?', [req.params.id]);
    if (!existing) {
      return res.status(404).json({ error: '照片不存在' });
    }
    execute('DELETE FROM photos WHERE id = ?', [req.params.id]);

    // 尝试删除关联文件
    if (existing.photo_url && existing.photo_url.startsWith('/uploads/')) {
      const filePath = path.join(__dirname, '..', '..', existing.photo_url);
      try {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      } catch (e) { /* ignore */ }
    }

    res.json({ success: true, message: '已删除' });
  } catch (err) {
    console.error('[DELETE /api/photos/:id] 错误:', err);
    res.status(500).json({ error: '删除照片失败' });
  }
});

module.exports = router;