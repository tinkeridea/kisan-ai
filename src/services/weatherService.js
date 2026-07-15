/**
 * weatherService.js
 * Uses free APIs only:
 * - Nominatim (OpenStreetMap) for geocoding
 * - Open-Meteo for real weather + soil moisture
 */

const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org/search';
const OPENMETEO_BASE = 'https://api.open-meteo.com/v1/forecast';

// Fallback coordinates for known districts (in case Nominatim is slow)
const DISTRICT_COORDS = {
  'Guntur':     { lat: 16.3067, lon: 80.4365 },
  'Anantapur':  { lat: 14.6819, lon: 77.6006 },
  'Kurnool':    { lat: 15.8281, lon: 78.0373 },
  'Prakasam':   { lat: 15.3333, lon: 80.0000 },
  'Chittoor':   { lat: 13.2172, lon: 79.1003 },
};

/**
 * Geocode a village + district name to {lat, lon}
 * Uses Nominatim (OpenStreetMap) — free, no key
 */
export async function geocodeVillage(village, district) {
  try {
    const query = `${village}, ${district}, Andhra Pradesh, India`;
    const url = `${NOMINATIM_BASE}?q=${encodeURIComponent(query)}&format=json&limit=1`;
    const res = await fetch(url, {
      headers: { 'Accept-Language': 'en', 'User-Agent': 'KisanAI-HackDemo/1.0' }
    });
    const data = await res.json();
    if (data && data.length > 0) {
      return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
    }
  } catch (err) {
    console.warn('Nominatim geocoding failed, using district fallback:', err);
  }
  // Fallback to district coordinates
  return DISTRICT_COORDS[district] || DISTRICT_COORDS['Guntur'];
}

/**
 * Fetch 7-day weather forecast + hourly soil moisture + air quality
 * Uses Open-Meteo — completely free, no API key required
 */
export async function fetchWeatherData(lat, lon) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    daily: [
      'temperature_2m_max',
      'temperature_2m_min',
      'precipitation_sum',
      'precipitation_probability_max',
      'windspeed_10m_max',
      'sunrise',
      'sunset',
      'uv_index_max',
      'et0_fao_evapotranspiration',
      'weathercode',
    ].join(','),
    hourly: [
      'soil_moisture_0_to_7cm',
      'soil_moisture_7_to_28cm',
      'relative_humidity_2m',
      'temperature_2m',
    ].join(','),
    current_weather: true,
    timezone: 'Asia/Kolkata',
    forecast_days: 7,
  });

  const url = `${OPENMETEO_BASE}?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Open-Meteo error: ${res.status}`);
  const data = await res.json();
  return processWeatherData(data);
}

/**
 * WMO Weather Interpretation Codes → Human readable + emoji
 */
function interpretWeatherCode(code) {
  if (code === 0) return { label: 'Clear Sky', emoji: '☀️' };
  if (code <= 2) return { label: 'Partly Cloudy', emoji: '⛅' };
  if (code <= 3) return { label: 'Overcast', emoji: '☁️' };
  if (code <= 9) return { label: 'Fog', emoji: '🌫️' };
  if (code <= 19) return { label: 'Drizzle', emoji: '🌦️' };
  if (code <= 29) return { label: 'Rain', emoji: '🌧️' };
  if (code <= 39) return { label: 'Snow/Sleet', emoji: '🌨️' };
  if (code <= 49) return { label: 'Fog', emoji: '🌫️' };
  if (code <= 59) return { label: 'Light Drizzle', emoji: '🌦️' };
  if (code <= 69) return { label: 'Rain', emoji: '🌧️' };
  if (code <= 79) return { label: 'Snow', emoji: '❄️' };
  if (code <= 84) return { label: 'Rain Showers', emoji: '🌦️' };
  if (code <= 94) return { label: 'Thunderstorm', emoji: '⛈️' };
  return { label: 'Storm', emoji: '🌩️' };
}

/**
 * Convert raw Open-Meteo response to a clean structured object
 */
function processWeatherData(raw) {
  const daily = raw.daily;
  const hourly = raw.hourly;
  const current = raw.current_weather;

  // Build 7-day forecast array
  const forecast = daily.time.map((date, i) => ({
    date,
    dayLabel: new Date(date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }),
    tempMax: Math.round(daily.temperature_2m_max[i]),
    tempMin: Math.round(daily.temperature_2m_min[i]),
    rain: parseFloat((daily.precipitation_sum[i] || 0).toFixed(1)),
    rainProbability: daily.precipitation_probability_max[i] || 0,
    windMax: Math.round(daily.windspeed_10m_max[i] || 0),
    uvMax: Math.round(daily.uv_index_max[i] || 0),
    et0: parseFloat((daily.et0_fao_evapotranspiration[i] || 0).toFixed(1)),
    sunrise: daily.sunrise[i]?.split('T')[1] || '06:00',
    sunset: daily.sunset[i]?.split('T')[1] || '18:00',
    weather: interpretWeatherCode(daily.weathercode[i] || 0),
  }));

  // Average soil moisture for the current hour window (0-24)
  const now = new Date();
  const currentHourIdx = Math.min(now.getHours(), (hourly.soil_moisture_0_to_7cm?.length || 24) - 1);
  const soilMoisture0 = hourly.soil_moisture_0_to_7cm
    ? parseFloat((hourly.soil_moisture_0_to_7cm[currentHourIdx] * 100).toFixed(1))
    : null;
  const soilMoisture7 = hourly.soil_moisture_7_to_28cm
    ? parseFloat((hourly.soil_moisture_7_to_28cm[currentHourIdx] * 100).toFixed(1))
    : null;
  const humidity = hourly.relative_humidity_2m
    ? hourly.relative_humidity_2m[currentHourIdx]
    : null;

  // Compute total rain in next 3 days and next 5 days
  const rain3Days = forecast.slice(0, 3).reduce((sum, d) => sum + d.rain, 0);
  const rain5Days = forecast.slice(0, 5).reduce((sum, d) => sum + d.rain, 0);
  const rainNextDayIdx = forecast.findIndex((d, i) => i > 0 && d.rain > 0);

  // Dynamic irrigation advisory
  let irrigationAdvisory;
  if (rain3Days > 10) {
    irrigationAdvisory = {
      status: 'safe',
      label: '🌧️ Skip Irrigation',
      message: `${rain3Days.toFixed(1)}mm of rain forecast in next 3 days. Hold irrigation to save water.`,
    };
  } else if (soilMoisture0 !== null && soilMoisture0 < 20) {
    irrigationAdvisory = {
      status: 'critical',
      label: '🚨 Irrigate Now',
      message: `Soil moisture at ${soilMoisture0}% — critically low. Irrigate within 24 hours to prevent crop stress.`,
    };
  } else if (soilMoisture0 !== null && soilMoisture0 < 30) {
    irrigationAdvisory = {
      status: 'warning',
      label: '⚠️ Irrigate Soon',
      message: `Soil moisture at ${soilMoisture0}%. Rain expected in ${rainNextDayIdx > 0 ? rainNextDayIdx + ' days' : 'unknown'}. Monitor closely.`,
    };
  } else {
    irrigationAdvisory = {
      status: 'optimal',
      label: '✅ Optimal',
      message: `Soil moisture levels are good. ${rain5Days > 0 ? rain5Days.toFixed(1) + 'mm rain forecast in 5 days.' : 'Continue monitoring.'}`,
    };
  }

  return {
    current: {
      temp: Math.round(current?.temperature || 0),
      windspeed: Math.round(current?.windspeed || 0),
      weathercode: current?.weathercode || 0,
      weather: interpretWeatherCode(current?.weathercode || 0),
      isDay: current?.is_day,
    },
    forecast,
    soilMoisture0,
    soilMoisture7,
    humidity,
    rain3Days: parseFloat(rain3Days.toFixed(1)),
    rain5Days: parseFloat(rain5Days.toFixed(1)),
    irrigationAdvisory,
    lat: raw.latitude,
    lon: raw.longitude,
    timezone: raw.timezone,
  };
}
