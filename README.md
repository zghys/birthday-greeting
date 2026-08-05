# 生日祝福网页

为同学制作的生日祝福互动页面，支持姓名输入→祝福弹窗→爱心墙相册的完整流程。

## 功能

- **🎂 祝福首页**：同学打开网页，输入自己的名字，弹出祝福动画（带五彩纸屑和飘落花瓣）
- **❤️ 爱心墙**：祝福后展示照片墙，照片由管理员在后台管理上传
- **⚙️ 管理后台**：可设置寿星姓名、祝福语、页面标题；上传/删除爱心墙照片；查看祝福记录

## 访问地址

- **首页**：http://localhost:5173
- **管理后台**：http://localhost:5173/admin/login

## 管理员登录

| 字段 | 值 |
|------|------|
| 用户名 | `admin` |
| 密码 | `birthday888` |

## 快速开始

### 环境要求
- Node.js 18+
- npm

### 启动步骤

```bash
# 1. 启动后端（端口 3001）
cd backend
npm install
npm run dev

# 2. 新开终端，启动前端（端口 5173）
cd frontend
npm install
npm run dev
```

### 使用流程

1. 访问 http://localhost:5173 进入首页
2. 同学输入自己的名字，点击"送出祝福"
3. 弹出祝福动画，点击"查看爱心墙"进入相册
4. 管理员登录后台，在"页面设置"中修改寿星姓名和祝福语
5. 在"爱心墙照片"中上传照片，配文字描述

## 目录结构

```
birthday-greeting/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx              # 首页（输入名字→祝福弹窗→爱心墙）
│   │   │   ├── AdminLogin.jsx        # 管理员登录
│   │   │   └── AdminDashboard.jsx    # 管理面板（照片/设置/访客记录）
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── tailwind.config.js
├── backend/
│   ├── src/
│   │   ├── index.js                  # 服务入口 + 文件上传
│   │   ├── db.js                     # SQLite 数据库
│   │   └── routes/
│   │       ├── auth.js               # 登录/登出/鉴权
│   │       ├── settings.js           # 页面设置 CRUD
│   │       ├── photos.js             # 爱心墙照片管理
│   │       └── visitors.js           # 访客祝福记录
│   ├── uploads/                      # 上传照片存储
│   └── package.json
└── README.md
```

## 技术栈

- **前端**：React 18 + Vite 5 + Tailwind CSS 3
- **后端**：Express + sql.js (SQLite WebAssembly)
- **存储**：本地文件系统（照片）+ SQLite 数据库（数据）

## 自定义

- 修改管理员密码：编辑 `backend/src/routes/auth.js` 中的 `ADMIN_PASSWORD`
- 修改配色：编辑 `frontend/tailwind.config.js` 中的 `colors`