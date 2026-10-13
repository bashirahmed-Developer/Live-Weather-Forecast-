import React from 'react';
import { Sunrise, Sunset } from 'lucide-react';
import { formatTime } from '../utils/formatters';
import { translations } from '../utils/translations';

export default function DaylightCard({ weather, timezone, language }) {
  if (!weather || !weather.daily || !weather.daily.sunrise || !weather.daily.sunset) {
    return null;
  }

  const t = translations[language] || translations.en;
  const sunriseIso = weather.daily.sunrise[0];
  const sunsetIso = weather.daily.sunset[0];

  const sunriseTime = formatTime(sunriseIso, timezone);
  const sunsetTime = formatTime(sunsetIso, timezone);

  // Daylight progress calculation
  const now = new Date();
  const sunriseDate = new Date(sunriseIso);
  const sunsetDate = new Date(sunsetIso);

  const totalDaylightMs = Math.max(1, sunsetDate.getTime() - sunriseDate.getTime());
  const elapsedMs = now.getTime() - sunriseDate.getTime();
  const progressPercent = Math.min(100, Math.max(0, Math.round((elapsedMs / totalDaylightMs) * 100)));

  const isDaytime = now >= sunriseDate && now <= sunsetDate;
  const daylightHours = Math.floor(totalDaylightMs / (1000 * 60 * 60));
  const daylightMinutes = Math.floor((totalDaylightMs % (1000 * 60 * 60)) / (1000 * 60));

  return (
    <div className="w-full glass-panel-subtle rounded-2xl p-5 border border-white/10 my-4 bg-gradient-to-r from-amber-500/10 via-sky-500/5 to-indigo-500/10">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold text-white">
          {t.daylightProgress}
        </span>
        <span className="text-xs text-sky-200/80 font-medium">
          {daylightHours}h {daylightMinutes}m {language === 'ur' ? 'دن کی روشنی' : 'daylight'}
        </span>
      </div>

      {/* Sun path progress track */}
      <div className="relative w-full mb-4">
        <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-400 h-full rounded-full transition-all duration-1000"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Sunrise & Sunset times */}
      <div className="grid grid-cols-2 gap-4 pt-1">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/30">
            <Sunrise size={22} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">{t.sunrise}</p>
            <p className="text-sm sm:text-base font-bold text-white">{sunriseTime}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 justify-end text-right">
          <div>
            <p className="text-xs text-slate-400 font-medium">{t.sunset}</p>
            <p className="text-sm sm:text-base font-bold text-white">{sunsetTime}</p>
          </div>
          <div className="p-2 rounded-xl bg-orange-500/20 text-orange-300 border border-orange-500/30">
            <Sunset size={22} />
          </div>
        </div>
      </div>
    </div>
  );
}
