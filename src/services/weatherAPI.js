// src/services/weatherAPI.js
import axios from 'axios';

// ✅ GUNAKAN INI - dari gambar terbaru Anda
const API_KEY = process.env.REACT_APP_WEATHER_API_KEY || 'a75dad8453ed0727f52ca8dee8b683d6';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000, // timeout lebih lama
});

export const getWeather = async (city) => {
  try {
    console.log('🔑 Using API Key:', API_KEY);
    console.log('🌍 Fetching weather for:', city);
    
    const response = await api.get('/weather', {
      params: {
        q: city,
        appid: API_KEY,
        units: 'metric',
        lang: 'id'
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
    return getMockWeatherData(city);
  }
};

export const getForecast = async (city) => {
  try {
    const response = await api.get('/forecast', {
      params: {
        q: city,
        appid: API_KEY,
        units: 'metric', 
        lang: 'id'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Forecast API Error:', error.response?.data);
    return getMockForecastData(city);
  }
};

// Mock data sebagai fallback
const getMockWeatherData = (city) => {
  const cities = {
    'jakarta': { temp: 32, condition: 'Cerah', humidity: 70 },
    'bandung': { temp: 25, condition: 'Dingin', humidity: 80 },
    'surabaya': { temp: 34, condition: 'Panas', humidity: 65 },
    'bali': { temp: 30, condition: 'Cerah', humidity: 75 },
    'default': { temp: 28, condition: 'Berawan', humidity: 70 }
  };
  
  const cityData = cities[city.toLowerCase()] || cities['default'];
  
  return {
    name: city,
    main: {
      temp: cityData.temp,
      feels_like: cityData.temp + 2,
      humidity: cityData.humidity,
      pressure: 1010
    },
    weather: [{ main: cityData.condition, description: cityData.condition }],
    wind: { speed: 3.6 },
    sys: { country: "ID" }
  };
};

const getMockForecastData = (city) => {
  return {
    list: [
      { dt: Date.now()/1000 + 86400, main: { temp: 30 }, weather: [{ description: "cerah" }] },
      { dt: Date.now()/1000 + 172800, main: { temp: 29 }, weather: [{ description: "hujan" }] },
      { dt: Date.now()/1000 + 259200, main: { temp: 31 }, weather: [{ description: "berawan" }] }
    ]
  };
};