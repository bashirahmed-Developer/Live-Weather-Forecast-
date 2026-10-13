import React from 'react';
import { Wind, ShieldCheck, AlertCircle } from 'lucide-react';
import { getAqiLevel } from '../utils/formatters';
import { translations } from '../utils/translations';

export default function AirQualityCard({ airQuality, language }) {
  if (!airQuality) return null;

  const t = translations[language] || translations.en;
  const aqiVal = airQuality.european_aqi ?? airQuality.pm2_5;
  const aqiInfo = getAqiLevel(aqiVal);

  const pm25 = airQuality.pm2_5 !== undefined ? Math.round(airQuality.pm2_5) : '--';
  const pm10 = airQuality.pm10 !== undefined ? Math.round(airQuality.pm10) : '--';
  const ozone = airQuality.ozone !== undefined ? Math.round(airQuality.ozone) : '--';
  const co = airQuality.carbon_monoxide !== undefined ? Math.round(airQuality.carbon_monoxide) : '--';

  return (
    <div className="w-full glass-panel-subtle rounded-2xl p-5 border border-white/10 my-4 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-slate-900/40">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Wind size={18} className="text-emerald-400" />
          <span className="text-sm font-semibold text-white">{t.airQuality}</span>
        </div>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border border-current/20 ${aqiInfo.color} bg-white/5`}>
          {aqiInfo.label}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 border-b border-white/10">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {Math.round(aqiVal || 0)}
            </span>
            <span className="text-xs text-slate-400">AQI</span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            {aqiInfo.desc}
          </p>
        </div>

        {/* Small warning or safety note */}
        <div className="flex items-center gap-2 text-xs text-slate-300 bg-white/5 px-3 py-2 rounded-xl">
          {aqiVal > 50 ? (
            <AlertCircle size={16} className="text-amber-400 shrink-0" />
          ) : (
            <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
          )}
          <span>
            {aqiVal > 50
              ? (language === 'ur' ? 'ماسک کا استعمال اور احتیاط تجویز کی جاتی ہے' : 'Consider wearing a mask if sensitive')
              : (language === 'ur' ? 'ہوا کا معیار بہترین ہے، بیرونی سرگرمیاں محفوظ ہیں' : 'Ideal air quality for outdoor activities')}
          </span>
        </div>
      </div>

      {/* Pollutant meters */}
      <div className="grid grid-cols-4 gap-2 pt-3 text-center">
        <div className="p-2 rounded-xl bg-white/5">
          <span className="text-[11px] text-slate-400 font-medium block">PM2.5</span>
          <span className="text-xs sm:text-sm font-bold text-white">{pm25} µg/m³</span>
        </div>
        <div className="p-2 rounded-xl bg-white/5">
          <span className="text-[11px] text-slate-400 font-medium block">PM10</span>
          <span className="text-xs sm:text-sm font-bold text-white">{pm10} µg/m³</span>
        </div>
        <div className="p-2 rounded-xl bg-white/5">
          <span className="text-[11px] text-slate-400 font-medium block">O3</span>
          <span className="text-xs sm:text-sm font-bold text-white">{ozone} µg/m³</span>
        </div>
        <div className="p-2 rounded-xl bg-white/5">
          <span className="text-[11px] text-slate-400 font-medium block">CO</span>
          <span className="text-xs sm:text-sm font-bold text-white">{co} µg/m³</span>
        </div>
      </div>
    </div>
  );
}
