export const convertTemp = (celsius, unit = 'C') => {
  if (celsius === null || celsius === undefined || isNaN(celsius)) return '--';
  if (unit === 'F') {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return Math.round(celsius);
};

export const convertSpeed = (kmh, unit = 'C') => {
  if (kmh === null || kmh === undefined || isNaN(kmh)) return '--';
  if (unit === 'F') {
    // mph
    return `${Math.round(kmh * 0.621371)} mph`;
  }
  return `${Math.round(kmh)} km/h`;
};

export const getWindDirection = (degree) => {
  if (degree === undefined || degree === null) return 'N';
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round((degree % 360) / 22.5);
  return directions[(index % 16)];
};

export const formatTime = (isoString, timeZone, options = { hour: 'numeric', minute: '2-digit' }) => {
  if (!isoString) return '--';
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', {
      ...options,
      timeZone: timeZone || undefined,
    }).format(date);
  } catch {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
};

export const formatDayName = (dateStr, lang = 'en') => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const today = new Date();
  
  if (date.toDateString() === today.toDateString()) {
    return lang === 'ur' ? 'آج' : 'Today';
  }
  
  if (lang === 'ur') {
    const urDays = ['اتوار', 'پیر', 'منگل', 'بدھ', 'جمعرات', 'جمعہ', 'ہفتہ'];
    return urDays[date.getDay()];
  }
  
  return new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date);
};

export const getUvLevel = (uv) => {
  if (uv === null || uv === undefined) return { label: 'Low', color: 'text-emerald-400', bg: 'bg-emerald-500/20' };
  if (uv < 3) return { label: 'Low', color: 'text-emerald-400', bg: 'bg-emerald-500/20' };
  if (uv < 6) return { label: 'Moderate', color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
  if (uv < 8) return { label: 'High', color: 'text-amber-400', bg: 'bg-amber-500/20' };
  if (uv < 11) return { label: 'Very High', color: 'text-orange-400', bg: 'bg-orange-500/20' };
  return { label: 'Extreme', color: 'text-rose-500', bg: 'bg-rose-500/20' };
};

export const getAqiLevel = (aqi) => {
  // European AQI 0-20 Good, 20-40 Fair, 40-60 Moderate, 60-80 Poor, 80-100 Very Poor
  if (!aqi) return { label: 'Good', desc: 'Air quality is satisfactory', color: 'text-emerald-400', level: 1 };
  if (aqi <= 20) return { label: 'Good', desc: 'Air quality is very clean and healthy', color: 'text-emerald-400', level: 1 };
  if (aqi <= 40) return { label: 'Fair', desc: 'Acceptable for most individuals', color: 'text-teal-400', level: 2 };
  if (aqi <= 60) return { label: 'Moderate', desc: 'Sensitive groups should limit exertion', color: 'text-yellow-400', level: 3 };
  if (aqi <= 80) return { label: 'Poor', desc: 'Unhealthy for sensitive groups', color: 'text-orange-400', level: 4 };
  return { label: 'Very Poor', desc: 'Hazardous air quality, avoid outdoor activities', color: 'text-rose-400', level: 5 };
};
