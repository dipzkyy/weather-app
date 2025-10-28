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
  return new Date(timestamp * 1000).toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatTime = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Get weather icon URL
export const getWeatherIcon = (iconCode) => {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};