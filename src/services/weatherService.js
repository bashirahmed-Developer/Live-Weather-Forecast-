/**
 * Weather Service using Open-Meteo Forecast & Air Quality APIs
 * 100% Free, No API key needed, Worldwide coverage
 */

export const fetchWeatherData = async (latitude, longitude, timezone = 'auto') => {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    timezone: timezone || 'auto',
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'is_day',
      'precipitation',
      'weather_code',
      'cloud_cover',
      'surface_pressure',
      'wind_speed_10m',
      'wind_direction_10m',
      'wind_gusts_10m',
      'uv_index',
    ].join(','),
    hourly: [
      'temperature_2m',
      'relative_humidity_2m',
      'precipitation_probability',
      'weather_code',
      'wind_speed_10m',
      'is_day',
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'apparent_temperature_max',
      'apparent_temperature_min',
      'sunrise',
      'sunset',
      'uv_index_max',
      'precipitation_sum',
      'precipitation_probability_max',
      'wind_speed_10m_max',
    ].join(','),
  });

  const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Weather service error: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
};

export const fetchAirQuality = async (latitude, longitude) => {
  try {
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      current: [
        'european_aqi',
        'pm10',
        'pm2_5',
        'carbon_monoxide',
        'nitrogen_dioxide',
        'sulphur_dioxide',
        'ozone',
      ].join(','),
    });

    const url = `https://air-quality-api.open-meteo.com/v1/air-quality?${params.toString()}`;
    const response = await fetch(url);
    if (!response.ok) return null;

    const data = await response.json();
    return data?.current || null;
  } catch (error) {
    console.warn('Air quality data unavailable:', error);
    return null;
  }
};
