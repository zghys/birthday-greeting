function GreetingCard({ greeting, index }) {
  const delayClass = `delay-${Math.min((index % 10) + 1, 10)}`;

  return (
    <div
      className={`animate-fade-in-up ${delayClass} opacity-0`}
      style={{ animationFillMode: 'forwards' }}
    >
      <div className="group relative bg-birthday-surface/60 backdrop-blur-sm rounded-2xl overflow-hidden border border-birthday-purple/20 hover:border-birthday-gold/50 transition-all duration-500 hover:translate-y-[-8px] hover:shadow-[0_0_30px_rgba(245,158,11,0.3)]">
        {/* 顶部装饰线 */}
        <div className="h-1.5 bg-gradient-to-r from-birthday-gold via-birthday-pink to-birthday-purple"></div>

        <div className="p-6">
          {/* 照片 */}
          <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-3 border-birthday-gold/40 group-hover:border-birthday-gold transition-all duration-500 shadow-lg">
            {greeting.photo ? (
              <img
                src={greeting.photo}
                alt={greeting.name}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '';
                  e.target.style.display = 'none';
                  e.target.parentElement.classList.add('bg-gradient-to-br', 'from-birthday-gold', 'to-birthday-pink', 'flex', 'items-center', 'justify-center');
                  const span = document.createElement('span');
                  span.className = 'text-3xl font-bold text-white';
                  span.textContent = greeting.name.charAt(0);
                  e.target.parentElement.appendChild(span);
                }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-birthday-gold to-birthday-pink flex items-center justify-center">
                <span className="text-3xl font-bold text-white">{greeting.name.charAt(0)}</span>
              </div>
            )}
          </div>

          {/* 姓名 */}
          <h3 className="text-center text-xl font-bold text-birthday-gold mb-3 group-hover:text-birthday-pink transition-colors duration-300">
            {greeting.name}
          </h3>

          {/* 祝福语 */}
          <p className="text-birthday-text/80 text-center leading-relaxed text-sm min-h-[3em]">
            {greeting.message || '祝生日快乐！'}
          </p>
        </div>

        {/* 底部装饰光晕 */}
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-birthday-gold/5 rounded-full blur-2xl group-hover:bg-birthday-gold/10 transition-all duration-700"></div>
      </div>
    </div>
  );
}

export default GreetingCard;