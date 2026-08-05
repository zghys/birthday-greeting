import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';

/* ====== 星星背景组件 ====== */
function StarsBg() {
  const stars = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    left: Math.random() * 100 + '%',
    top: Math.random() * 100 + '%',
    size: (Math.random() * 3 + 1).toFixed(1) + 'px',
    delay: (Math.random() * 4).toFixed(1) + 's',
    dur: (Math.random() * 3 + 2).toFixed(1) + 's',
  }));
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {stars.map(s => (
        <div key={s.id} className="absolute rounded-full bg-white animate-twinkle"
          style={{ left: s.left, top: s.top, width: s.size, height: s.size, animationDelay: s.delay, animationDuration: s.dur }}
        />
      ))}
    </div>
  );
}

/* ====== 飘落花瓣/爱心 ====== */
function FallingHearts({ active }) {
  if (!active) return null;
  const items = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: Math.random() * 100 + '%',
    delay: (Math.random() * 3).toFixed(1) + 's',
    dur: (Math.random() * 3 + 3).toFixed(1) + 's',
    size: (Math.random() * 12 + 8).toFixed(0) + 'px',
    type: Math.random() > 0.5 ? 'heart' : 'petal',
  }));
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {items.map(item => (
        <div key={item.id}
          className="absolute animate-fall"
          style={{
            left: item.left,
            top: '-30px',
            fontSize: item.size,
            animationDelay: item.delay,
            animationDuration: item.dur,
            opacity: 0.7,
          }}
        >
          {item.type === 'heart' ? '❤️' : '🌸'}
        </div>
      ))}
    </div>
  );
}

/* ====== 五彩纸屑 ====== */
function Confetti({ active }) {
  if (!active) return null;
  const colors = ['#f59e0b', '#ec4899', '#8b5cf6', '#10b981', '#f97316', '#3b82f6', '#ef4444'];
  const pieces = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    left: Math.random() * 100 + '%',
    delay: (Math.random() * 2).toFixed(1) + 's',
    dur: (Math.random() * 2 + 2).toFixed(1) + 's',
    color: colors[i % colors.length],
    size: (Math.random() * 8 + 4).toFixed(0) + 'px',
    rotate: Math.random() * 360,
  }));
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map(p => (
        <div key={p.id}
          className="absolute animate-confetti"
          style={{
            left: p.left,
            top: '-20px',
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            transform: `rotate(${p.rotate}deg)`,
            animationDelay: p.delay,
            animationDuration: p.dur,
            opacity: 0.9,
          }}
        />
      ))}
    </div>
  );
}

/* ====== 首页 ====== */
function Home() {
  const [settings, setSettings] = useState({ birthday_name: '同学', blessing_message: '祝你生日快乐！', page_title: '生日快乐' });
  const [photos, setPhotos] = useState([]);
  const [visitorName, setVisitorName] = useState('');
  const [showBlessing, setShowBlessing] = useState(false);
  const [blessedName, setBlessedName] = useState('');
  const [showLoveWall, setShowLoveWall] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [inputError, setInputError] = useState('');
  const loveWallRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    document.title = settings.page_title;
  }, [settings.page_title]);

  useEffect(() => {
    Promise.all([
      fetch('/api/settings').then(r => r.json()),
      fetch('/api/photos').then(r => r.json()),
    ]).then(([settingsData, photosData]) => {
      setSettings(settingsData);
      setPhotos(photosData);
      setLoaded(true);
    }).catch(() => setLoaded(true));
  }, []);

  const handleSubmit = useCallback(async () => {
    const name = visitorName.trim();
    if (!name) {
      setInputError('请输入你的名字');
      return;
    }
    setInputError('');
    setSubmitting(true);

    try {
      await fetch('/api/visitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
    } catch (e) { /* ignore */ }

    setSubmitting(false);
    setBlessedName(name);
    setShowBlessing(true);
  }, [visitorName]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') handleSubmit();
  }, [handleSubmit]);

  const closeBlessing = useCallback(() => {
    setShowBlessing(false);
    setShowLoveWall(true);
    setTimeout(() => {
      loveWallRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, []);

  if (!loaded) {
    return (
      <div className="h-screen bg-birthday-bg flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-birthday-purple border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const name = settings.birthday_name || '同学';
  const message = settings.blessing_message || '祝你生日快乐，愿所有的美好都如期而至！';

  return (
    <div className="relative min-h-screen bg-birthday-bg overflow-x-hidden">
      <StarsBg />
      <FallingHearts active={showBlessing} />
      <Confetti active={showBlessing} />

      {/* ====== Section 1: 英雄区域 ====== */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        {/* 装饰光晕 */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-birthday-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-birthday-pink/5 rounded-full blur-3xl" />

        <div className="text-center max-w-2xl mx-auto">
          {/* 标题 */}
          <div className="animate-float mb-6">
            <h1 className="text-6xl md:text-8xl font-display font-bold bg-gradient-to-r from-birthday-gold via-birthday-pink to-birthday-purple bg-clip-text text-transparent mb-2">
              🎂 生日快乐
            </h1>
          </div>

          <p className="text-3xl md:text-4xl font-display text-birthday-text mb-4">
            <span className="bg-gradient-to-r from-birthday-gold to-birthday-pink bg-clip-text text-transparent font-bold">{name}</span>
          </p>

          <p className="text-birthday-muted/70 text-lg mb-10">{message}</p>

          {/* 输入框 */}
          <div className="max-w-md mx-auto">
            <p className="text-birthday-text/60 text-sm mb-3">请输入你的名字</p>
            <div className="flex gap-3">
              <input
                type="text"
                value={visitorName}
                onChange={e => { setVisitorName(e.target.value); setInputError(''); }}
                onKeyDown={handleKeyDown}
                placeholder="你的名字"
                className="flex-1 px-5 py-3.5 bg-birthday-surface/60 border border-birthday-purple/30 rounded-xl text-birthday-text placeholder-birthday-muted/30 focus:border-birthday-gold/50 focus:ring-2 focus:ring-birthday-gold/20 transition-all backdrop-blur-sm text-lg"
                maxLength={20}
                autoFocus
              />
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-6 py-3.5 bg-gradient-to-r from-birthday-gold to-birthday-pink rounded-xl text-white font-bold text-lg shadow-lg hover:shadow-2xl hover:shadow-birthday-gold/30 transition-all duration-300 disabled:opacity-50 whitespace-nowrap"
              >
                {submitting ? '...' : '开始'}
              </button>
            </div>
            {inputError && (
              <p className="text-birthday-pink/80 text-sm mt-2 text-left">{inputError}</p>
            )}
          </div>
        </div>

        {/* 底部提示 */}
        <div className="absolute bottom-8 animate-bounce text-birthday-muted/30 text-2xl">↓</div>
      </section>

      {/* ====== 祝福弹窗 ====== */}
      {showBlessing && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={closeBlessing}>
          <div className="bg-birthday-surface/90 backdrop-blur-xl rounded-3xl p-10 max-w-md w-full border border-birthday-gold/30 shadow-2xl animate-fade-in-up text-center relative overflow-hidden" onClick={e => e.stopPropagation()}>
            {/* 装饰光晕 */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-birthday-gold/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-birthday-pink/10 rounded-full blur-3xl" />

            <div className="text-5xl mb-4">🎂</div>
            <h2 className="text-3xl font-display font-bold text-birthday-gold mb-2">生日快乐！</h2>
            <p className="text-birthday-text text-xl mb-1">
              <span className="text-birthday-pink font-bold">{blessedName}</span>
            </p>
            <div className="h-px bg-gradient-to-r from-transparent via-birthday-gold/30 to-transparent my-6" />
            <p className="text-birthday-text/80 text-lg mb-8 leading-relaxed">
              {message}
            </p>
            <button
              onClick={closeBlessing}
              className="px-8 py-3 bg-gradient-to-r from-birthday-gold to-birthday-pink rounded-xl text-white font-bold shadow-lg hover:shadow-xl hover:shadow-birthday-gold/20 transition-all duration-300"
            >
              查看爱心墙 ❤️
            </button>
          </div>
        </div>
      )}

      {/* ====== Section 2: 爱心墙 ====== */}
      <section ref={loveWallRef} className={`relative z-10 py-20 px-4 transition-all duration-700 ${showLoveWall ? 'opacity-100' : 'opacity-0'}`}>
        {/* 标题 */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-birthday-text mb-2">
            ❤️ 爱心墙
          </h2>
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-birthday-pink" />
            <span className="text-birthday-pink text-sm">PHOTO ALBUM</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-birthday-pink" />
          </div>
          <p className="text-birthday-muted/60 text-sm mt-3">每一张照片，都是温暖的回忆</p>
        </div>

        {/* 照片网格 */}
        {photos.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-birthday-muted/40 text-lg">暂无照片，期待管理员上传</p>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            {/* 主照片（大） */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {photos.map((photo, index) => (
                <div
                  key={photo.id}
                  className="group relative rounded-2xl overflow-hidden bg-birthday-surface/40 border border-birthday-pink/10 hover:border-birthday-pink/40 transition-all duration-500 hover:shadow-[0_0_30px_rgba(236,72,153,0.2)] hover:-translate-y-1"
                  style={{ animationDelay: `${(index % 10) * 0.1}s` }}
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={photo.photo_url}
                      alt={photo.caption || '照片'}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.classList.add('flex', 'items-center', 'justify-center', 'bg-gradient-to-br', 'from-birthday-pink/20', 'to-birthday-purple/20');
                        e.target.parentElement.innerHTML = '<span class="text-4xl">📷</span>';
                      }}
                    />
                  </div>
                  {photo.caption && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-birthday-text text-sm">{photo.caption}</p>
                    </div>
                  )}
                  {/* 悬浮爱心 */}
                  <div className="absolute top-3 right-3 text-birthday-pink/0 group-hover:text-birthday-pink/60 transition-all duration-300 text-lg">
                    ❤️
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 底部 */}
        <div className="text-center mt-16 pb-8">
          <p className="text-birthday-muted/30 text-sm">
            愿每一份祝福都化作最美的回忆
          </p>
          <Link
            to="/admin/login"
            className="inline-block mt-2 text-birthday-muted/15 text-xs hover:text-birthday-muted/40 transition-colors"
          >
            管理
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;