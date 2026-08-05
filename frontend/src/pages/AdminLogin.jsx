import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('请输入用户名和密码');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username: username.trim(), password: password.trim() }),
      });

      const data = await res.json();
      if (res.ok) {
        navigate('/admin/dashboard');
      } else {
        setError(data.error || '登录失败');
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-birthday-bg flex items-center justify-center px-4">
      {/* 星星背景 */}
      <div className="stars-bg">
        {Array.from({ length: 40 }, (_, i) => (
          <div
            key={i}
            className="star"
            style={{
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              width: Math.random() * 3 + 1 + 'px',
              height: Math.random() * 3 + 1 + 'px',
              animationDelay: Math.random() * 3 + 's',
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-birthday-surface/60 backdrop-blur-md rounded-2xl p-8 border border-birthday-purple/20 shadow-2xl">
          {/* 标题 */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-display font-bold bg-gradient-to-r from-birthday-gold to-birthday-pink bg-clip-text text-transparent mb-2">
              管理后台
            </h1>
            <p className="text-birthday-muted text-sm">登录后管理祝福内容</p>
          </div>

          {/* 表单 */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-birthday-text/80 text-sm mb-2">用户名</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-birthday-bg/50 border border-birthday-purple/20 rounded-xl text-birthday-text placeholder-birthday-muted/30 focus:border-birthday-gold/50 focus:ring-1 focus:ring-birthday-gold/30 transition-all"
                placeholder="请输入用户名"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-birthday-text/80 text-sm mb-2">密码</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-birthday-bg/50 border border-birthday-purple/20 rounded-xl text-birthday-text placeholder-birthday-muted/30 focus:border-birthday-gold/50 focus:ring-1 focus:ring-birthday-gold/30 transition-all"
                placeholder="请输入密码"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
                <p className="text-red-400 text-sm text-center">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-birthday-gold to-birthday-pink rounded-xl text-white font-bold text-lg shadow-lg hover:shadow-xl hover:shadow-birthday-gold/20 transition-all duration-300 disabled:opacity-50"
            >
              {loading ? '登录中...' : '登录'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-birthday-muted/50 text-sm hover:text-birthday-muted transition-colors"
            >
              返回首页
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;