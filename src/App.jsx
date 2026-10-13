import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import SearchBar from './components/SearchBar';
import FavoriteCities from './components/FavoriteCities';
import CurrentWeather from './components/CurrentWeather';
import WeatherMetrics from './components/WeatherMetrics';
import DaylightCard from './components/DaylightCard';
import AirQualityCard from './components/AirQualityCard';
import HourlyForecast from './components/HourlyForecast';
import DailyForecast from './components/DailyForecast';
import WorldWeather from './components/WorldWeather';
import WeatherAlerts from './components/WeatherAlerts';
import Footer from './components/Footer';
import './App.css';

import { fetchWeatherData, fetchAirQuality } from './services/weatherService';
import { reverseGeocode } from './services/geocodingService';
import { getWeatherDetails } from './utils/weatherCodeHelper';
import { DEFAULT_CITIES } from './constants/defaultCities';
import { translations } from './utils/translations';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';

export default function App() {
  // Saved states from localStorage
  const [unit, setUnit] = useState(() => localStorage.getItem('skypulse_unit') || 'C');
  const [language, setLanguage] = useState(() => localStorage.getItem('skypulse_lang') || 'en');
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('skypulse_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Current active city: Default to Lahore
  const [currentCity, setCurrentCity] = useState(() => {
    try {
      const lastCity = localStorage.getItem('skypulse_last_city');
      return lastCity ? JSON.parse(lastCity) : DEFAULT_CITIES[0];
    } catch {
      return DEFAULT_CITIES[0];
    }
  });

  const [weather, setWeather] = useState(null);
  const [airQuality, setAirQuality] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locating, setLocating] = useState(false);

  const t = translations[language] || translations.en;

  // Persist settings
  useEffect(() => {
    localStorage.setItem('skypulse_unit', unit);
  }, [unit]);

  useEffect(() => {
    localStorage.setItem('skypulse_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('skypulse_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    if (currentCity) {
      localStorage.setItem('skypulse_last_city', JSON.stringify(currentCity));
    }
  }, [currentCity]);

  // Load weather and AQI
  const loadWeather = useCallback(async (city) => {
    if (!city || city.latitude === undefined || city.longitude === undefined) return;

    setLoading(true);
    setError(null);

    try {
      const [weatherRes, aqiRes] = await Promise.all([
        fetchWeatherData(city.latitude, city.longitude, city.timezone || 'auto'),
        fetchAirQuality(city.latitude, city.longitude),
      ]);

      setWeather(weatherRes);
      setAirQuality(aqiRes);
    } catch (err) {
      console.error('Failed to load weather:', err);
      setError(err.message || 'Network error occurred while fetching weather data.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch and city change
  useEffect(() => {
    loadWeather(currentCity);
  }, [currentCity, loadWeather]);

  // Handle City Selection
  const handleSelectCity = (city) => {
    setCurrentCity(city);
  };

  // Toggle Favorite
  const handleToggleFavorite = () => {
    if (!currentCity) return;
    const isFav = favorites.some(
      (f) =>
        f.id === currentCity.id ||
        (Math.abs(f.latitude - currentCity.latitude) < 0.05 &&
          Math.abs(f.longitude - currentCity.longitude) < 0.05)
    );

    if (isFav) {
      setFavorites(
        favorites.filter(
          (f) =>
            f.id !== currentCity.id &&
            !(Math.abs(f.latitude - currentCity.latitude) < 0.05 &&
              Math.abs(f.longitude - currentCity.longitude) < 0.05)
        )
      );
    } else {
      setFavorites([...favorites, currentCity]);
    }
  };

  const handleRemoveFavorite = (idOrName) => {
    setFavorites(favorites.filter((f) => (f.id || f.name) !== idOrName));
  };

  // Current Geolocation
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const locationData = await reverseGeocode(latitude, longitude);
          setCurrentCity(locationData);
        } catch (err) {
          console.error('Error reverse geocoding:', err);
        } finally {
          setLocating(false);
        }
      },
      (err) => {
        console.warn('Geolocation error:', err);
        alert(
          language === 'ur'
            ? 'لوکیشن کی اجازت نہیں مل سکی۔ برائے مہربانی براؤزر سیٹنگز چیک کریں۔'
            : 'Unable to retrieve your location. Please check location permissions in your browser.'
        );
        setLocating(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Check if current city is in favorites
  const isCurrentFavorite = favorites.some(
    (f) =>
      f.id === currentCity?.id ||
      (Math.abs(f.latitude - currentCity?.latitude) < 0.05 &&
        Math.abs(f.longitude - currentCity?.longitude) < 0.05)
  );

  // Dynamic Theme
  const themeDetails = weather?.current
    ? getWeatherDetails(weather.current.weather_code, weather.current.is_day)
    : getWeatherDetails(0, 1);

  return (
    <div
      className={`min-h-screen w-full transition-all duration-700 bg-gradient-to-br ${themeDetails.bgGradient} relative text-slate-100 flex flex-col justify-between`}
      style={{
        backgroundImage: themeDetails.bgOverlay,
        direction: language === 'ur' ? 'rtl' : 'ltr',
      }}
    >
      {/* Background Ambient Spheres */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[130px] opacity-25 animate-pulse transition-colors duration-1000"
          style={{ backgroundColor: themeDetails.accent }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-[120px] opacity-20 transition-colors duration-1000"
          style={{ backgroundColor: themeDetails.accent }}
        />
      </div>

      {/* Main Container */}
      <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1">
        {/* Navigation Bar */}
        <Navbar
          unit={unit}
          setUnit={setUnit}
          language={language}
          setLanguage={setLanguage}
          onRefresh={() => loadWeather(currentCity)}
          loading={loading}
          timezone={currentCity?.timezone}
        />

        {/* Search Bar */}
        <SearchBar
          onSelectCity={handleSelectCity}
          onGetCurrentLocation={handleGetCurrentLocation}
          locating={locating}
          language={language}
        />

        {/* Favorite Cities Bar */}
        <FavoriteCities
          favorites={favorites}
          activeCity={currentCity}
          onSelectCity={handleSelectCity}
          onRemoveFavorite={handleRemoveFavorite}
          language={language}
        />

        {/* Error Notification */}
        {error && (
          <div className="w-full p-4 mb-6 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-200 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertCircle size={22} className="shrink-0 text-rose-400" />
              <div>
                <strong className="block font-semibold">{t.errorTitle}</strong>
                <p className="text-xs text-rose-300">{error}</p>
              </div>
            </div>
            <button
              onClick={() => loadWeather(currentCity)}
              className="px-3.5 py-1.5 rounded-xl bg-rose-500/30 hover:bg-rose-500/50 text-xs font-semibold text-white border border-rose-400/40 transition-colors cursor-pointer"
            >
              {t.tryAgain}
            </button>
          </div>
        )}

        {/* Loading Spinner / Skeleton */}
        {loading && !weather ? (
          <div className="w-full py-28 flex flex-col items-center justify-center space-y-4">
            <Loader2 size={44} className="animate-spin text-sky-400" />
            <p className="text-sm font-medium text-slate-300">{t.loading}</p>
          </div>
        ) : (
          weather && (
            <div className="space-y-6 animate-fadeIn">
              {/* Proactive Weather Alerts Banner */}
              <WeatherAlerts weather={weather} language={language} />

              {/* Hero Weather Card */}
              <CurrentWeather
                city={currentCity}
                weather={weather}
                unit={unit}
                language={language}
                isFavorite={isCurrentFavorite}
                onToggleFavorite={handleToggleFavorite}
              />

              {/* 24-Hour Forecast Carousel */}
              <HourlyForecast
                weather={weather}
                unit={unit}
                timezone={currentCity?.timezone}
                language={language}
              />

              {/* Detailed Metrics Grid */}
              <WeatherMetrics
                weather={weather}
                unit={unit}
                language={language}
              />

              {/* 2-Column Grid: Daylight Progress & Air Quality */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DaylightCard
                  weather={weather}
                  timezone={currentCity?.timezone}
                  language={language}
                />
                <AirQualityCard
                  airQuality={airQuality}
                  language={language}
                />
              </div>

              {/* 7-Day Forecast */}
              <DailyForecast
                weather={weather}
                unit={unit}
                language={language}
              />

              {/* Global Live Weather Grid */}
              <WorldWeather
                onSelectCity={handleSelectCity}
                unit={unit}
                language={language}
                activeCity={currentCity}
              />
            </div>

          )
        )}

        {/* Footer */}
        <Footer language={language} />
      </main>
    </div>
  );
}
