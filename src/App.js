// App.js dengan error boundary dan log
import React, { useState, useEffect } from 'react';
import WeatherCard from './components/WeatherCard/WeatherCard';
import Forecast from './components/Forecast/Forecast';
import Loading from './components/Loading/Loading';
import { getWeather, getForecast } from './services/weatherAPI';
import { getCachedData, cacheData } from './utils/helpers';
import styles from './App.module.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', color: 'white', textAlign: 'center' }}>
          <h2>Oops, something went wrong.</h2>
          <button onClick={() => this.setState({ hasError: false })}>Try again</button>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [initialLoading, setInitialLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);

  console.log('App rendered', { initialLoading, progress, showContent, weather, error });

  // Initial loading screen dengan progress bar
  useEffect(() => {
    console.log('Initial loading effect');
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            console.log('Setting initialLoading to false');
            setInitialLoading(false);
            setShowContent(true);
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
    console.log('initialLoading changed:', initialLoading);
    if (!initialLoading) {
      console.log('Fetching default weather for Jakarta');
      fetchWeather('Jakarta');
    }
  }, [initialLoading]);

  const fetchWeather = async (cityName) => {
    console.log('fetchWeather called with:', cityName);
    if (!cityName.trim()) {
      setError('Nama kota tidak boleh kosong!');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Check cache first
      const cachedWeather = getCachedData(`weather_${cityName}`);
      const cachedForecast = getCachedData(`forecast_${cityName}`);
      
      if (cachedWeather && cachedForecast) {
        console.log('Using cached data');
        setWeather(cachedWeather);
        setForecast(cachedForecast);
        setLoading(false);
        return;
      }

      // Fetch from API
      console.log('Fetching from API');
      const [weatherData, forecastData] = await Promise.all([
        getWeather(cityName),
        getForecast(cityName)
      ]);

      console.log('Weather data received:', weatherData);
      console.log('Forecast data received:', forecastData);

      setWeather(weatherData);
      setForecast(forecastData);

      // Cache the data
      cacheData(`weather_${cityName}`, weatherData);
      cacheData(`forecast_${cityName}`, forecastData);
      
    } catch (err) {
      console.error('Error in fetchWeather:', err);
      setError('Kota tidak ditemukan. Coba nama kota yang lain.');
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
    console.log('Rendering initial loading screen');
    return (
      <div className={styles.initialLoading}>
        <div className={styles.loadingContent}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>⚡</div>
            <h1 className={styles.logoText}>WeatherTech</h1>
          </div>
          <p className={styles.loadingSubtitle}>Real-time Weather Analytics</p>
          
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

  console.log('Rendering main app, showContent:', showContent);

  return (
    <div className={`${styles.app} ${showContent ? styles.appVisible : ''}`}>
      <div className={styles.backgroundAnimation}></div>
      
      <div className={styles.container}>
        {/* Header dengan animasi masuk */}
        <header className={`${styles.header} ${showContent ? styles.headerVisible : ''}`}>
          <div className={styles.headerContent}>
            <div className={styles.logoHeader}>
              <span className={styles.logoIconHeader}>⚡</span>
              <h1 className={styles.title}>WeatherTech</h1>
            </div>
            <p className={styles.subtitle}>Advanced Weather Monitoring System</p>
            
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
                  <span className={styles.searchIcon}>🔍</span>
                </div>
                <button 
                  type="submit" 
                  className={styles.searchButton}
                  disabled={loading}
                >
                  {loading ? (
                    <div className={styles.buttonLoading}>
                      <span className={styles.spinner}></span>
                      ANALYZING
                    </div>
                  ) : (
                    'GET WEATHER'
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

        {/* Main content dengan staggered animation */}
        <main className={styles.main}>
          {loading && <Loading />}
          
          {!loading && weather && forecast && (
            <div className={styles.weatherContent}>
              <WeatherCard 
                weather={weather} 
                show={showContent}
                delay={0}
              />
              <Forecast 
                forecast={forecast} 
                show={showContent}
                delay={200}
              />
            </div>
          )}

          {!loading && !weather && !error && (
            <div className={`${styles.noData} ${showContent ? styles.noDataVisible : ''}`}>
              <div className={styles.noDataIcon}>🌤️</div>
              <h3>Welcome to WeatherTech</h3>
              <p>Enter a city name above to get real-time weather analytics</p>
              <div className={styles.suggestions}>
                <p>Try: <strong>Jakarta, Bandung, Surabaya, Bali, Tokyo</strong></p>
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className={`${styles.footer} ${showContent ? styles.footerVisible : ''}`}>
          <div className={styles.footerContent}>
            <p>Powered by <strong>React.js</strong> & <strong>OpenWeather API</strong></p>
            <p>© 2024 WeatherTech - Advanced Weather Analytics</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

// Export dengan error boundary
export default function AppWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}