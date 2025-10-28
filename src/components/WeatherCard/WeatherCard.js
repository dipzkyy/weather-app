// src/components/WeatherCard/WeatherCard.js
import React, { useState, useEffect } from 'react';
import { formatDate, getWeatherIcon } from '../../utils/helpers';
import styles from './WeatherCard.module.css';

const WeatherCard = ({ weather, show, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [show, delay]);

  if (!weather) return null;

  const {
    name,
    main: { temp, feels_like, humidity, pressure, temp_min, temp_max } = {},
    weather: weatherInfo = [{}],
    wind: { speed } = {},
    sys: { country, sunrise, sunset } = {},
    dt,
    visibility
  } = weather;

  const { main, description, icon } = weatherInfo[0];

  // Calculate day/night based on current time
  const currentTime = new Date().getTime() / 1000;
  const isDay = currentTime > sunrise && currentTime < sunset;

  return (
    <div className={`${styles.weatherCard} ${isVisible ? styles.weatherCardVisible : ''}`}>
      {/* Background Effect */}
      <div className={`${styles.backgroundEffect} ${isDay ? styles.day : styles.night}`}></div>
      
      <div className={styles.weatherHeader}>
        <div className={styles.location}>
          <h2 className={styles.cityName}>{name}</h2>
          <span className={styles.country}>{country}</span>
        </div>
        <div className={styles.dateTime}>
          <p className={styles.date}>{formatDate(dt)}</p>
          <p className={styles.time}>{new Date().toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
          })}</p>
        </div>
      </div>

      <div className={styles.weatherMain}>
        <div className={styles.temperatureSection}>
          <div className={styles.temperature}>
            <span className={styles.tempValue}>{Math.round(temp)}</span>
            <span className={styles.tempUnit}>°C</span>
          </div>
          <p className={styles.feelsLike}>
            Feels like {Math.round(feels_like)}°C
          </p>
          <div className={styles.tempRange}>
            <span className={styles.tempMin}>L: {Math.round(temp_min)}°</span>
            <span className={styles.tempMax}>H: {Math.round(temp_max)}°</span>
          </div>
        </div>
        
        <div className={styles.weatherCondition}>
          <img 
            src={getWeatherIcon(icon)} 
            alt={description}
            className={styles.weatherIcon}
          />
          <div className={styles.conditionInfo}>
            <p className={styles.conditionMain}>{main}</p>
            <p className={styles.conditionDescription}>{description}</p>
          </div>
        </div>
      </div>

      <div className={styles.weatherGrid}>
        <div className={styles.weatherItem}>
          <div className={styles.weatherIconWrapper}>
            <span className={styles.itemIcon}>💨</span>
          </div>
          <div className={styles.weatherInfo}>
            <span className={styles.itemLabel}>Wind Speed</span>
            <span className={styles.itemValue}>{speed} m/s</span>
          </div>
        </div>
        
        <div className={styles.weatherItem}>
          <div className={styles.weatherIconWrapper}>
            <span className={styles.itemIcon}>💧</span>
          </div>
          <div className={styles.weatherInfo}>
            <span className={styles.itemLabel}>Humidity</span>
            <span className={styles.itemValue}>{humidity}%</span>
          </div>
        </div>
        
        <div className={styles.weatherItem}>
          <div className={styles.weatherIconWrapper}>
            <span className={styles.itemIcon}>🌡️</span>
          </div>
          <div className={styles.weatherInfo}>
            <span className={styles.itemLabel}>Pressure</span>
            <span className={styles.itemValue}>{pressure} hPa</span>
          </div>
        </div>
        
        <div className={styles.weatherItem}>
          <div className={styles.weatherIconWrapper}>
            <span className={styles.itemIcon}>👁️</span>
          </div>
          <div className={styles.weatherInfo}>
            <span className={styles.itemLabel}>Visibility</span>
            <span className={styles.itemValue}>{visibility ? (visibility / 1000).toFixed(1) : 'N/A'} km</span>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className={styles.additionalInfo}>
        <div className={styles.sunTimes}>
          <div className={styles.sunTime}>
            <span className={styles.sunIcon}>🌅</span>
            <span>Sunrise: {new Date(sunrise * 1000).toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: true 
            })}</span>
          </div>
          <div className={styles.sunTime}>
            <span className={styles.sunIcon}>🌇</span>
            <span>Sunset: {new Date(sunset * 1000).toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: true 
            })}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;