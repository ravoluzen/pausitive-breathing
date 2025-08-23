import './src/styles/main.css';
import { TechniqueSelector } from './src/components/techniqueSelector.js';
import { ModeSelector } from './src/components/modeSelector.js';
import { BreathingCircle } from './src/components/breathingCircle.js';
import { BreathingEngine } from './src/modules/breathingEngine.js';
import { Visualizer } from './src/modules/visualizer.js';
import { BackgroundManager } from './src/modules/backgroundManager.js';
import { SessionManager } from './src/modules/sessionManager.js';
import { APP_STATES } from './src/utils/constants.js';

/**
 * Main Application Class
 * Coordinates all components and manages application state
 */
class BreathingApp {
  constructor() {
    this.appContainer = document.getElementById('app');
    this.currentView = null;
    
    // Core modules
    this.breathingEngine = new BreathingEngine();
    this.visualizer = null;
    this.backgroundManager = new BackgroundManager();
    this.sessionManager = new SessionManager();
    
    // UI components
    this.techniqueSelector = null;
    this.modeSelector = null;
    this.breathingCircle = null;
    
    // Session state
    this.selectedTechnique = null;
    this.selectedMode = null;
    this.customSets = null;
    
    this.initialize();
  }

  /**
   * Initialize the application
   */
  initialize() {
    this.setupEventListeners();
    this.showTechniqueSelection();
  }

  /**
   * Setup global event listeners
   */
  setupEventListeners() {
    // Session manager events
    this.sessionManager.addEventListener('stateChange', (data) => {
      this.handleStateChange(data);
    });

    // Breathing engine events
    this.breathingEngine.addEventListener('progress', (data) => {
      this.handleBreathingProgress(data);
    });

    this.breathingEngine.addEventListener('phaseChange', (data) => {
      this.handlePhaseChange(data);
    });

    this.breathingEngine.addEventListener('setComplete', (data) => {
      this.handleSetComplete(data);
    });

    this.breathingEngine.addEventListener('sessionComplete', (data) => {
      this.handleSessionComplete(data);
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      this.handleKeyboardShortcuts(e);
    });

    // Prevent context menu on long press (mobile)
    document.addEventListener('contextmenu', (e) => {
      if (this.sessionManager.currentState === APP_STATES.SESSION_ACTIVE) {
        e.preventDefault();
      }
    });
  }

  /**
   * Show technique selection screen
   */
  showTechniqueSelection() {
    // Remove breathing session class to show footer
    document.body.classList.remove('breathing-session');
    
    this.appContainer.innerHTML = `
      <div class="setup-container min-h-screen flex flex-col justify-center items-center p-8">
        <!-- PWA Install Button -->
        <button id="pwa-install-btn" 
                class="pwa-install-button" 
                onclick="window.installPWA()" 
                style="display: none;"
                title="Install Pausitive Breathing as an app">
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-2 0V5H5v10h4a1 1 0 110 2H4a1 1 0 01-1-1V4z"/>
            <path d="M13 16a1 1 0 102 0v-3.586l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 101.414 1.414L13 12.414V16z"/>
          </svg>
          <span>Install App</span>
        </button>

        <header class="text-center mb-12">
          <h1 class="text-4xl md:text-6xl font-light text-white mb-4">Pausitive Breathing</h1>
          <p class="text-white/70 text-lg max-w-2xl mx-auto">
            Find your calm with guided breathing exercises designed to reduce stress and promote relaxation.
          </p>
        </header>
        <div id="technique-selector-container" class="w-full max-w-6xl"></div>
      </div>
    `;

    // Initialize technique selector
    const container = document.getElementById('technique-selector-container');
    this.techniqueSelector = new TechniqueSelector(container);
    
    // Setup technique selection callback - auto advance to mode selection
    this.techniqueSelector.onSelect((technique) => {
      this.selectedTechnique = technique;
      this.showModeSelection();
    });

    this.currentView = 'technique-selection';
  }

  /**
   * Show mode selection screen
   */
  showModeSelection() {
    // Remove breathing session class to show footer
    document.body.classList.remove('breathing-session');
    
    this.appContainer.innerHTML = `
      <div class="setup-container min-h-screen flex flex-col justify-center items-center p-8">
        <!-- Back button positioned consistently with breathing session -->
        <button id="back-to-technique" 
                class="back-btn fixed top-4 left-4 text-white/70 hover:text-white flex items-center z-10 bg-black/20 backdrop-blur-sm rounded-lg px-3 py-2 transition-all duration-300"
                title="Back to Techniques">
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"></path>
          </svg>
          <span class="hidden sm:inline">Back to Techniques</span>
        </button>
        
        <header class="text-center mb-8">
          <h2 class="text-3xl font-light text-white mb-2">Using ${this.selectedTechnique.name}</h2>
          <p class="text-white/70">${this.selectedTechnique.description}</p>
        </header>
        <div id="mode-selector-container" class="w-full max-w-6xl"></div>
      </div>
    `;

    // Initialize mode selector
    const container = document.getElementById('mode-selector-container');
    this.modeSelector = new ModeSelector(container);
    this.modeSelector.setTechnique(this.selectedTechnique);
    
    // Setup mode selection callback - auto advance to session start
    this.modeSelector.onSelect((config) => {
      this.selectedMode = config.mode;
      this.customSets = config.sets;
      this.startBreathingSession();
    });

    // Setup navigation
    document.getElementById('back-to-technique').addEventListener('click', () => {
      this.showTechniqueSelection();
    });

    this.currentView = 'mode-selection';
  }

  /**
   * Start the breathing session
   */
  startBreathingSession() {
    // Initialize session
    this.sessionManager.initializeSession(
      this.selectedTechnique,
      this.selectedMode,
      this.customSets
    );

    // Setup breathing session UI
    this.showBreathingSession();

    // Initialize breathing engine
    this.breathingEngine.initialize(this.selectedTechnique, this.customSets);

    // Start the session
    setTimeout(() => {
      this.breathingEngine.start();
      this.sessionManager.startSession();
    }, 1000); // Small delay for UI setup
  }

  /**
   * Show breathing session screen
   */
  showBreathingSession() {
    // Add breathing session class to hide footer
    document.body.classList.add('breathing-session');
    
    this.appContainer.innerHTML = '<div id="breathing-circle-container"></div>';
    
    // Initialize breathing circle component
    const container = document.getElementById('breathing-circle-container');
    this.breathingCircle = new BreathingCircle(container);
    this.breathingCircle.initialize(this.selectedTechnique, this.customSets);
    
    // Setup visualizer with canvas
    const canvas = container.querySelector('.breathing-canvas');
    this.visualizer = new Visualizer(canvas);
    
    // Setup breathing circle callbacks
    this.breathingCircle.setEventCallbacks({
      onPauseToggle: () => this.togglePause(),
      onStop: () => this.stopSession(),
      onBack: () => this.backToModeSelection(),
      onRepeatSession: () => this.repeatSession(),
      onNewSession: () => this.newSession()
    });

    this.currentView = 'breathing-session';
  }

  /**
   * Handle breathing progress updates
   * @param {Object} data - Progress data
   */
  handleBreathingProgress(data) {
    // Update visualizer
    if (this.visualizer) {
      this.visualizer.update(data.phase, data.progress);
    }

    // Update breathing circle UI
    if (this.breathingCircle) {
      this.breathingCircle.updateVisualization(data);
    }

    // Update background
    this.backgroundManager.update(
      data.phase,
      data.progress,
      data.set,
      data.totalSets
    );

    // Update session manager
    this.sessionManager.updateProgress(data.set, data.set - 1);
  }

  /**
   * Handle breathing phase changes
   * @param {Object} data - Phase change data
   */
  handlePhaseChange(data) {
    // Add subtle haptic feedback on mobile
    if ('vibrate' in navigator && data.phase === 'exhale') {
      navigator.vibrate(30);
    }
  }

  /**
   * Handle set completion
   * @param {Object} data - Set completion data
   */
  handleSetComplete(data) {
    // Background pulse effect between sets
    this.backgroundManager.pulseEffect();
    
    // Update session progress
    this.sessionManager.updateProgress(data.completedSet + 1, data.completedSet);
  }

  /**
   * Handle session completion
   * @param {Object} data - Session completion data
   */
  handleSessionComplete(data) {
    this.sessionManager.completeSession();
    
    if (this.breathingCircle) {
      this.breathingCircle.showCompleted(data);
    }
    
    // Show completion background effect
    this.backgroundManager.pulseEffect();
  }

  /**
   * Handle application state changes
   * @param {Object} data - State change data
   */
  handleStateChange(data) {
    const { newState } = data;
    
    switch (newState) {
      case APP_STATES.SESSION_PAUSED:
        if (this.breathingCircle) {
          this.breathingCircle.showPaused();
        }
        break;
      case APP_STATES.SESSION_ACTIVE:
        if (this.breathingCircle) {
          this.breathingCircle.hidePaused();
        }
        break;
      case APP_STATES.SESSION_COMPLETE:
        // Handled in handleSessionComplete
        break;
    }
  }

  /**
   * Toggle pause/resume
   */
  togglePause() {
    const engineState = this.breathingEngine.getState();
    
    if (engineState.isPaused) {
      this.breathingEngine.resume();
      this.sessionManager.resumeSession();
    } else {
      this.breathingEngine.pause();
      this.sessionManager.pauseSession();
    }
  }

  /**
   * Stop the current session
   */
  stopSession() {
    this.breathingEngine.stop();
    this.sessionManager.resetToSetup();
    this.showTechniqueSelection();
  }

  /**
   * Go back to mode selection
   */
  backToModeSelection() {
    this.breathingEngine.stop();
    this.sessionManager.resetToSetup();
    this.showModeSelection();
  }

  /**
   * Repeat the current session
   */
  repeatSession() {
    this.startBreathingSession();
  }

  /**
   * Start a new session
   */
  newSession() {
    // Reset selections
    this.selectedTechnique = null;
    this.selectedMode = null;
    this.customSets = null;
    
    // Reset background
    this.backgroundManager.reset();
    
    // Go back to technique selection
    this.showTechniqueSelection();
  }

  /**
   * Handle keyboard shortcuts
   * @param {KeyboardEvent} e - Keyboard event
   */
  handleKeyboardShortcuts(e) {
    if (this.currentView === 'breathing-session') {
      switch (e.code) {
        case 'Space':
          e.preventDefault();
          this.togglePause();
          break;
        case 'Escape':
          e.preventDefault();
          this.stopSession();
          break;
      }
    }
  }


}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new BreathingApp();
});

// Export for potential testing
export { BreathingApp };
