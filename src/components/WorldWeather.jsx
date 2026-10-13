import React, { useState, useEffect } from 'react';
import { Globe, RefreshCw, Droplet, Wind, ArrowRight } from 'lucide-react';
import WeatherIcon from './WeatherIcon';
import { getWeatherDetails } from '../utils/weatherCodeHelper';
import { convertTemp } from '../utils/formatters';

const WORLD_CITIES = [
  { id: 'lahore', name: 'Lahore', nameUr: 'لاہور', country: 'Pakistan', latitude: 31.5204, longitude: 74.3587, timezone: 'Asia/Karachi' },
  { id: 'karachi', name: 'Karachi', nameUr: 'کراچی', country: 'Pakistan', latitude: 24.8607, longitude: 67.0011, timezone: 'Asia/Karachi' },
  { id: 'islamabad', name: 'Islamabad', nameUr: 'اسلام آباد', country: 'Pakistan', latitude: 33.6844, longitude: 73.0479, timezone: 'Asia/Karachi' },
  { id: 'dubai', name: 'Dubai', nameUr: 'دبئی', country: 'UAE', latitude: 25.2048, longitude: 55.2708, timezone: 'Asia/Dubai' },
  { id: 'riyadh', name: 'Riyadh', nameUr: 'ریاض', country: 'Saudi Arabia', latitude: 24.7136, longitude: 46.6753, timezone: 'Asia/Riyadh' },
  { id: 'makkah', name: 'Makkah', nameUr: 'مکہ مکرمہ', country: 'Saudi Arabia', latitude: 21.4225, longitude: 39.8262, timezone: 'Asia/Riyadh' },
  { id: 'london', name: 'London', nameUr: 'لندن', country: 'UK', latitude: 51.5074, longitude: -0.1278, timezone: 'Europe/London' },
  { id: 'paris', name: 'Paris', nameUr: 'پیرس', country: 'France', latitude: 48.8566, longitude: 2.3522, timezone: 'Europe/Paris' },
  { id: 'newyork', name: 'New York', nameUr: 'نیویارک', country: 'USA', latitude: 40.7128, longitude: -74.0060, timezone: 'America/New_York' },
  { id: 'tokyo', name: 'Tokyo', nameUr: 'ٹوکیو', country: 'Japan', latitude: 35.6762, longitude: 139.6503, timezone: 'Asia/Tokyo' },
  { id: 'istanbul', name: 'Istanbul', nameUr: 'استنبول', country: 'Turkey', latitude: 41.0082, longitude: 28.9784, timezone: 'Europe/Istanbul' },
  { id: 'toronto', name: 'Toronto', nameUr: 'ٹورنٹو', country: 'Canada', latitude: 43.6532, longitude: -79.3832, timezone: 'America/Toronto' },
];

export default function WorldWeather({ onSelectCity, unit, language, activeCity }) {
  const [citiesData, setCitiesData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWorldData = async () => {
    setLoading(true);
    try {
      const results = await Promise.all(
        WORLD_CITIES.map(async (city, index) => {
          // slight stagger to prevent burst rate limits
          if (index > 0) await new Promise((r) => setTimeout(r, index * 60));
          try {
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,is_day&timezone=auto`;
            const res = await fetch(url);
            if (!res.ok) throw new Error('Fetch failed');
            const data = await res.json();
            return {
              ...city,
              current: data.current || null,
            };
          } catch (err) {
            console.warn(`Retry loading ${city.name}...`);
            try {
              await new Promise((r) => setTimeout(r, 500));
              const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,is_day&timezone=auto`;
              const res = await fetch(url);
              const data = await res.json();
              return { ...city, current: data.current || null };
            } catch {
              return { ...city, current: null };
            }
          }
        })
      );
      setCitiesData(results);
    } catch (err) {
      console.error('Failed to load world cities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorldData();
  }, []);

  return (
    <div className="w-full glass-panel-subtle rounded-2xl p-5 border border-white/10 my-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Globe size={18} className="text-sky-400" />
          <h3 className="text-base sm:text-lg font-semibold text-white m-0">
            {language === 'ur' ? 'دنیا بھر کے اہم ممالک و شہروں کا لائیو موسم' : 'Live Global Weather Across Countries'}
          </h3>
        </div>

        <button
          onClick={fetchWorldData}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-xs font-medium text-slate-300 hover:text-white transition-all cursor-pointer disabled:opacity-50"
          title="Refresh Global Readings"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin text-sky-400' : ''} />
          <span>{language === 'ur' ? 'تازہ ترین' : 'Refresh'}</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {citiesData.map((item) => {
          const isCurrentActive =
            activeCity &&
            (activeCity.id === item.id ||
              (Math.abs(activeCity.latitude - item.latitude) < 0.05 &&
                Math.abs(activeCity.longitude - item.longitude) < 0.05));

          const current = item.current;
          if (!current) {
            return (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-white/5 border border-white/5 animate-pulse min-h-[90px]"
              />
            );
          }

          const details = getWeatherDetails(current.weather_code, current.is_day);
          const temp = convertTemp(current.temperature_2m, unit);
          const cityName = language === 'ur' ? item.nameUr : item.name;
          const conditionLabel = language === 'ur' ? details.labelUr : details.labelEn;

          return (
            <div
              key={item.id}
              onClick={() => onSelectCity(item)}
              className={`group p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                isCurrentActive
                  ? 'bg-sky-500/20 border-sky-400/50 shadow-md shadow-sky-500/20'
                  : 'bg-white/5 hover:bg-white/10 border-white/5 hover:border-white/20'
              }`}
            >
              <div className="flex items-start justify-between gap-1">
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors m-0">
                    {cityName}
                  </h4>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {item.country}
                  </span>
                </div>
                <div className={`${details.iconColor} p-1 rounded-lg bg-white/5`}>
                  <WeatherIcon name={details.icon} size={22} />
                </div>
              </div>

              <div className="flex items-baseline justify-between mt-2 pt-2 border-t border-white/5">
                <span className="text-2xl font-black text-white">
                  {temp}°{unit}
                </span>
                <span className="text-[11px] text-slate-300 truncate max-w-[90px] text-right">
                  {conditionLabel}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                <span className="flex items-center gap-0.5">
                  <Droplet size={11} className="text-sky-400" />
                  {current.relative_humidity_2m}%
                </span>
                <span className="flex items-center gap-0.5">
                  <Wind size={11} className="text-teal-400" />
                  {Math.round(current.wind_speed_10m)} km/h
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
