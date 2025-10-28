import React, { useState, useEffect } from 'react';
import WeatherCard from './components/WeatherCard/WeatherCard';
import Forecast from './components/Forecast/Forecast';
import Loading from './components/Loading/Loading';
import ParticleBackground from './components/ParticleBackground/ParticleBackground';
import { getWeather, getForecast } from './services/weatherAPI';
import { getCachedData, cacheData } from './utils/helpers'; 
import styles from './App.module.css';

function App() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [initialLoading, setInitialLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [appReady, setAppReady] = useState(false);

  console.log('App State:', { initialLoading, appReady, weather, forecast, loading, error }); // Debug log

  // Initial loading screen dengan progress bar
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setInitialLoading(false);
            setAppReady(true);
          }, 500);
          return 100;
        }
        return Math.min(oldProgress + 10, 100);
      });
    }, 100);

    return () => clearInterval(timer);
  }, []);

  // Load default weather setelah initial loading
  useEffect(() => {
    if (appReady) {
      console.log('App ready, fetching default weather...'); // Debug log
      fetchWeather('Jakarta');
    }
  }, [appReady]);

  const fetchWeather = async (cityName) => {
    if (!cityName.trim()) {
      setError('Nama kota tidak boleh kosong!');
      return;
    }

    console.log('Fetching weather for:', cityName); // Debug log
    setLoading(true);
    setError('');
    
    try {
      // Check cache first
      const cachedWeather = getCachedData(`weather_${cityName}`);
      const cachedForecast = getCachedData(`forecast_${cityName}`);
      
      if (cachedWeather && cachedForecast) {
        console.log('Using cached data'); // Debug log
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

      console.log('API Data received:', { weatherData, forecastData }); // Debug log

      setWeather(weatherData);
      setForecast(forecastData);

      // Cache the data
      cacheData(`weather_${cityName}`, weatherData);
      cacheData(`forecast_${cityName}`, forecastData);
      
    } catch (err) {
      console.error('Error fetching weather:', err); // Debug log
      setError('Kota tidak ditemukan. Coba nama kota yang lain.');
      // Reset data on error
      setWeather(null);
      setForecast(null);
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

  const handleRetry = () => {
    if (city.trim()) {
      fetchWeather(city.trim());
    }
  };

  // Initial loading screen
  if (initialLoading) {
    return (
      <div className={styles.initialLoading}>
        <ParticleBackground />
        <div className={styles.loadingContent}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>🌌</div>
            <h1 className={styles.logoText}>Cosmic Weather</h1>
          </div>
          <p className={styles.loadingSubtitle}>Exploring Weather Across the Universe</p>
          
          <div className={styles.progressContainer}>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill} 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className={styles.progressText}>{progress}%</span>
          </div>
          
          <div className={styles.loadingDots}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    );
  }

  // Main app content
  return (
    <div style={{ minHeight: '100vh', background: '#050505' }}>
      <ParticleBackground />
      
      <div className={styles.app}>
        <div className={styles.container}>
          {/* Header - Always visible after loading */}
          <header className={styles.header}>
            <div className={styles.headerContent}>
              <div className={styles.logoHeader}>
                <span className={styles.logoIconHeader}>🌌</span>
                <h1 className={styles.title}>Cosmic Weather</h1>
              </div>
              <p className={styles.subtitle}>Stellar Weather Monitoring System</p>
              
              <form onSubmit={handleSearch} className={styles.searchForm}>
                <div className={styles.searchContainer}>
                  <div className={styles.inputWrapper}>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => {
                        setCity(e.target.value);
                        setError('');
                      }}
                      placeholder="Enter city name (e.g., Jakarta, London, Tokyo)..."
                      className={`${styles.searchInput} ${error ? styles.inputError : ''}`}
                      disabled={loading}
                    />
                    <span className={styles.searchIcon}>🔭</span>
                  </div>
                  <button 
                    type="submit" 
                    className={styles.searchButton}
                    disabled={loading}
                  >
                    {loading ? (
                      <div className={styles.buttonLoading}>
                        <span className={styles.spinner}></span>
                        SCANNING
                      </div>
                    ) : (
                      'EXPLORE'
                    )}
                  </button>
                </div>
                {error && (
                  <div className={styles.errorMessage}>
                    <span className={styles.errorIcon}>⚠</span>
                    {error}
                    <button onClick={handleRetry} className={styles.retryButton}>
                      TRY AGAIN
                    </button>
                  </div>
                )}
              </form>
            </div>
          </header>

          {/* Main content */}
          <main className={styles.main}>
            {loading && <Loading />}
            
            {!loading && weather && forecast ? (
              <div className={styles.weatherContent}>
                <WeatherCard weather={weather} show={true} />
                <Forecast forecast={forecast} />
              </div>
            ) : !loading && !weather && !error ? (
              <div className={styles.noData}>
                <div className={styles.noDataIcon}>🌠</div>
                <h3>Welcome to Cosmic Weather</h3>
                <p>Enter a city name above to explore stellar weather patterns</p>
                <div className={styles.suggestions}>
                  <p>Try: <strong>Jakarta, Bandung, Surabaya, Bali, Tokyo</strong></p>
                </div>
              </div>
            ) : null}
          </main>

          {/* Footer */}
          <footer className={styles.footer}>
            <div className={styles.footerContent}>
              <p>Powered by <strong>React.js</strong> & <strong>OpenWeather API</strong></p>
              <p>© 2025 Weather App - Dipzkyy</p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default App;