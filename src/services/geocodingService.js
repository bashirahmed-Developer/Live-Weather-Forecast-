/**
 * Geocoding Service using Open-Meteo Geocoding API (Free, No API key needed)
 */

export const searchCities = async (query) => {
  if (!query || query.trim().length < 2) return [];

  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      query.trim()
    )}&count=8&language=en&format=json`;

    const response = await fetch(url);
    if (!response.ok) throw new Error('Geocoding service error');

    const data = await response.json();
    if (!data.results || !Array.isArray(data.results)) {
      return [];
    }

    return data.results.map((item) => ({
      id: `${item.id || item.name}-${item.latitude.toFixed(2)}-${item.longitude.toFixed(2)}`,
      name: item.name,
      admin1: item.admin1 || '',
      country: item.country || '',
      countryCode: item.country_code || '',
      latitude: item.latitude,
      longitude: item.longitude,
      timezone: item.timezone || 'auto',
      elevation: item.elevation,
    }));
  } catch (error) {
    console.error('Error searching cities:', error);
    return [];
  }
};

/**
 * Reverse geocode latitude and longitude to obtain city and country name
 */
export const reverseGeocode = async (latitude, longitude) => {
  try {
    // Try BigDataCloud client API first (free, fast, no key)
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      return {
        name: data.city || data.locality || data.principalSubdivision || 'Current Location',
        admin1: data.principalSubdivision || '',
        country: data.countryName || '',
        countryCode: data.countryCode || '',
        latitude,
        longitude,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'auto',
      };
    }
  } catch (err) {
    console.warn('BigDataCloud reverse geocode fallback to OSM...', err);
  }

  // Fallback to OpenStreetMap Nominatim
  try {
    const osmUrl = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
    const res = await fetch(osmUrl, {
      headers: { 'Accept-Language': 'en' },
    });
    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      return {
        name: addr.city || addr.town || addr.village || addr.suburb || 'Current Location',
        admin1: addr.state || '',
        country: addr.country || '',
        countryCode: (addr.country_code || '').toUpperCase(),
        latitude,
        longitude,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'auto',
      };
    }
  } catch (err) {
    console.warn('Nominatim reverse geocode fallback failed', err);
  }

  return {
    name: 'Current Location',
    admin1: '',
    country: '',
    countryCode: '',
    latitude,
    longitude,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'auto',
  };
};
