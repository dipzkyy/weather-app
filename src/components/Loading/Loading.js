// src/components/Loading/Loading.js - UPDATE
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
          <h3 className={styles.loadingTitle}>SCANNING COSMIC DATA</h3>
          <p className={styles.loadingSubtitle}>Analyzing interstellar weather patterns</p>
        </div>
        
        <div className={styles.progressSection}>
          <div className={styles.progressInfo}>
            <span className={styles.progressLabel}>STELLAR MAPPING</span>
            <span className={styles.progressPercentage}>78%</span>
          </div>
          <div className={styles.progressContainer}>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill}
                style={{ width: '78%' }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className={styles.loadingStats}>
          <div className={styles.statItem}>
            <span className={styles.statIcon}>🛰️</span>
            <span className={styles.statText}>Orbital Scan</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statIcon}>🌌</span>
            <span className={styles.statText}>Cosmic Analysis</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statIcon}>📡</span>
            <span className={styles.statText}>Signal Processing</span>
          </div>
        </div>
        
        <div className={styles.scanLine}></div>
      </div>
    </div>
  );
};

export default Loading;