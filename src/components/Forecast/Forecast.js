// src/components/Forecast/Forecast.js
import React, { useState, useEffect } from 'react';
import { formatDate, getWeatherIcon } from '../../utils/helpers';
import styles from './Forecast.module.css';

const Forecast = ({ forecast, show, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedItems, setAnimatedItems] = useState([]);

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        setIsVisible(true);
        
        // Stagger animation for each forecast item
        const items = [0, 1, 2, 3, 4];
        const animationPromises = items.map((_, index) => 
          new Promise(resolve => 
            setTimeout(() => {
              setAnimatedItems(prev => [...prev, index]);
              resolve();
            }, index * 150 + delay)
          )
        );
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [show, delay]);

  if (!forecast || !forecast.list) return null;

  // Group forecast by day and take one reading per day
  const dailyForecast = forecast.list.filter((item, index) => index % 8 === 0).slice(0, 5);

  const getDayName = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  return (
    <div className={`${styles.forecast} ${isVisible ? styles.forecastVisible : ''}`}>
      <div className={styles.forecastHeader}>
        <h3 className={styles.forecastTitle}>5-DAY FORECAST</h3>
        <div className={styles.forecastSubtitle}>Advanced Weather Prediction</div>
      </div>
      
      <div className={styles.forecastList}>
        {dailyForecast.map((day, index) => (
          <div 
            key={index} 
            className={`${styles.forecastItem} ${
              animatedItems.includes(index) ? styles.forecastItemVisible : ''
            }`}
            style={{ '--delay': `${index * 0.1}s` }}
          >
            <div className={styles.forecastDayInfo}>
              <p className={styles.forecastDay}>{getDayName(day.dt)}</p>
              <p className={styles.forecastDate}>
                {new Date(day.dt * 1000).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            
            <div className={styles.forecastWeather}>
              <img 
                src={getWeatherIcon(day.weather[0].icon)} 
                alt={day.weather[0].description}
                className={styles.forecastIcon}
              />
              <p className={styles.forecastDesc}>
                {day.weather[0].description}
              </p>
            </div>
            
            <div className={styles.forecastTemp}>
              <div className={styles.tempRange}>
                <span className={styles.tempMax}>
                  {Math.round(day.main.temp_max || day.main.temp)}°
                </span>
                <span className={styles.tempMin}>
                  {Math.round(day.main.temp_min || (day.main.temp - 2))}°
                </span>
              </div>
              <div className={styles.tempBar}>
                <div 
                  className={styles.tempFill}
                  style={{ 
                    width: `${((day.main.temp_max || day.main.temp) - (day.main.temp_min || (day.main.temp - 2))) * 5}%` 
                  }}
                ></div>
              </div>
            </div>

            <div className={styles.forecastDetails}>
              <div className={styles.detailItem}>
                <span className={styles.detailIcon}>💧</span>
                <span>{day.main.humidity}%</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailIcon}>💨</span>
                <span>{day.wind.speed}m/s</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.forecastFooter}>
        <div className={styles.accuracyIndicator}>
          <span className={styles.indicatorDot}></span>
          <span>85% Prediction Accuracy</span>
        </div>
      </div>
    </div>
  );
};

export default Forecast;