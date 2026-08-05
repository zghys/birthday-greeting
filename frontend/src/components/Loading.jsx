function Loading({ text = '加载中...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-12 h-12 border-4 border-birthday-purple border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-birthday-muted text-lg">{text}</p>
    </div>
  );
}

export default Loading;