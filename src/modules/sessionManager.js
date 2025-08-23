import { APP_STATES } from '../utils/constants.js';
import { calculateSessionDuration } from '../utils/helpers.js';

/**
 * Manages session state, progress tracking, and persistence
 */
export class SessionManager {
  constructor() {
    this.currentState = APP_STATES.SETUP;
    this.sessionConfig = null;
    this.sessionStats = null;
    this.listeners = {
      stateChange: [],
      statsUpdate: []
    };
    
    this.loadSessionHistory();
  }

  /**
   * Initialize a new session
   * @param {Object} technique - Breathing technique configuration
   * @param {string} mode - Session mode ID
   * @param {number} customSets - Custom number of sets (for custom mode)
   */
  initializeSession(technique, mode, customSets = null) {
    this.sessionConfig = {
      technique,
      mode,
      customSets,
      totalSets: customSets || mode.sets,
      startTime: new Date(),
      duration: calculateSessionDuration(technique, customSets || mode.sets)
    };

    this.sessionStats = {
      currentSet: 1,
      completedSets: 0,
      totalSets: this.sessionConfig.totalSets,
      startTime: this.sessionConfig.startTime,
      pausedTime: 0,
      isActive: false,
      isPaused: false
    };

    this.setState(APP_STATES.SESSION_ACTIVE);
  }

  /**
   * Start the session
   */
  startSession() {
    if (this.sessionStats) {
      this.sessionStats.isActive = true;
      this.sessionStats.isPaused = false;
      this.notifyStatsUpdate();
    }
  }

  /**
   * Pause the session
   */
  pauseSession() {
    if (this.sessionStats) {
      this.sessionStats.isPaused = true;
      this.sessionStats.pauseStartTime = new Date();
      this.setState(APP_STATES.SESSION_PAUSED);
      this.notifyStatsUpdate();
    }
  }

  /**
   * Resume the session
   */
  resumeSession() {
    if (this.sessionStats && this.sessionStats.pauseStartTime) {
      const pauseDuration = new Date() - this.sessionStats.pauseStartTime;
      this.sessionStats.pausedTime += pauseDuration;
      this.sessionStats.isPaused = false;
      delete this.sessionStats.pauseStartTime;
      this.setState(APP_STATES.SESSION_ACTIVE);
      this.notifyStatsUpdate();
    }
  }

  /**
   * Update session progress
   * @param {number} currentSet - Current set number
   * @param {number} completedSets - Number of completed sets
   */
  updateProgress(currentSet, completedSets) {
    if (this.sessionStats) {
      this.sessionStats.currentSet = currentSet;
      this.sessionStats.completedSets = completedSets;
      this.notifyStatsUpdate();
    }
  }

  /**
   * Complete the session
   */
  completeSession() {
    if (this.sessionStats) {
      this.sessionStats.endTime = new Date();
      this.sessionStats.isActive = false;
      this.sessionStats.totalDuration = this.sessionStats.endTime - this.sessionStats.startTime - this.sessionStats.pausedTime;
      
      this.saveSessionToHistory();
      this.setState(APP_STATES.SESSION_COMPLETE);
    }
  }

  /**
   * Reset to setup state
   */
  resetToSetup() {
    this.sessionConfig = null;
    this.sessionStats = null;
    this.setState(APP_STATES.SETUP);
  }

  /**
   * Set application state
   * @param {string} newState - New application state
   */
  setState(newState) {
    const oldState = this.currentState;
    this.currentState = newState;
    this.notifyStateChange(oldState, newState);
  }

  /**
   * Get current session statistics
   * @returns {Object|null} Session statistics
   */
  getSessionStats() {
    return this.sessionStats ? { ...this.sessionStats } : null;
  }

  /**
   * Get current session configuration
   * @returns {Object|null} Session configuration
   */
  getSessionConfig() {
    return this.sessionConfig ? { ...this.sessionConfig } : null;
  }

  /**
   * Get session progress percentage
   * @returns {number} Progress percentage (0-100)
   */
  getProgressPercentage() {
    if (!this.sessionStats) return 0;
    return Math.round((this.sessionStats.completedSets / this.sessionStats.totalSets) * 100);
  }

  /**
   * Get elapsed time in milliseconds
   * @returns {number} Elapsed time
   */
  getElapsedTime() {
    if (!this.sessionStats || !this.sessionStats.startTime) return 0;
    
    const now = new Date();
    const elapsed = now - this.sessionStats.startTime - this.sessionStats.pausedTime;
    
    if (this.sessionStats.isPaused && this.sessionStats.pauseStartTime) {
      return elapsed - (now - this.sessionStats.pauseStartTime);
    }
    
    return elapsed;
  }

  /**
   * Save session to local storage history
   */
  saveSessionToHistory() {
    if (!this.sessionConfig || !this.sessionStats) return;

    const sessionRecord = {
      id: Date.now().toString(),
      technique: this.sessionConfig.technique,
      mode: this.sessionConfig.mode,
      totalSets: this.sessionStats.totalSets,
      completedSets: this.sessionStats.completedSets,
      startTime: this.sessionStats.startTime,
      endTime: this.sessionStats.endTime,
      totalDuration: this.sessionStats.totalDuration,
      pausedTime: this.sessionStats.pausedTime
    };

    const history = this.getSessionHistory();
    history.unshift(sessionRecord);
    
    // Keep only last 50 sessions
    const trimmedHistory = history.slice(0, 50);
    
    try {
      localStorage.setItem('breathing-app-history', JSON.stringify(trimmedHistory));
    } catch (error) {
      console.warn('Failed to save session history:', error);
    }
  }

  /**
   * Load session history from local storage
   * @returns {Array} Session history
   */
  loadSessionHistory() {
    try {
      const stored = localStorage.getItem('breathing-app-history');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.warn('Failed to load session history:', error);
      return [];
    }
  }

  /**
   * Get session history
   * @returns {Array} Session history
   */
  getSessionHistory() {
    return this.loadSessionHistory();
  }

  /**
   * Get session statistics summary
   * @returns {Object} Statistics summary
   */
  getStatsSummary() {
    const history = this.getSessionHistory();
    
    return {
      totalSessions: history.length,
      totalTime: history.reduce((sum, session) => sum + (session.totalDuration || 0), 0),
      averageSessionLength: history.length > 0 
        ? history.reduce((sum, session) => sum + (session.totalSets || 0), 0) / history.length 
        : 0,
      favoriteMode: this.getMostUsedMode(history),
      favoriteTechnique: this.getMostUsedTechnique(history)
    };
  }

  /**
   * Get most used session mode
   * @param {Array} history - Session history
   * @returns {string} Most used mode
   */
  getMostUsedMode(history) {
    const modeCounts = {};
    history.forEach(session => {
      const modeId = session.mode?.id || 'unknown';
      modeCounts[modeId] = (modeCounts[modeId] || 0) + 1;
    });
    
    return Object.entries(modeCounts).sort(([,a], [,b]) => b - a)[0]?.[0] || null;
  }

  /**
   * Get most used breathing technique
   * @param {Array} history - Session history
   * @returns {string} Most used technique
   */
  getMostUsedTechnique(history) {
    const techniqueCounts = {};
    history.forEach(session => {
      const techniqueId = session.technique?.id || 'unknown';
      techniqueCounts[techniqueId] = (techniqueCounts[techniqueId] || 0) + 1;
    });
    
    return Object.entries(techniqueCounts).sort(([,a], [,b]) => b - a)[0]?.[0] || null;
  }

  /**
   * Add event listener
   * @param {string} event - Event type
   * @param {Function} callback - Callback function
   */
  addEventListener(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event].push(callback);
    }
  }

  /**
   * Remove event listener
   * @param {string} event - Event type
   * @param {Function} callback - Callback function
   */
  removeEventListener(event, callback) {
    if (this.listeners[event]) {
      const index = this.listeners[event].indexOf(callback);
      if (index > -1) {
        this.listeners[event].splice(index, 1);
      }
    }
  }

  /**
   * Notify state change listeners
   * @param {string} oldState - Previous state
   * @param {string} newState - New state
   */
  notifyStateChange(oldState, newState) {
    this.listeners.stateChange.forEach(callback => {
      callback({ oldState, newState, sessionManager: this });
    });
  }

  /**
   * Notify stats update listeners
   */
  notifyStatsUpdate() {
    this.listeners.statsUpdate.forEach(callback => {
      callback(this.getSessionStats());
    });
  }
}
