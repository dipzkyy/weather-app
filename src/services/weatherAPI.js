// src/services/weatherAPI.js
import axios from 'axios';

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY || 'a75dad8453ed0727f52ca8dee8b683d6';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

// Enhanced mock data dengan data yang lebih lengkap
const createMockWeatherData = (city) => {
  const cities = {
    'jakarta': { 
      temp: 32, 
      condition: 'Clouds', 
      description: 'scattered clouds', 
      humidity: 70,
      windSpeed: 3.6,
      pressure: 1010,
      visibility: 10
    },
    'bandung': { 
      temp: 25, 
      condition: 'Rain', 
      description: 'light rain', 
      humidity: 85,
      windSpeed: 2.1,
      pressure: 1012,
      visibility: 8
    },
    'surabaya': { 
      temp: 34, 
      condition: 'Clear', 
      description: 'clear sky', 
      humidity: 65,
      windSpeed: 4.2,
      pressure: 1008,
      visibility: 12
    },
    'bali': { 
      temp: 30, 
      condition: 'Clear', 
      description: 'few clouds', 
      humidity: 75,
      windSpeed: 5.1,
      pressure: 1011,
      visibility: 15
    },
    'yogyakarta': { 
      temp: 28, 
      condition: 'Clouds', 
      description: 'broken clouds', 
      humidity: 80,
      windSpeed: 2.8,
      pressure: 1010,
      visibility: 9
    },
    'default': { 
      temp: 28, 
      condition: 'Clouds', 
      description: 'overcast clouds', 
      humidity: 70,
      windSpeed: 3.0,
      pressure: 1010,
      visibility: 10
    }
  };
  
  const cityKey = city.toLowerCase();
  const cityData = cities[cityKey] || cities['default'];
  
  // Calculate sunrise and sunset times (mock)
  const now = Math.floor(Date.now() / 1000);
  const sunrise = now - (3600 * 3); // 3 hours ago
  const sunset = now + (3600 * 5); // 5 hours from now
  
  return {
    coord: { lon: 106.8451, lat: -6.2146 },
    weather: [{ 
      id: 801, 
      main: cityData.condition, 
      description: cityData.description, 
      icon: cityData.condition === 'Clear' ? '01d' : '02d' 
    }],
    main: { 
      temp: cityData.temp,
      feels_like: cityData.temp + 2,
      temp_min: cityData.temp - 3,
      temp_max: cityData.temp + 5,
      humidity: cityData.humidity,
      pressure: cityData.pressure
    },
    wind: { 
      speed: cityData.windSpeed,
      deg: 180 
    },
    sys: { 
      country: "ID",
      sunrise: sunrise,
      sunset: sunset
    },
    name: city,
    dt: now,
    visibility: cityData.visibility * 1000 // Convert to meters
  };
};

const createMockForecastData = (city) => {
  const forecastList = [];
  const baseTime = Math.floor(Date.now() / 1000);
  
  for (let i = 0; i < 40; i += 8) { // 5 days, 8 readings per day
    const baseTemp = 25 + Math.random() * 8;
    const conditions = [
      { main: "Clear", description: "clear sky", icon: "01d" },
      { main: "Clouds", description: "few clouds", icon: "02d" },
      { main: "Clouds", description: "scattered clouds", icon: "03d" },
      { main: "Clouds", description: "broken clouds", icon: "04d" },
      { main: "Rain", description: "light rain", icon: "10d" },
      { main: "Rain", description: "moderate rain", icon: "10d" }
    ];
    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
    
    forecastList.push({
      dt: baseTime + (i * 10800), // Every 3 hours
      main: { 
        temp: Math.round(baseTemp * 10) / 10,
        temp_min: Math.round((baseTemp - 2) * 10) / 10,
        temp_max: Math.round((baseTemp + 3) * 10) / 10,
        humidity: 60 + Math.floor(Math.random() * 30),
        pressure: 1000 + Math.floor(Math.random() * 20)
      },
      weather: [randomCondition],
      wind: {
        speed: Math.round((1 + Math.random() * 8) * 10) / 10,
        deg: Math.floor(Math.random() * 360)
      }
    });
  }
  
  return { list: forecastList };
};

export const getWeather = async (city) => {
  try {
    console.log('🔑 Using API Key:', API_KEY);
    console.log('🌍 Fetching weather for:', city);
    
    const response = await api.get('/weather', {
      params: {
        q: city,
        appid: API_KEY,
        units: 'metric',
        lang: 'en'
      }
    });
    
    console.log('✅ API Success:', response.data);
    return response.data;
    
  } catch (error) {
    console.error('❌ API Error:', {
      status: error.response?.status,
      message: error.response?.data?.message,
      fullError: error.response?.data
    });
    
    // Fallback ke mock data jika API masih error
    console.log('🔄 Using mock data as fallback');
    return createMockWeatherData(city);
  }
};

export const getForecast = async (city) => {
  try {
    const response = await api.get('/forecast', {
      params: {
        q: city,
        appid: API_KEY,
        units: 'metric',
        lang: 'en'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Forecast API Error:', error.response?.data);
    console.log('🔄 Using mock forecast data as fallback');
    return createMockForecastData(city);
  }
};