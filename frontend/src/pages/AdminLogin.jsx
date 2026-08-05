import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ADMIN_PASSWORD = 'birthday888';

function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!password.trim()) { setError('请输入密码'); return; }
    setLoading(true);
    // 模拟延迟
    await new Promise(r => setTimeout(r, 500));
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('sb_admin', 'true');
      navigate('/admin/dashboard');
    } else {
      setError('密码错误');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-birthday-bg flex items-center justify-center px-4">
      <div className="stars-bg">
        {Array.from({ length: 40 }, (_, i) => (
          <div key={i} className="star" style={{ left: Math.random() * 100 + '%', top: Math.random() * 100 + '%', width: Math.random() * 3 + 1 + 'px', height: Math.random() * 3 + 1 + 'px', animationDelay: Math.random() * 3 + 's' }} />
        ))}
      </div>
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-birthday-surface/60 backdrop-blur-md rounded-2xl p-8 border border-birthday-purple/20 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-display font-bold bg-gradient-to-r from-birthday-gold to-birthday-pink bg-clip-text text-transparent mb-2">管理后台</h1>
            <p className="text-birthday-muted text-sm">登录后管理祝福内容</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-birthday-text/80 text-sm mb-2">管理员密码</label>
              <input type="password" value={password} onChange={e => { setPassword(e.target.value); setError(''); }}
                className="w-full px-4 py-3 bg-birthday-bg/50 border border-birthday-purple/20 rounded-xl text-birthday-text placeholder-birthday-muted/30 focus:border-birthday-gold/50 focus:ring-1 focus:ring-birthday-gold/30 transition-all" placeholder="请输入密码" autoFocus />
            </div>
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
                <p className="text-red-400 text-sm text-center">{error}</p>
              </div>
            )}
            <button type="submit" disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-birthday-gold to-birthday-pink rounded-xl text-white font-bold text-lg shadow-lg hover:shadow-xl hover:shadow-birthday-gold/20 transition-all duration-300 disabled:opacity-50">
              {loading ? '验证中...' : '登录'}
            </button>
          </form>
          <div className="mt-6 text-center">
            <a href="/" className="text-birthday-muted/50 text-sm hover:text-birthday-muted transition-colors">返回首页</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;