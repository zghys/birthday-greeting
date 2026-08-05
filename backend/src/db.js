const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, '..', 'data', 'birthday.db');
let db = null;

function saveDatabase() {
  if (!db) return;
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(DB_PATH, buffer);
}

async function initDatabase() {
  const initSqlJs = require('sql.js');
  const SQL = await initSqlJs();

  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  // 开启外键支持
  db.run('PRAGMA foreign_keys = ON');

  // 创建表
  db.run(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL DEFAULT ''
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS photos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      photo_url TEXT NOT NULL,
      caption TEXT DEFAULT '',
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS visitors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 插入默认设置
  const existing = queryOne("SELECT value FROM settings WHERE key = 'birthday_name'");
  if (!existing) {
    db.run("INSERT INTO settings (key, value) VALUES ('birthday_name', '同学')");
    db.run("INSERT INTO settings (key, value) VALUES ('blessing_message', '祝你生日快乐，愿所有的美好都如期而至！')");
    db.run("INSERT INTO settings (key, value) VALUES ('page_title', '生日快乐')");
    saveDatabase();
  }

  saveDatabase();
  console.log('[DB] 数据库初始化完成');
  return db;
}

function getDb() {
  if (!db) throw new Error('数据库未初始化');
  return db;
}

function queryAll(sql, params = []) {
  const stmt = getDb().prepare(sql);
  if (params.length > 0) stmt.bind(params);
  const rows = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }
  stmt.free();
  return rows;
}

function queryOne(sql, params = []) {
  const stmt = getDb().prepare(sql);
  if (params.length > 0) stmt.bind(params);
  let row = null;
  if (stmt.step()) {
    row = stmt.getAsObject();
  }
  stmt.free();
  return row;
}

function execute(sql, params = []) {
  const db = getDb();
  db.run(sql, params);
  saveDatabase();
  return {
    changes: db.getRowsModified(),
    lastInsertRowid: db.exec("SELECT last_insert_rowid() as id")[0]?.values[0][0]
  };
}

module.exports = { initDatabase, getDb, queryAll, queryOne, execute };