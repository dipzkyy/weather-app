import React from 'react';
import { formatDate, getWeatherIcon } from '../../utils/helpers';
import styles from './Forecast.module.css';

const Forecast = ({ forecast }) => {
  if (!forecast || !forecast.list) return null;

  // Group forecast by day and take one reading per day
  const dailyForecast = forecast.list.filter((item, index) => index % 8 === 0).slice(0, 5);

  return (
    <div className={styles.forecast}>
      <h3 className={styles.forecastTitle}>5-Day Forecast</h3>
      <div className={styles.forecastList}>
        {dailyForecast.map((day, index) => (
          <div key={index} className={styles.forecastItem}>
            <p className={styles.forecastDay}>
              {formatDate(day.dt).split(',')[0]}
            </p>
            <img 
              src={getWeatherIcon(day.weather[0].icon)} 
              alt={day.weather[0].description}
              className={styles.forecastIcon}
            />
            <div className={styles.forecastTemp}>
              <span className={styles.tempMax}>
                {Math.round(day.main.temp_max || day.main.temp)}°
              </span>
              <span className={styles.tempMin}>
                {Math.round(day.main.temp_min || day.main.temp - 2)}°
              </span>
            </div>
            <p className={styles.forecastDesc}>
              {day.weather[0].description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forecast;