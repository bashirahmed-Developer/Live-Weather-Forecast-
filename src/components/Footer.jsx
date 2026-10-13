import React from 'react';
import { Heart, Cloud, Zap } from 'lucide-react';

export default function Footer({ language }) {
  return (
    <footer className="w-full mt-12 py-6 border-t border-white/10 text-center text-xs text-slate-400 space-y-2">
      <div className="flex items-center justify-center gap-1.5 text-slate-300">
        <span>Crafted with</span>
        <Heart size={14} className="text-rose-500 fill-rose-500 animate-pulse" />
        <span>using React 19 & Vite</span>
      </div>
      <p className="text-[11px] text-slate-400">
        Atmospheric data provided by <a href="https://open-meteo.com/" target="_blank" rel="noreferrer" className="text-sky-400 hover:underline">Open-Meteo</a> • Free & Open Weather API
      </p>
    </footer>
  );
}
