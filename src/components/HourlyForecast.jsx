import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Clock, Droplet } from 'lucide-react';
import WeatherIcon from './WeatherIcon';
import { getWeatherDetails } from '../utils/weatherCodeHelper';
import { convertTemp, formatTime } from '../utils/formatters';
import { translations } from '../utils/translations';

export default function HourlyForecast({ weather, unit, timezone, language }) {
  const scrollRef = useRef(null);
  const t = translations[language] || translations.en;

  if (!weather || !weather.hourly || !weather.hourly.time) return null;

  const hourly = weather.hourly;
  const now = new Date();

  // Find index closest to current hour
  let currentHourIndex = hourly.time.findIndex((iso) => {
    const d = new Date(iso);
    return (
      d.getDate() === now.getDate() &&
      d.getHours() === now.getHours()
    );
  });

  if (currentHourIndex === -1) currentHourIndex = 0;

  // Take the next 24 hours starting from current hour
  const next24Hours = [];
  for (let i = currentHourIndex; i < Math.min(hourly.time.length, currentHourIndex + 24); i++) {
    next24Hours.push({
      iso: hourly.time[i],
      temp: hourly.temperature_2m[i],
      weatherCode: hourly.weather_code[i],
      isDay: hourly.is_day ? hourly.is_day[i] : 1,
      rainProb: hourly.precipitation_probability ? hourly.precipitation_probability[i] : 0,
      windSpeed: hourly.wind_speed_10m ? hourly.wind_speed_10m[i] : 0,
      isCurrent: i === currentHourIndex,
    });
  }

  const scroll = (direction) => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -280 : 280;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full glass-panel-subtle rounded-2xl p-5 border border-white/10 my-6">
      {/* Header with Title and Scroll Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock size={18} className="text-sky-400" />
          <h3 className="text-base sm:text-lg font-semibold text-white m-0">
            {t.hourlyForecast}
          </h3>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => scroll('left')}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Scroll Left"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Scroll Right"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Scrollable Track */}
      <div
        ref={scrollRef}
        className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 scroll-smooth"
        style={{ scrollbarWidth: 'thin' }}
      >
        {next24Hours.map((hour, idx) => {
          const details = getWeatherDetails(hour.weatherCode, hour.isDay);
          const timeFormatted = hour.isCurrent
            ? (language === 'ur' ? 'ابھی' : 'Now')
            : formatTime(hour.iso, timezone, { hour: 'numeric' });

          const temp = convertTemp(hour.temp, unit);

          return (
            <div
              key={hour.iso || idx}
              className={`flex flex-col items-center justify-between min-w-[78px] sm:min-w-[84px] py-3.5 px-2 rounded-2xl border transition-all shrink-0 ${
                hour.isCurrent
                  ? 'bg-sky-500/25 border-sky-400/50 shadow-md shadow-sky-500/20'
                  : 'bg-white/5 hover:bg-white/10 border-white/5 hover:border-white/20'
              }`}
            >
              <span className={`text-xs font-semibold ${hour.isCurrent ? 'text-sky-300' : 'text-slate-300'}`}>
                {timeFormatted}
              </span>

              <div className={`my-2 ${details.iconColor} transition-transform hover:scale-110`}>
                <WeatherIcon name={details.icon} size={28} />
              </div>

              <span className="text-sm font-bold text-white">
                {temp}°
              </span>

              {hour.rainProb > 0 ? (
                <div className="flex items-center gap-0.5 mt-1 text-[11px] font-semibold text-sky-400">
                  <Droplet size={11} className="fill-sky-400" />
                  <span>{hour.rainProb}%</span>
                </div>
              ) : (
                <span className="h-4 mt-1" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
