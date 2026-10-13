import React from 'react';
import { Star, MapPin, ArrowUp, ArrowDown, Sparkles } from 'lucide-react';
import WeatherIcon from './WeatherIcon';
import { getWeatherDetails } from '../utils/weatherCodeHelper';
import { convertTemp } from '../utils/formatters';
import { translations } from '../utils/translations';

export default function CurrentWeather({
  city,
  weather,
  unit,
  language,
  isFavorite,
  onToggleFavorite,
}) {
  if (!weather || !weather.current) return null;

  const current = weather.current;
  const daily = weather.daily;
  const t = translations[language] || translations.en;

  const weatherDetails = getWeatherDetails(current.weather_code, current.is_day);
  const conditionLabel = language === 'ur' ? weatherDetails.labelUr : weatherDetails.labelEn;
  const tipText = language === 'ur' ? weatherDetails.tipUr : weatherDetails.tipEn;

  const temp = convertTemp(current.temperature_2m, unit);
  const feelsLike = convertTemp(current.apparent_temperature, unit);

  // Today max / min from daily forecast
  const maxTemp = daily?.temperature_2m_max ? convertTemp(daily.temperature_2m_max[0], unit) : null;
  const minTemp = daily?.temperature_2m_min ? convertTemp(daily.temperature_2m_min[0], unit) : null;

  return (
    <div className="relative w-full glass-panel rounded-3xl p-6 sm:p-8 overflow-hidden shadow-2xl border border-white/15 transition-all">
      {/* Decorative ambient background glow */}
      <div
        className="absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl opacity-35 pointer-events-none"
        style={{ backgroundColor: weatherDetails.accent }}
      />
      <div
        className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ backgroundColor: weatherDetails.accent }}
      />

      <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
        {/* Left Side: Location, Temp, High/Low */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-3">
          {/* Location Header + Favorite Button */}
          <div className="flex items-center gap-3 flex-wrap justify-center md:justify-start">
            <div className="flex items-center gap-2 text-sky-300">
              <MapPin size={22} className="shrink-0" />
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white m-0">
                {city.name}
              </h2>
            </div>

            {city.country && (
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-xs font-semibold text-sky-200 border border-white/10">
                {city.country}
              </span>
            )}

            <button
              onClick={onToggleFavorite}
              className={`p-2 rounded-xl transition-all border cursor-pointer ${
                isFavorite
                  ? 'bg-amber-400/20 text-amber-300 border-amber-400/40 shadow-sm shadow-amber-400/20'
                  : 'bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white border-white/10'
              }`}
              title={isFavorite ? t.removeFavorite : t.addFavorite}
            >
              <Star
                size={18}
                className={isFavorite ? 'fill-amber-400 text-amber-400' : ''}
              />
            </button>
          </div>

          {/* Region / Admin */}
          {city.admin1 && (
            <p className="text-xs text-slate-300 font-medium">
              {city.admin1}
            </p>
          )}

          {/* Massive Temperature display */}
          <div className="flex items-baseline gap-2 pt-2">
            <span className="text-6xl sm:text-7xl md:text-8xl font-black text-white tracking-tighter drop-shadow-md">
              {temp}
            </span>
            <span className="text-2xl sm:text-3xl font-semibold text-sky-300">
              °{unit}
            </span>
          </div>

          {/* Condition text & Feels Like */}
          <div className="flex flex-col gap-1 items-center md:items-start">
            <div className="text-xl sm:text-2xl font-semibold text-slate-100 flex items-center gap-2">
              <span>{conditionLabel}</span>
            </div>

            <div className="flex items-center gap-4 text-xs sm:text-sm text-slate-300">
              <span>
                {t.feelsLike}: <strong className="text-white font-semibold">{feelsLike}°{unit}</strong>
              </span>

              {maxTemp !== null && minTemp !== null && (
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center text-rose-300 font-medium">
                    <ArrowUp size={13} className="mr-0.5" /> {maxTemp}°
                  </span>
                  <span className="inline-flex items-center text-sky-300 font-medium">
                    <ArrowDown size={13} className="mr-0.5" /> {minTemp}°
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Animated Weather Icon & Weather Insight Tip */}
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="relative group p-6 rounded-3xl bg-white/5 border border-white/10 shadow-inner flex items-center justify-center">
            <div
              className="absolute inset-0 rounded-3xl blur-xl opacity-30 transition-all group-hover:opacity-50"
              style={{ backgroundColor: weatherDetails.accent }}
            />
            <div className={`relative ${weatherDetails.iconColor} drop-shadow-[0_0_20px_rgba(255,255,255,0.2)] transform group-hover:scale-110 transition-transform duration-300`}>
              <WeatherIcon name={weatherDetails.icon} size={84} />
            </div>
          </div>

          {/* Weather Insight Pill */}
          <div className="max-w-xs px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-200 text-center flex items-center gap-2 shadow-sm">
            <Sparkles size={16} className="text-amber-300 shrink-0" />
            <span className="leading-snug">{tipText}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
