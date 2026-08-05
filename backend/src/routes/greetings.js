const express = require('express');
const router = express.Router();
const { queryAll, queryOne, execute } = require('../db');

// 认证中间件
function requireAdmin(req, res, next) {
  if (!req.session.isAdmin) {
    return res.status(401).json({ error: '未登录，请先登录' });
  }
  next();
}

// 获取所有祝福（公开）
router.get('/', (req, res) => {
  try {
    const rows = queryAll('SELECT * FROM greetings ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error('[GET /api/greetings] 错误:', err);
    res.status(500).json({ error: '获取祝福列表失败' });
  }
});

// 获取单条祝福（公开）
router.get('/:id', (req, res) => {
  try {
    const row = queryOne('SELECT * FROM greetings WHERE id = ?', [req.params.id]);
    if (!row) {
      return res.status(404).json({ error: '祝福记录不存在' });
    }
    res.json(row);
  } catch (err) {
    console.error('[GET /api/greetings/:id] 错误:', err);
    res.status(500).json({ error: '获取祝福失败' });
  }
});

// 添加新祝福（需登录）
router.post('/', requireAdmin, (req, res) => {
  try {
    const { name, message, photo } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: '姓名不能为空' });
    }

    const result = execute(
      'INSERT INTO greetings (name, photo, message) VALUES (?, ?, ?)',
      [name.trim(), photo || '', message || '']
    );

    const newRow = queryOne('SELECT * FROM greetings WHERE id = ?', [result.lastInsertRowid]);
    res.status(201).json(newRow);
  } catch (err) {
    console.error('[POST /api/greetings] 错误:', err);
    res.status(500).json({ error: '添加祝福失败' });
  }
});

// 更新祝福（需登录）
router.put('/:id', requireAdmin, (req, res) => {
  try {
    const { name, message, photo } = req.body;
    const existing = queryOne('SELECT * FROM greetings WHERE id = ?', [req.params.id]);
    if (!existing) {
      return res.status(404).json({ error: '祝福记录不存在' });
    }

    execute(
      'UPDATE greetings SET name = ?, photo = ?, message = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [
        name !== undefined ? name : existing.name,
        photo !== undefined ? photo : existing.photo,
        message !== undefined ? message : existing.message,
        req.params.id
      ]
    );

    const updated = queryOne('SELECT * FROM greetings WHERE id = ?', [req.params.id]);
    res.json(updated);
  } catch (err) {
    console.error('[PUT /api/greetings/:id] 错误:', err);
    res.status(500).json({ error: '更新祝福失败' });
  }
});

// 删除祝福（需登录）
router.delete('/:id', requireAdmin, (req, res) => {
  try {
    const existing = queryOne('SELECT * FROM greetings WHERE id = ?', [req.params.id]);
    if (!existing) {
      return res.status(404).json({ error: '祝福记录不存在' });
    }

    execute('DELETE FROM greetings WHERE id = ?', [req.params.id]);

    // 如果有关联照片，尝试删除文件
    if (existing.photo && existing.photo.startsWith('/uploads/')) {
      const fs = require('fs');
      const path = require('path');
      const filePath = path.join(__dirname, '..', '..', existing.photo);
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (e) {
        // 文件删除失败不影响主流程
      }
    }

    res.json({ success: true, message: '已删除' });
  } catch (err) {
    console.error('[DELETE /api/greetings/:id] 错误:', err);
    res.status(500).json({ error: '删除祝福失败' });
  }
});

module.exports = router;