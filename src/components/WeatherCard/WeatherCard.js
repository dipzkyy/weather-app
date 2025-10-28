import React from 'react';
import { formatDate, getWeatherIcon } from '../../utils/helpers';
import styles from './WeatherCard.module.css';

const WeatherCard = ({ weather }) => {
  if (!weather) return null;

  const {
    name,
    main: { temp, feels_like, humidity, pressure } = {},
    weather: weatherInfo = [{}],
    wind: { speed } = {},
    sys: { country } = {},
    dt
  } = weather;

  const { main, description, icon } = weatherInfo[0];

  return (
    <div className={styles.weatherCard}>
      <div className={styles.location}>
        <h2>{name}, {country}</h2>
        <p className={styles.date}>{formatDate(dt)}</p>
      </div>

      <div className={styles.weatherMain}>
        <div className={styles.temperature}>
          <span className={styles.temp}>{Math.round(temp)}°C</span>
          <p className={styles.feelsLike}>Feels like {Math.round(feels_like)}°C</p>
        </div>
        
        <div className={styles.weatherInfo}>
          <img 
            src={getWeatherIcon(icon)} 
            alt={description}
            className={styles.weatherIcon}
          />
          <div>
            <p className={styles.weatherCondition}>{main}</p>
            <p className={styles.weatherDescription}>{description}</p>
          </div>
        </div>
      </div>

      <div className={styles.weatherDetails}>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Kelembaban</span>
          <span className={styles.detailValue}>{humidity}%</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Angin</span>
          <span className={styles.detailValue}>{speed} m/s</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Tekanan</span>
          <span className={styles.detailValue}>{pressure} hPa</span>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;