# 部署到 Render 云平台（免费 · 永久在线）

## 前置准备

- 一个 **GitHub** 账号（如果没有，去 https://github.com 免费注册，5分钟）
- 本项目的代码

---

## 第一步：上传代码到 GitHub

### 1.1 登录 GitHub，创建一个新仓库

1. 打开 https://github.com 并登录
2. 点击右上角 `+` → `New repository`
3. 仓库名填 `birthday-greeting`
4. 选择 **Public**（公开，免费）
5. 点击 `Create repository`

### 1.2 上传代码

创建完仓库后，你会看到一个页面，选择 **"uploading an existing file"** 或直接拖拽上传：

1. 解压 `birthday-deploy.tar.gz` 得到 `birthday-greeting` 文件夹
2. 把整个文件夹拖到 GitHub 的上传区域
3. 拉到页面底部，点击 `Commit changes`

---

## 第二步：部署到 Render

### 2.1 注册 Render

1. 打开 https://render.com
2. 点击右上角 `Sign Up`，选择 **"Sign up with GitHub"**
3. 授权后自动登录

### 2.2 创建 Web Service

1. 登录 Render 后，点击 Dashboard 上的 `New +` → `Web Service`
2. 点击 `Connect a repository`，授权 GitHub
3. 找到刚创建的 `birthday-greeting` 仓库，点击 `Connect`

### 2.3 配置服务参数

| 参数 | 填写值 |
|------|--------|
| Name | `birthday-greeting`（自动生成） |
| Region | 选 `Singapore`（新加坡，国内访问快） |
| Runtime | `Node` |
| Branch | `main` |
| Build Command | `cd frontend && npm install && npm run build && cd ../backend && npm install` |
| Start Command | `cd backend && node src/index.js` |
| Instance Type | **Free**（免费） |

### 2.4 点击底部 `Create Web Service`

等待 3-5 分钟，Render 会自动构建并部署。

---

## 第三步：获取公网地址

部署完成后，Render 会给你一个域名：

```
https://birthday-greeting.onrender.com
```

这就是**永久有效的公网地址**，发给同学随便访问。

---

## 管理后台

```
https://birthday-greeting.onrender.com/admin/login
```

- 用户名：`admin`
- 密码：`birthday888`

---

## 注意事项

| 问题 | 说明 |
|------|------|
| 免费版休眠 | Render 免费版 15 分钟无人访问会休眠，再次访问时需等待 10-30 秒唤醒 |
| 数据持久化 | 免费版数据存储在 SQLite 文件中，重启后数据保留 |
| 照片上传 | 照片会上传到服务器，免费版有 512MB 存储空间，足够使用 |
| 升级 | 如果需要不休眠，可升级到 $7/月的付费版 |

---

## 本地电脑也可以继续用

部署到云上后，你本地电脑可以关掉后端服务。如果想在本地修改内容，再按原来的方式启动就行：

```
cd backend && node src/index.js
```

然后访问 http://localhost:3001 进行管理。