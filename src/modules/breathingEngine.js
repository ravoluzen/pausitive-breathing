import { BREATHING_PHASES } from '../utils/constants.js';

/**
 * Core breathing engine that manages timing and phases
 */
export class BreathingEngine {
  constructor() {
    this.isActive = false;
    this.isPaused = false;
    this.currentPhase = BREATHING_PHASES.INHALE;
    this.currentSet = 1;
    this.totalSets = 0;
    this.technique = null;
    this.phaseStartTime = 0;
    this.phaseProgress = 0;
    this.animationFrameId = null;
    this.listeners = {
      phaseChange: [],
      setComplete: [],
      sessionComplete: [],
      progress: []
    };
  }

  /**
   * Initialize a breathing session
   * @param {Object} technique - Breathing technique configuration
   * @param {number} totalSets - Total number of sets to perform
   */
  initialize(technique, totalSets) {
    this.technique = technique;
    this.totalSets = totalSets;
    this.currentSet = 1;
    this.currentPhase = BREATHING_PHASES.INHALE;
    this.phaseProgress = 0;
    this.isActive = false;
    this.isPaused = false;
  }

  /**
   * Start the breathing session
   */
  start() {
    if (this.isPaused) {
      this.resume();
      return;
    }

    this.isActive = true;
    this.isPaused = false;
    this.phaseStartTime = performance.now();
    this.animate();
    this.notifyListeners('phaseChange', {
      phase: this.currentPhase,
      set: this.currentSet,
      totalSets: this.totalSets
    });
  }

  /**
   * Pause the breathing session
   */
  pause() {
    this.isPaused = true;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Resume the breathing session
   */
  resume() {
    this.isPaused = false;
    this.phaseStartTime = performance.now() - (this.phaseProgress * this.getCurrentPhaseDuration() * 1000);
    this.animate();
  }

  /**
   * Stop the breathing session
   */
  stop() {
    this.isActive = false;
    this.isPaused = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Main animation loop
   */
  animate() {
    if (!this.isActive || this.isPaused) return;

    const now = performance.now();
    const phaseDuration = this.getCurrentPhaseDuration() * 1000; // Convert to milliseconds
    const elapsed = now - this.phaseStartTime;
    
    this.phaseProgress = Math.min(elapsed / phaseDuration, 1);

    // Notify progress listeners
    this.notifyListeners('progress', {
      phase: this.currentPhase,
      progress: this.phaseProgress,
      set: this.currentSet,
      totalSets: this.totalSets
    });

    // Check if phase is complete
    if (this.phaseProgress >= 1) {
      this.advancePhase();
    }

    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }

  /**
   * Advance to the next breathing phase or set
   */
  advancePhase() {
    if (this.currentPhase === BREATHING_PHASES.INHALE) {
      // Move to exhale phase
      this.currentPhase = BREATHING_PHASES.EXHALE;
      this.phaseStartTime = performance.now();
      this.phaseProgress = 0;
      
      this.notifyListeners('phaseChange', {
        phase: this.currentPhase,
        set: this.currentSet,
        totalSets: this.totalSets
      });
    } else {
      // Complete current set and move to next
      this.notifyListeners('setComplete', {
        completedSet: this.currentSet,
        totalSets: this.totalSets
      });

      if (this.currentSet >= this.totalSets) {
        // Session complete
        this.stop();
        this.notifyListeners('sessionComplete', {
          totalSets: this.totalSets,
          technique: this.technique
        });
        return;
      }

      // Move to next set
      this.currentSet++;
      this.currentPhase = BREATHING_PHASES.INHALE;
      this.phaseStartTime = performance.now();
      this.phaseProgress = 0;

      this.notifyListeners('phaseChange', {
        phase: this.currentPhase,
        set: this.currentSet,
        totalSets: this.totalSets
      });
    }
  }

  /**
   * Get the duration of the current phase
   * @returns {number} Duration in seconds
   */
  getCurrentPhaseDuration() {
    return this.currentPhase === BREATHING_PHASES.INHALE 
      ? this.technique.inhaleCount 
      : this.technique.exhaleCount;
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
   * Notify all listeners of an event
   * @param {string} event - Event type
   * @param {Object} data - Event data
   */
  notifyListeners(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }

  /**
   * Get current session state
   * @returns {Object} Current state
   */
  getState() {
    return {
      isActive: this.isActive,
      isPaused: this.isPaused,
      currentPhase: this.currentPhase,
      currentSet: this.currentSet,
      totalSets: this.totalSets,
      phaseProgress: this.phaseProgress,
      technique: this.technique
    };
  }
}
