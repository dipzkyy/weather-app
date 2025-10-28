// Forecast.jsx
import React, { useState, useEffect } from 'react';
import styles from './Forecast.module.css';

const Forecast = ({ data = [], title = "7-DAY FORECAST", subtitle = "Extended Weather Outlook" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [itemsVisible, setItemsVisible] = useState([]);

  // Sample data structure if no data is provided
  const defaultData = [
    {
      id: 1,
      day: "Monday",
      date: "Oct 28",
      icon: "☀️",
      description: "sunny",
      tempMax: 28,
      tempMin: 22,
      humidity: 65,
      windSpeed: 12
    },
    {
      id: 2,
      day: "Tuesday",
      date: "Oct 29",
      icon: "⛅",
      description: "partly cloudy",
      tempMax: 26,
      tempMin: 20,
      humidity: 70,
      windSpeed: 10
    },
    {
      id: 3,
      day: "Wednesday",
      date: "Oct 30",
      icon: "🌧️",
      description: "light rain",
      tempMax: 24,
      tempMin: 18,
      humidity: 85,
      windSpeed: 15
    },
    {
      id: 4,
      day: "Thursday",
      date: "Oct 31",
      icon: "☁️",
      description: "cloudy",
      tempMax: 23,
      tempMin: 17,
      humidity: 75,
      windSpeed: 8
    },
    {
      id: 5,
      day: "Friday",
      date: "Nov 1",
      icon: "☀️",
      description: "sunny",
      tempMax: 27,
      tempMin: 21,
      humidity: 60,
      windSpeed: 7
    },
    {
      id: 6,
      day: "Saturday",
      date: "Nov 2",
      icon: "🌤️",
      description: "mostly sunny",
      tempMax: 26,
      tempMin: 20,
      humidity: 65,
      windSpeed: 9
    },
    {
      id: 7,
      day: "Sunday",
      date: "Nov 3",
      icon: "⛅",
      description: "partly cloudy",
      tempMax: 25,
      tempMin: 19,
      humidity: 70,
      windSpeed: 11
    }
  ];

  const forecastData = data.length > 0 ? data : defaultData;

  useEffect(() => {
    // Trigger main container animation
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    // Trigger item animations with delays
    const itemTimers = forecastData.map((_, index) => 
      setTimeout(() => {
        setItemsVisible(prev => [...prev, index]);
      }, 300 + (index * 100))
    );

    return () => {
      clearTimeout(timer);
      itemTimers.forEach(t => clearTimeout(t));
    };
  }, [forecastData.length]);

  const calculateTempPercentage = (min, max) => {
    const range = max - min;
    const percentage = (range / 30) * 100; // Assuming 30° is the max range
    return Math.min(percentage, 100);
  };

  return (
    <div className={`${styles.forecast} ${isVisible ? styles.forecastVisible : ''}`}>
      <div className={styles.forecastHeader}>
        <h2 className={styles.forecastTitle}>{title}</h2>
        <p className={styles.forecastSubtitle}>{subtitle}</p>
      </div>

      <div className={styles.forecastList}>
        {forecastData.map((day, index) => (
          <div 
            key={day.id || index}
            className={`${styles.forecastItem} ${itemsVisible.includes(index) ? styles.forecastItemVisible : ''}`}
            style={{ '--delay': `${index * 0.1}s` }}
          >
            <div className={styles.forecastDayInfo}>
              <h3 className={styles.forecastDay}>{day.day}</h3>
              <p className={styles.forecastDate}>{day.date}</p>
            </div>

            <div className={styles.forecastWeather}>
              <div className={styles.forecastIcon}>{day.icon}</div>
              <p className={styles.forecastDesc}>{day.description}</p>
            </div>

            <div className={styles.forecastTemp}>
              <div className={styles.tempRange}>
                <span className={styles.tempMax}>{day.tempMax}°</span>
                <span className={styles.tempMin}>{day.tempMin}°</span>
              </div>
              <div className={styles.tempBar}>
                <div 
                  className={styles.tempFill} 
                  style={{ width: `${calculateTempPercentage(day.tempMin, day.tempMax)}%` }}
                ></div>
              </div>
            </div>

            <div className={styles.forecastDetails}>
              <div className={styles.detailItem}>
                <span className={styles.detailIcon}>💧</span>
                <span>{day.humidity}%</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailIcon}>💨</span>
                <span>{day.windSpeed} km/h</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.forecastFooter}>
        <div className={styles.accuracyIndicator}>
          <div className={styles.indicatorDot}></div>
          <span>High Accuracy Forecast</span>
        </div>
      </div>
    </div>
  );
};

export default Forecast;