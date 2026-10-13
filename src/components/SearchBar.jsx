import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X, Loader2, Navigation } from 'lucide-react';
import { searchCities } from '../services/geocodingService';
import { translations } from '../utils/translations';

export default function SearchBar({
  onSelectCity,
  onGetCurrentLocation,
  locating,
  language,
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  const t = translations[language] || translations.en;

  // Debounced search
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      const cities = await searchCities(query);
      setResults(cities);
      setIsSearching(false);
      setIsOpen(true);
      setSelectedIndex(-1);
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (city) => {
    onSelectCity(city);
    setQuery('');
    setIsOpen(false);
    setResults([]);
  };

  const handleKeyDown = (e) => {
    if (!isOpen || results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < results.length) {
        handleSelect(results[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto mb-6 z-30" ref={dropdownRef}>
      <div className="flex items-center gap-2">
        {/* Search Input Container */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            {isSearching ? (
              <Loader2 size={18} className="animate-spin text-sky-400" />
            ) : (
              <Search size={18} />
            )}
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => results.length > 0 && setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={t.searchPlaceholder}
            className="w-full pl-10 pr-10 py-3 rounded-2xl glass-input text-sm md:text-base text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/50 transition-all shadow-lg"
          />

          {query && (
            <button
              onClick={() => {
                setQuery('');
                setResults([]);
                setIsOpen(false);
                inputRef.current?.focus();
              }}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white cursor-pointer"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Current Location Button */}
        <button
          onClick={onGetCurrentLocation}
          disabled={locating}
          title={t.currentLocation}
          className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-sm font-medium shadow-lg shadow-sky-500/25 transition-all active:scale-95 cursor-pointer disabled:opacity-60 whitespace-nowrap"
        >
          {locating ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Navigation size={18} className="text-white fill-white/20" />
          )}
          <span className="hidden sm:inline">
            {locating ? t.locating : t.currentLocation}
          </span>
        </button>
      </div>

      {/* Autocomplete Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 py-2 glass-panel rounded-2xl shadow-2xl border border-white/15 overflow-hidden z-40 max-h-80 overflow-y-auto">
          {results.map((city, idx) => (
            <button
              key={city.id || `${city.name}-${idx}`}
              onClick={() => handleSelect(city)}
              onMouseEnter={() => setSelectedIndex(idx)}
              className={`w-full text-left px-4 py-3 flex items-center justify-between text-sm transition-colors cursor-pointer ${
                selectedIndex === idx
                  ? 'bg-sky-500/30 text-white'
                  : 'text-slate-200 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <MapPin size={16} className="text-sky-400 shrink-0" />
                <span className="font-semibold text-white">{city.name}</span>
                {city.admin1 && (
                  <span className="text-xs text-slate-300">({city.admin1})</span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>{city.country}</span>
                {city.countryCode && (
                  <span className="px-1.5 py-0.5 rounded bg-white/10 text-[11px] font-mono text-sky-300 uppercase">
                    {city.countryCode}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
