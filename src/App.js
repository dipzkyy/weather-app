// src/App.js
import React, { useState, useEffect } from 'react';
import WeatherCard from './components/WeatherCard/WeatherCard';
import Forecast from './components/Forecast/Forecast';
import Loading from './components/Loading/Loading';
import { getWeather, getForecast } from './services/weatherAPI';
import { getCachedData, cacheData } from './utils/helpers';
import styles from './App.module.css';

function App() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [initialLoad, setInitialLoad] = useState(true);
  const [progress, setProgress] = useState(0);

  // Simulate initial loading with progress bar
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          clearInterval(timer);
          setInitialLoad(false);
          return 100;
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 200);

    return () => {
      clearInterval(timer);
    };
  }, []);

  // Load default weather after initial load
  useEffect(() => {
    if (!initialLoad) {
      fetchWeather('Jakarta');
    }
  }, [initialLoad]);

  const fetchWeather = async (cityName) => {
    setLoading(true);
    setError('');
    
    try {
      // Check cache first
      const cachedWeather = getCachedData(`weather_${cityName}`);
      const cachedForecast = getCachedData(`forecast_${cityName}`);
      
      if (cachedWeather && cachedForecast) {
        setWeather(cachedWeather);
        setForecast(cachedForecast);
        setLoading(false);
        return;
      }

      // Fetch from API
      const [weatherData, forecastData] = await Promise.all([
        getWeather(cityName),
        getForecast(cityName)
      ]);

      setWeather(weatherData);
      setForecast(forecastData);

      // Cache the data
      cacheData(`weather_${cityName}`, weatherData);
      cacheData(`forecast_${cityName}`, forecastData);
      
    } catch (err) {
      setError('Kota tidak ditemukan. Coba nama kota yang lain.');
      console.error('Error fetching weather:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!city.trim()) {
      setError('Nama kota tidak boleh kosong!');
      return;
    }
    fetchWeather(city.trim());
  };

  if (initialLoad) {
    return (
      <div className={styles.initialLoading}>
        <div className={styles.loadingContent}>
          <h1 className={styles.loadingTitle}>Weather App</h1>
          <div className={styles.progressBarContainer}>
            <div 
              className={styles.progressBar} 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className={styles.loadingPercentage}>{Math.round(progress)}%</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.app}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>🌤️ Weather App</h1>
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Masukkan nama kota..."
              className={styles.searchInput}
            />
            <button type="submit" className={styles.searchButton}>
              Cari
            </button>
          </form>
          {error && <p className={styles.errorMessage}>{error}</p>}
        </header>

        <main className={styles.main}>
          {loading && <Loading />}
          
          {!loading && weather && (
            <div className={styles.weatherContent}>
              <WeatherCard weather={weather} />
              <Forecast forecast={forecast} />
            </div>
          )}

          {!loading && !weather && !error && (
            <div className={styles.noData}>
              <p>Masukkan nama kota untuk melihat cuaca</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;