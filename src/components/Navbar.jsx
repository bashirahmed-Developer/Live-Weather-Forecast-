import React, { useState, useEffect } from 'react';
import { CloudSun, RotateCw, Globe2 } from 'lucide-react';
import { translations } from '../utils/translations';

export default function Navbar({
  unit,
  setUnit,
  language,
  setLanguage,
  onRefresh,
  loading,
  timezone,
}) {
  const [currentTime, setCurrentTime] = useState('');
  const t = translations[language] || translations.en;

  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const formatted = new Intl.DateTimeFormat(language === 'ur' ? 'ur-PK' : 'en-US', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZone: timezone || undefined,
        }).format(now);
        setCurrentTime(formatted);
      } catch {
        setCurrentTime(new Date().toLocaleTimeString());
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [timezone, language]);

  return (
    <header className="w-full glass-panel-subtle rounded-2xl px-4 sm:px-6 py-3.5 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg border border-white/10 backdrop-blur-xl">
      {/* Brand Logo */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 shadow-md shadow-sky-500/20 text-white animate-pulse">
          <CloudSun size={26} className="text-yellow-300" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-sky-100 to-sky-300 tracking-tight m-0">
            {t.appTitle}
          </h1>
          <p className="text-xs text-sky-200/70 hidden sm:block font-medium">
            {t.tagline}
          </p>
        </div>
      </div>

      {/* Center/Time pill */}
      {currentTime && (
        <div className="hidden md:flex items-center px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-slate-300 tracking-wide shadow-inner">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping mr-2 inline-block"></span>
          <span>{currentTime}</span>
        </div>
      )}

      {/* Controls & Actions */}
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-end">
        {/* Language switch */}
        <button
          onClick={() => setLanguage(language === 'en' ? 'ur' : 'en')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-xs font-medium text-slate-200 transition-all active:scale-95 cursor-pointer"
          title="Switch Language / زبان تبدیل کریں"
        >
          <Globe2 size={14} className="text-sky-400" />
          <span>{language === 'en' ? 'اردو' : 'English'}</span>
        </button>

        {/* Unit switch */}
        <div className="flex items-center bg-black/20 p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setUnit('C')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              unit === 'C'
                ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            °C
          </button>
          <button
            onClick={() => setUnit('F')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              unit === 'F'
                ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            °F
          </button>
        </div>

        {/* Refresh button */}
        <button
          onClick={onRefresh}
          disabled={loading}
          className={`p-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-slate-200 transition-all active:scale-95 cursor-pointer disabled:opacity-50 ${
            loading ? 'animate-spin text-sky-400' : ''
          }`}
          title="Refresh weather data"
        >
          <RotateCw size={16} />
        </button>
      </div>
    </header>
  );
}
