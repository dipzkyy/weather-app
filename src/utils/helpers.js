// src/utils/helpers.js

// Cache data dengan expiry time (10 menit)
export const cacheData = (key, data) => {
  const item = {
    data,
    timestamp: Date.now()
  };
  localStorage.setItem(key, JSON.stringify(item));
};

export const getCachedData = (key) => {
  const cached = localStorage.getItem(key);
  if (!cached) return null;

  try {
    const { data, timestamp } = JSON.parse(cached);
    const now = Date.now();
    const tenMinutes = 10 * 60 * 1000;

    if (now - timestamp < tenMinutes) {
      return data;
    }

    localStorage.removeItem(key);
    return null;
  } catch (error) {
    return null;
  }
};

// Format tanggal
export const formatDate = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatTime = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

// Get weather icon URL
export const getWeatherIcon = (iconCode) => {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};

// Validate city input
export const validateCity = (city) => {
  if (!city || city.trim() === '') {
    return 'City name cannot be empty';
  }
  
  if (city.length < 2) {
    return 'City name must be at least 2 characters long';
  }
  
  if (!/^[a-zA-Z\s\-',.]+$/.test(city)) {
    return 'City name contains invalid characters';
  }
  
  return null;
};

// Get appropriate background based on weather condition
export const getWeatherBackground = (condition) => {
  const conditions = {
    'Clear': 'linear-gradient(135deg, #ff9a00 0%, #ff6a00 100%)',
    'Clouds': 'linear-gradient(135deg, #bdc3c7 0%, #2c3e50 100%)',
    'Rain': 'linear-gradient(135deg, #0052D4 0%, #4364F7 50%, #6FB1FC 100%)',
    'Snow': 'linear-gradient(135deg, #E6DADA 0%, #274046 100%)',
    'Thunderstorm': 'linear-gradient(135deg, #0F2027 0%, #203A43 50%, #2C5364 100%)',
    'Drizzle': 'linear-gradient(135deg, #89F7FE 0%, #66A6FF 100%)',
    'Mist': 'linear-gradient(135deg, #606c88 0%, #3f4c6b 100%)',
    'default': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  };
  
  return conditions[condition] || conditions['default'];
};

// Get weather icon emoji
export const getWeatherEmoji = (condition) => {
  const emojis = {
    'Clear': '☀️',
    'Clouds': '☁️',
    'Rain': '🌧️',
    'Snow': '❄️',
    'Thunderstorm': '⛈️',
    'Drizzle': '🌦️',
    'Mist': '🌫️',
    'default': '🌈'
  };
  
  return emojis[condition] || emojis['default'];
};

// Format wind direction
export const getWindDirection = (degrees) => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
};

// Calculate feels like temperature with humidity
export const calculateFeelsLike = (temp, humidity, windSpeed) => {
  // Simple approximation of heat index
  if (temp >= 27) {
    // Hot weather feels hotter with high humidity
    return Math.round(temp + (humidity / 100) * 2);
  } else if (temp <= 10) {
    // Cold weather feels colder with wind (wind chill approximation)
    return Math.round(temp - (windSpeed / 10) * 2);
  }
  return Math.round(temp);
};