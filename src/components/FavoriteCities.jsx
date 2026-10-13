import React from 'react';
import { Star, X, MapPin } from 'lucide-react';
import { DEFAULT_CITIES } from '../constants/defaultCities';

export default function FavoriteCities({
  favorites,
  activeCity,
  onSelectCity,
  onRemoveFavorite,
  language,
}) {
  const displayCities = favorites.length > 0 ? favorites : DEFAULT_CITIES.slice(0, 5);
  const isCustomFavorites = favorites.length > 0;

  return (
    <div className="w-full flex items-center gap-2 overflow-x-auto pb-3 pt-1 scrollbar-none no-scrollbar mb-4">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 shrink-0 mr-1 uppercase tracking-wider">
        <Star size={13} className="text-amber-400 fill-amber-400" />
        <span>{isCustomFavorites ? (language === 'ur' ? 'پسندیدہ' : 'Saved') : (language === 'ur' ? 'مشہور شہر' : 'Trending')}:</span>
      </div>

      <div className="flex items-center gap-2 flex-nowrap">
        {displayCities.map((city) => {
          const isActive =
            activeCity &&
            (activeCity.id === city.id ||
              (Math.abs(activeCity.latitude - city.latitude) < 0.05 &&
                Math.abs(activeCity.longitude - city.longitude) < 0.05));

          const displayName = language === 'ur' && city.nameUr ? city.nameUr : city.name;

          return (
            <div
              key={city.id || `${city.name}-${city.latitude}`}
              className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 border cursor-pointer ${
                isActive
                  ? 'bg-sky-500/20 border-sky-400 text-sky-200 shadow-sm shadow-sky-500/20'
                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300 hover:text-white'
              }`}
              onClick={() => onSelectCity(city)}
            >
              <MapPin size={12} className={isActive ? 'text-sky-400' : 'text-slate-400'} />
              <span>{displayName}</span>

              {isCustomFavorites && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFavorite(city.id || city.name);
                  }}
                  className="opacity-0 group-hover:opacity-100 hover:text-rose-400 transition-opacity ml-0.5 p-0.5 rounded cursor-pointer"
                  title="Remove"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
