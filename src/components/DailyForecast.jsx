import React from 'react';
import { Calendar, Droplets } from 'lucide-react';
import WeatherIcon from './WeatherIcon';
import { getWeatherDetails } from '../utils/weatherCodeHelper';
import { convertTemp, formatDayName } from '../utils/formatters';
import { translations } from '../utils/translations';

export default function DailyForecast({ weather, unit, language }) {
  if (!weather || !weather.daily || !weather.daily.time) return null;

  const daily = weather.daily;
  const t = translations[language] || translations.en;

  // Find overall min and max of the 7-day period for relative gradient bars
  const allMins = daily.temperature_2m_min.map((v) => convertTemp(v, unit));
  const allMaxs = daily.temperature_2m_max.map((v) => convertTemp(v, unit));
  const absoluteMin = Math.min(...allMins.filter((v) => typeof v === 'number'));
  const absoluteMax = Math.max(...allMaxs.filter((v) => typeof v === 'number'));
  const totalRange = Math.max(1, absoluteMax - absoluteMin);

  return (
    <div className="w-full glass-panel-subtle rounded-2xl p-5 border border-white/10 my-6">
      <div className="flex items-center gap-2 mb-4">
        <Calendar size={18} className="text-sky-400" />
        <h3 className="text-base sm:text-lg font-semibold text-white m-0">
          {t.dailyForecast}
        </h3>
      </div>

      <div className="flex flex-col divide-y divide-white/10">
        {daily.time.slice(0, 7).map((dateStr, idx) => {
          const dayName = formatDayName(dateStr, language);
          const weatherCode = daily.weather_code[idx];
          const details = getWeatherDetails(weatherCode, 1);
          const conditionLabel = language === 'ur' ? details.labelUr : details.labelEn;

          const minTemp = convertTemp(daily.temperature_2m_min[idx], unit);
          const maxTemp = convertTemp(daily.temperature_2m_max[idx], unit);
          const rainProb = daily.precipitation_probability_max
            ? daily.precipitation_probability_max[idx]
            : 0;

          // Compute bar position relative to week range
          const leftPercent = Math.max(0, Math.min(100, ((minTemp - absoluteMin) / totalRange) * 100));
          const widthPercent = Math.max(8, Math.min(100 - leftPercent, ((maxTemp - minTemp) / totalRange) * 100));

          return (
            <div
              key={dateStr}
              className="py-3 px-2 flex items-center justify-between gap-3 sm:gap-6 hover:bg-white/5 rounded-xl transition-colors"
            >
              {/* Day Name */}
              <div className="w-24 sm:w-28 text-left">
                <span className="text-sm font-semibold text-white block">
                  {dayName}
                </span>
                <span className="text-[11px] text-slate-400">
                  {new Date(dateStr).toLocaleDateString(language === 'ur' ? 'ur-PK' : 'en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>

              {/* Weather Icon & Condition */}
              <div className="flex items-center gap-2.5 flex-1 max-w-[180px]">
                <div className={`${details.iconColor} shrink-0`}>
                  <WeatherIcon name={details.icon} size={22} />
                </div>
                <span className="text-xs sm:text-sm text-slate-300 font-medium truncate hidden sm:inline">
                  {conditionLabel}
                </span>
              </div>

              {/* Rain Chance */}
              <div className="w-14 text-right">
                {rainProb > 0 ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-sky-400">
                    <Droplets size={12} className="fill-sky-400" />
                    {rainProb}%
                  </span>
                ) : (
                  <span className="text-xs text-slate-500 font-normal">--</span>
                )}
              </div>

              {/* Visual Temperature Range Bar */}
              <div className="flex items-center gap-3 w-40 sm:w-56">
                <span className="text-xs sm:text-sm font-semibold text-slate-400 w-8 text-right">
                  {minTemp}°
                </span>

                <div className="flex-1 bg-white/10 rounded-full h-2 relative overflow-hidden">
                  <div
                    className="absolute h-full rounded-full bg-gradient-to-r from-sky-400 via-amber-400 to-rose-400"
                    style={{
                      left: `${leftPercent}%`,
                      width: `${widthPercent}%`,
                    }}
                  />
                </div>

                <span className="text-xs sm:text-sm font-bold text-white w-8 text-left">
                  {maxTemp}°
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
