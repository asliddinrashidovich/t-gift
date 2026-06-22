function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-5 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
            <p>T</p>
          </div>
          <span className="font-extrabold text-white tracking-wide">
            T-Gift
          </span>
        </div>
        <p className="text-xs font-mono">© 2026 T-Gift, All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
