import React from 'react';
import {
  Droplets,
  Wind,
  Sun,
  Gauge,
  Eye,
  CloudRain,
  Compass,
} from 'lucide-react';
import {
  convertSpeed,
  getWindDirection,
  getUvLevel,
} from '../utils/formatters';
import { translations } from '../utils/translations';

export default function WeatherMetrics({ weather, unit, language }) {
  if (!weather || !weather.current) return null;

  const current = weather.current;
  const t = translations[language] || translations.en;

  // Values
  const humidity = current.relative_humidity_2m ?? '--';
  const windSpeed = convertSpeed(current.wind_speed_10m, unit);
  const windGusts = convertSpeed(current.wind_gusts_10m, unit);
  const windDirectionDeg = current.wind_direction_10m ?? 0;
  const windDirectionCardinal = getWindDirection(windDirectionDeg);
  const pressure = current.surface_pressure ? `${Math.round(current.surface_pressure)} hPa` : '--';
  const uvIndex = current.uv_index !== undefined ? Math.round(current.uv_index) : 0;
  const uvInfo = getUvLevel(uvIndex);
  const precipitation = current.precipitation !== undefined ? `${current.precipitation} mm` : '0 mm';
  const cloudCover = current.cloud_cover !== undefined ? `${current.cloud_cover}%` : '--';

  // Humidity status
  const getHumidityStatus = (val) => {
    if (val < 30) return language === 'ur' ? 'خشک' : 'Dry';
    if (val <= 60) return language === 'ur' ? 'آرام دہ' : 'Comfortable';
    return language === 'ur' ? 'نم آلود' : 'High Humidity';
  };

  const metrics = [
    {
      id: 'humidity',
      title: t.humidity,
      value: `${humidity}%`,
      subtitle: getHumidityStatus(humidity),
      icon: Droplets,
      iconColor: 'text-cyan-400',
      bgGlow: 'from-cyan-500/10 to-blue-500/5',
      extra: (
        <div className="w-full bg-white/10 rounded-full h-1.5 mt-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(humidity, 100)}%` }}
          />
        </div>
      ),
    },
    {
      id: 'wind',
      title: t.wind,
      value: windSpeed,
      subtitle: `${t.windGusts}: ${windGusts}`,
      icon: Wind,
      iconColor: 'text-teal-400',
      bgGlow: 'from-teal-500/10 to-emerald-500/5',
      extra: (
        <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-300">
          <Compass
            size={14}
            className="text-teal-300 transition-transform duration-700"
            style={{ transform: `rotate(${windDirectionDeg}deg)` }}
          />
          <span>{windDirectionCardinal} ({windDirectionDeg}°)</span>
        </div>
      ),
    },
    {
      id: 'uv',
      title: t.uvIndex,
      value: uvIndex,
      subtitle: uvInfo.label,
      icon: Sun,
      iconColor: 'text-amber-400',
      bgGlow: 'from-amber-500/10 to-orange-500/5',
      extra: (
        <span className={`inline-block px-2 py-0.5 mt-2 rounded-full text-[11px] font-semibold ${uvInfo.color} ${uvInfo.bg}`}>
          {uvInfo.label}
        </span>
      ),
    },
    {
      id: 'pressure',
      title: t.pressure,
      value: pressure,
      subtitle: language === 'ur' ? 'معمول کے مطابق' : 'Atmospheric Pressure',
      icon: Gauge,
      iconColor: 'text-indigo-400',
      bgGlow: 'from-indigo-500/10 to-purple-500/5',
    },
    {
      id: 'precipitation',
      title: t.precipitation,
      value: precipitation,
      subtitle: `${language === 'ur' ? 'بادل' : 'Clouds'}: ${cloudCover}`,
      icon: CloudRain,
      iconColor: 'text-blue-400',
      bgGlow: 'from-blue-500/10 to-indigo-500/5',
    },
    {
      id: 'cloud_cover',
      title: language === 'ur' ? 'بادلوں کا تناسب' : 'Cloud Cover',
      value: cloudCover,
      subtitle: language === 'ur' ? 'آسمانی احاطہ' : 'Sky Coverage',
      icon: Eye,
      iconColor: 'text-sky-400',
      bgGlow: 'from-sky-500/10 to-cyan-500/5',
      extra: (
        <div className="w-full bg-white/10 rounded-full h-1.5 mt-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-sky-400 to-indigo-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(parseInt(cloudCover) || 0, 100)}%` }}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 my-6">
      {metrics.map((item) => {
        const IconComponent = item.icon;
        return (
          <div
            key={item.id}
            className={`glass-panel-subtle rounded-2xl p-4 sm:p-5 flex flex-col justify-between border border-white/10 hover:border-white/20 transition-all duration-200 bg-gradient-to-b ${item.bgGlow}`}
          >
            <div className="flex items-center justify-between text-slate-300 mb-2">
              <span className="text-xs sm:text-sm font-medium">{item.title}</span>
              <IconComponent size={20} className={item.iconColor} />
            </div>

            <div className="my-1">
              <span className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {item.value}
              </span>
              {item.subtitle && (
                <p className="text-xs text-slate-400 mt-0.5 font-medium truncate">
                  {item.subtitle}
                </p>
              )}
            </div>

            {item.extra && item.extra}
          </div>
        );
      })}
    </div>
  );
}
