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

  // Load default weather on component mount
  useEffect(() => {
    const defaultCity = 'Jakarta';
    setCity(defaultCity);
    fetchWeather(defaultCity);
  }, []);

  const fetchWeather = async (cityName) => {
    setLoading(true);
    setError('');
    setInitialLoad(false);
    
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

      // Validate API response
      if (!weatherData || !forecastData) {
        throw new Error('Data cuaca tidak tersedia');
      }

      if (weatherData.cod !== 200) {
        throw new Error(weatherData.message || 'Kota tidak ditemukan');
      }

      setWeather(weatherData);
      setForecast(forecastData);

      // Cache the data
      cacheData(`weather_${cityName}`, weatherData);
      cacheData(`forecast_${cityName}`, forecastData);
      
    } catch (err) {
      console.error('Error fetching weather:', err);
      
      // Handle different error types
      if (err.message.includes('404') || err.message.includes('city not found')) {
        setError('Kota tidak ditemukan. Coba nama kota yang lain.');
      } else if (err.message.includes('network') || err.message.includes('Network')) {
        setError('Koneksi internet bermasalah. Cek koneksi Anda.');
      } else if (err.message.includes('API key')) {
        setError('API key tidak valid. Silakan cek konfigurasi.');
      } else {
        setError(err.message || 'Terjadi kesalahan. Silakan coba lagi.');
      }
      
      // Clear weather data on error
      setWeather(null);
      setForecast(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (city.trim()) {
      fetchWeather(city.trim());
    }
  };

  const handleRetry = () => {
    if (city.trim()) {
      fetchWeather(city.trim());
    }
  };

  const getWelcomeMessage = () => {
    const hours = new Date().getHours();
    if (hours < 12) return 'Selamat Pagi';
    if (hours < 15) return 'Selamat Siang';
    if (hours < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  };

  return (
    <div className={styles.app}>
      <div className={styles.container}>
        {/* Header Section */}
        <header className={styles.header}>
          <h1 className={styles.title}>🌤️ Weather App</h1>
          <p className={styles.subtitle}>Cek cuaca terkini di mana saja</p>
          
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <div className={styles.searchContainer}>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Masukkan nama kota (contoh: Jakarta, Bandung, Surabaya)..."
                className={styles.searchInput}
                disabled={loading}
              />
              <button 
                type="submit" 
                className={styles.searchButton}
                disabled={loading || !city.trim()}
              >
                {loading ? '...' : 'Cari'}
              </button>
            </div>
          </form>
        </header>

        {/* Main Content Section */}
        <main className={styles.main}>
          {/* Loading State */}
          {loading && (
            <div className={styles.loadingState}>
              <div className={styles.loadingSpinner}></div>
              <p className={styles.loadingText}>Memuat data cuaca...</p>
              <p className={styles.loadingSubtext}>Sedang mengambil informasi terbaru</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className={styles.error}>
              <div className={styles.errorIcon}>⚠️</div>
              <h3>Terjadi Kesalahan</h3>
              <p>{error}</p>
              <button 
                onClick={handleRetry}
                className={styles.retryButton}
              >
                Coba Lagi
              </button>
            </div>
          )}

          {/* Welcome/No Data State */}
          {!loading && !weather && !error && (
            <div className={styles.noData}>
              <div className={styles.noDataIcon}>🌤️</div>
              <h3>{getWelcomeMessage()}!</h3>
              <p>Masukkan nama kota di atas untuk melihat informasi cuaca terkini</p>
              <div className={styles.suggestions}>
                <p>Coba kota: <strong>Jakarta, Bandung, Surabaya, Bali, Yogyakarta</strong></p>
              </div>
            </div>
          )}

          {/* Weather Data Display */}
          {!loading && weather && forecast && (
            <div className={styles.weatherContent}>
              <WeatherCard weather={weather} />
              <Forecast forecast={forecast} />
              
              {/* Last Updated Info */}
              <div className={styles.lastUpdated}>
                <p>Terakhir diperbarui: {new Date().toLocaleTimeString('id-ID')}</p>
              </div>
            </div>
          )}
        </main>

        {/* Footer Section */}
        <footer className={styles.footer}>
          <div className={styles.footerContent}>
            <p>Data provided by <a href="https://openweathermap.org/" target="_blank" rel="noopener noreferrer">OpenWeatherMap</a></p>
            <p>Dibuat dengan ❤️ menggunakan React.js</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;