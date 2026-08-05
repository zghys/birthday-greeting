import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const ADMIN_PASSWORD = 'birthday888';

function AdminDashboard() {
  const [tab, setTab] = useState('photos');
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const isAdmin = sessionStorage.getItem('sb_admin') === 'true';
    if (!isAdmin) { navigate('/admin/login'); return; }
    setChecking(false);
    setLoading(false);
  }, [navigate]);

  if (checking) {
    return (
      <div className="min-h-screen bg-birthday-bg flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-birthday-purple border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-birthday-bg">
      <header className="bg-birthday-surface/60 backdrop-blur-md border-b border-birthday-purple/20 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-display font-bold bg-gradient-to-r from-birthday-gold to-birthday-pink bg-clip-text text-transparent">管理后台</h1>
          <div className="flex items-center gap-4">
            <a href="/" target="_blank" className="text-birthday-muted/60 hover:text-birthday-muted text-sm transition-colors">查看首页</a>
            <button onClick={() => { sessionStorage.removeItem('sb_admin'); navigate('/admin/login'); }}
              className="text-birthday-muted/60 hover:text-birthday-pink text-sm transition-colors">退出</button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 pt-6">
        <div className="flex gap-1 bg-birthday-surface/30 rounded-xl p-1 border border-birthday-purple/10">
          {[
            { key: 'photos', label: '❤️ 爱心墙照片' },
            { key: 'settings', label: '⚙️ 页面设置' },
            { key: 'visitors', label: '👥 祝福记录' },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${tab === t.key ? 'bg-birthday-purple/20 text-birthday-purple shadow-sm' : 'text-birthday-muted/50 hover:text-birthday-muted'}`}
            >{t.label}</button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {tab === 'photos' && <PhotoManager />}
        {tab === 'settings' && <SettingsManager />}
        {tab === 'visitors' && <VisitorLog />}
      </div>
    </div>
  );
}

/* ====== 照片管理 ====== */
function PhotoManager() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchPhotos = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('photos').select('*').order('sort_order', { ascending: true }).order('created_at', { ascending: false });
    if (data) setPhotos(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchPhotos(); }, [fetchPhotos]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${file.name.split('.').pop()}`;
    const { error } = await supabase.storage.from('照片').upload(fileName, file);
    if (error) { alert('上传失败: ' + error.message); setUploading(false); return; }
    const { data: { publicUrl } } = supabase.storage.from('照片').getPublicUrl(fileName);
    alert('照片上传成功！请添加描述后点击"确认添加"');
    setUploading(false);
    // 保存到 global 以便后续使用
    window._lastUploadUrl = publicUrl;
  };

  const handleAdd = async () => {
    const url = window._lastUploadUrl;
    if (!url) { alert('请先上传照片'); return; }
    const { error } = await supabase.from('photos').insert({
      photo_url: url,
      caption: caption.trim(),
      sort_order: photos.length,
    });
    if (error) { alert('添加失败: ' + error.message); return; }
    setShowAdd(false); setCaption(''); window._lastUploadUrl = '';
    fetchPhotos();
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from('photos').delete().eq('id', id);
    if (error) { alert('删除失败: ' + error.message); return; }
    setDeleteConfirm(null);
    fetchPhotos();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-birthday-text">爱心墙照片</h2>
        <button onClick={() => setShowAdd(true)}
          className="px-5 py-2 bg-gradient-to-r from-birthday-gold to-birthday-pink rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transition-all">+ 添加照片</button>
      </div>

      {showAdd && (
        <div className="bg-birthday-surface/40 rounded-xl p-6 border border-birthday-purple/20 mb-6">
          <h3 className="text-lg font-bold text-birthday-gold mb-4">添加新照片</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-birthday-text/80 text-sm mb-2">上传照片</label>
              <label className="inline-block cursor-pointer px-5 py-2.5 bg-birthday-purple/15 border border-birthday-purple/30 rounded-xl text-birthday-purple text-sm hover:bg-birthday-purple/25 transition-colors">
                {uploading ? '上传中...' : '选择图片'}
                <input type="file" accept="image/jpeg,image/png,image/gif,image/webp" onChange={handleUpload} className="hidden" disabled={uploading} />
              </label>
              {window._lastUploadUrl && (
                <div className="mt-3 flex items-center gap-3">
                  <img src={window._lastUploadUrl} alt="preview" className="w-20 h-20 rounded-lg object-cover border border-birthday-purple/20" />
                  <span className="text-birthday-muted/60 text-xs">上传成功 ✓</span>
                </div>
              )}
            </div>
            <div>
              <label className="block text-birthday-text/80 text-sm mb-2">照片描述（可选）</label>
              <input type="text" value={caption} onChange={e => setCaption(e.target.value)}
                className="w-full px-4 py-2.5 bg-birthday-bg/50 border border-birthday-purple/20 rounded-xl text-birthday-text placeholder-birthday-muted/30 focus:border-birthday-gold/50 transition-all" placeholder="给这张照片配一句话..." />
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setShowAdd(false); setCaption(''); window._lastUploadUrl = ''; }}
                className="px-5 py-2 bg-birthday-bg/50 border border-birthday-purple/20 rounded-xl text-birthday-muted hover:bg-birthday-bg/70 transition-colors">取消</button>
              <button onClick={handleAdd}
                className="px-5 py-2 bg-gradient-to-r from-birthday-gold to-birthday-pink rounded-xl text-white font-semibold">确认添加</button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-10 h-10 border-4 border-birthday-purple border-t-transparent rounded-full animate-spin" /></div>
      ) : photos.length === 0 ? (
        <div className="text-center py-16 bg-birthday-surface/20 rounded-2xl border border-birthday-purple/10">
          <p className="text-birthday-muted/60 text-lg mb-4">还没有照片</p>
          <button onClick={() => setShowAdd(true)} className="px-5 py-2 bg-birthday-purple/20 border border-birthday-purple/40 rounded-lg text-birthday-purple hover:bg-birthday-purple/30 transition-colors">上传第一张照片</button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map(photo => (
            <div key={photo.id} className="group relative rounded-xl overflow-hidden bg-birthday-surface/40 border border-birthday-purple/10 hover:border-birthday-pink/30 transition-all">
              <div className="aspect-square overflow-hidden">
                <img src={photo.photo_url} alt={photo.caption || ''} className="w-full h-full object-cover" loading="lazy"
                  onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.classList.add('flex', 'items-center', 'justify-center', 'bg-birthday-surface'); e.target.parentElement.innerHTML = '<span class="text-3xl">📷</span>'; }} />
              </div>
              <div className="p-3">
                <p className="text-birthday-text/70 text-sm truncate">{photo.caption || '(无描述)'}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-birthday-muted/30 text-xs">#{photo.sort_order}</span>
                  <button onClick={() => setDeleteConfirm(photo)} className="text-red-400/50 hover:text-red-400 text-xs transition-colors">删除</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-birthday-surface rounded-2xl p-8 w-full max-w-sm border border-birthday-purple/20 shadow-2xl text-center" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-birthday-text mb-3">确认删除</h3>
            <p className="text-birthday-muted mb-6">删除后无法恢复，确定要删除这张照片吗？</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 bg-birthday-bg/50 border border-birthday-purple/20 rounded-xl text-birthday-muted hover:bg-birthday-bg/70 transition-colors">取消</button>
              <button onClick={() => handleDelete(deleteConfirm.id)} className="flex-1 py-2.5 bg-red-500/20 border border-red-500/40 rounded-xl text-red-400 font-semibold hover:bg-red-500/30 transition-colors">确认删除</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ====== 页面设置 ====== */
function SettingsManager() {
  const [settings, setSettings] = useState({ birthday_name: '', blessing_message: '', page_title: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('settings').select('*');
      if (data) {
        const s = {};
        data.forEach(r => { s[r.key] = r.value; });
        setSettings({ birthday_name: s.birthday_name || '', blessing_message: s.blessing_message || '', page_title: s.page_title || '' });
      }
      setLoading(false);
    }
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    for (const [key, value] of Object.entries(settings)) {
      await supabase.from('settings').upsert({ key, value }, { onConflict: 'key' });
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (loading) return <div className="flex justify-center py-16"><div className="w-10 h-10 border-4 border-birthday-purple border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-birthday-text mb-6">⚙️ 页面设置</h2>
      <div className="bg-birthday-surface/40 rounded-xl p-6 border border-birthday-purple/20 space-y-5">
        <div>
          <label className="block text-birthday-text/80 text-sm mb-2">寿星姓名</label>
          <input type="text" value={settings.birthday_name} onChange={e => setSettings(p => ({ ...p, birthday_name: e.target.value }))}
            className="w-full px-4 py-3 bg-birthday-bg/50 border border-birthday-purple/20 rounded-xl text-birthday-text focus:border-birthday-gold/50 transition-all" placeholder="如：小明" />
        </div>
        <div>
          <label className="block text-birthday-text/80 text-sm mb-2">祝福语</label>
          <textarea value={settings.blessing_message} onChange={e => setSettings(p => ({ ...p, blessing_message: e.target.value }))}
            className="w-full px-4 py-3 bg-birthday-bg/50 border border-birthday-purple/20 rounded-xl text-birthday-text focus:border-birthday-gold/50 transition-all resize-none" rows={3} placeholder="输入祝福语..." />
        </div>
        <div>
          <label className="block text-birthday-text/80 text-sm mb-2">页面标题</label>
          <input type="text" value={settings.page_title} onChange={e => setSettings(p => ({ ...p, page_title: e.target.value }))}
            className="w-full px-4 py-3 bg-birthday-bg/50 border border-birthday-purple/20 rounded-xl text-birthday-text focus:border-birthday-gold/50 transition-all" placeholder="生日快乐" />
        </div>
        <button onClick={handleSave} disabled={saving}
          className="w-full py-3 bg-gradient-to-r from-birthday-gold to-birthday-pink rounded-xl text-white font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50">
          {saving ? '保存中...' : saved ? '✅ 已保存' : '保存设置'}
        </button>
      </div>
    </div>
  );
}

/* ====== 祝福记录 ====== */
function VisitorLog() {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('visitors').select('*').order('created_at', { ascending: false });
      if (data) setVisitors(data);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-birthday-text mb-2">👥 祝福记录</h2>
      <p className="text-birthday-muted/60 text-sm mb-6">共 {visitors.length} 位同学送上了祝福</p>
      {loading ? (
        <div className="flex justify-center py-16"><div className="w-10 h-10 border-4 border-birthday-purple border-t-transparent rounded-full animate-spin" /></div>
      ) : visitors.length === 0 ? (
        <div className="text-center py-16 bg-birthday-surface/20 rounded-2xl border border-birthday-purple/10">
          <p className="text-birthday-muted/60 text-lg">还没有人送上祝福</p>
        </div>
      ) : (
        <div className="bg-birthday-surface/30 rounded-xl border border-birthday-purple/10 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-birthday-purple/10">
                <th className="text-left py-3 px-4 text-birthday-muted/60 text-sm font-medium">姓名</th>
                <th className="text-left py-3 px-4 text-birthday-muted/60 text-sm font-medium">祝福时间</th>
              </tr>
            </thead>
            <tbody>
              {visitors.map(v => (
                <tr key={v.id} className="border-b border-birthday-purple/5 hover:bg-birthday-purple/5 transition-colors">
                  <td className="py-3 px-4 text-birthday-text">{v.name}</td>
                  <td className="py-3 px-4 text-birthday-muted/60 text-sm">{new Date(v.created_at).toLocaleString('zh-CN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;