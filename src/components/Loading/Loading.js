// src/components/Loading/Loading.js
import React from 'react';
import styles from './Loading.module.css';

const Loading = () => {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingContent}>
        <div className={styles.techLoader}>
          <div className={styles.orbital}>
            <div className={styles.orbit}></div>
            <div className={styles.orbit}></div>
            <div className={styles.orbit}></div>
            <div className={styles.center}></div>
          </div>
        </div>
        
        <div className={styles.loadingText}>
          <h3 className={styles.loadingTitle}>ANALYZING WEATHER DATA</h3>
          <p className={styles.loadingSubtitle}>Processing real-time meteorological information</p>
        </div>
        
        <div className={styles.progressSection}>
          <div className={styles.progressInfo}>
            <span className={styles.progressLabel}>DATA INTEGRITY CHECK</span>
            <span className={styles.progressPercentage}>65%</span>
          </div>
          <div className={styles.progressContainer}>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill}
                style={{ width: '65%' }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className={styles.loadingStats}>
          <div className={styles.statItem}>
            <span className={styles.statIcon}>⚡</span>
            <span className={styles.statText}>Fetching API</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statIcon}>🔍</span>
            <span className={styles.statText}>Analyzing Patterns</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statIcon}>📊</span>
            <span className={styles.statText}>Generating Forecast</span>
          </div>
        </div>
        
        <div className={styles.scanLine}></div>
      </div>
    </div>
  );
};

export default Loading;