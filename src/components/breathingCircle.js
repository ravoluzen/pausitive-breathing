import { BREATHING_PHASES } from '../utils/constants.js';

/**
 * Main breathing visualization component
 */
export class BreathingCircle {
  constructor(containerElement) {
    this.container = containerElement;
    this.canvas = null;
    this.visualizer = null;
    this.currentPhase = BREATHING_PHASES.INHALE;
    this.currentSet = 1;
    this.totalSets = 1;
    this.technique = null;
    
    this.setupCanvas();
  }

  /**
   * Setup the canvas element
   */
  setupCanvas() {
    // Clear container
    this.container.innerHTML = '';
    
    // Create main container
    const mainContainer = this.createElement('div', {
      className: 'breathing-circle-container relative min-h-screen p-4'
    });
    
    // Create back button (top left)
    this.backButton = this.createBackButton();
    mainContainer.appendChild(this.backButton);
    
    // Create main visualization area
    this.visualizationArea = this.createVisualizationArea();
    mainContainer.appendChild(this.visualizationArea);
    
    // Create session controls (bottom)
    this.sessionControls = this.createSessionControls();
    mainContainer.appendChild(this.sessionControls);
    
    this.container.appendChild(mainContainer);
    this.attachEventListeners();
  }

  /**
   * Create back button element
   */
  createBackButton() {
    const backButton = this.createElement('button', {
      className: 'back-btn fixed top-4 left-4 text-white/70 hover:text-white flex items-center z-10 bg-black/20 backdrop-blur-sm rounded-lg px-3 py-2 transition-all duration-300',
      title: 'Back to Mode Selection'
    });
    
    backButton.innerHTML = `
      <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"></path>
      </svg>
      <span class="hidden sm:inline">Back</span>
    `;
    
    return backButton;
  }

  /**
   * Create main visualization area
   */
  createVisualizationArea() {
    const visualization = this.createElement('div', {
      className: 'breathing-visualization flex flex-col items-center justify-center pt-8 pb-32'
    });
    
    // Phase indicator
    const phaseIndicator = this.createElement('div', {
      className: 'phase-indicator mb-6 md:mb-8'
    });
    
    this.breathingInstruction = this.createElement('h1', {
      className: 'breathing-instruction text-3xl md:text-5xl lg:text-6xl font-light text-white text-center mb-4',
      textContent: 'Breathe In'
    });
    
    const phaseTimer = this.createElement('div', {
      className: 'phase-timer text-white/60 text-lg text-center'
    });
    
    this.countdown = this.createElement('span', {
      className: 'countdown',
      textContent: '4'
    });
    
    phaseTimer.appendChild(this.countdown);
    phaseIndicator.appendChild(this.breathingInstruction);
    phaseIndicator.appendChild(phaseTimer);
    
    // Canvas container
    const canvasContainer = this.createElement('div', {
      className: 'canvas-container relative flex items-center justify-center mb-6 md:mb-8'
    });
    
    this.canvas = this.createElement('canvas', {
      className: 'breathing-canvas block mx-auto',
      width: 320,
      height: 320
    });
    
    // Guide rings - made more responsive
    const guideRings = this.createElement('div', {
      className: 'guide-rings absolute inset-0 flex items-center justify-center pointer-events-none'
    });
    
    const outerRing = this.createElement('div', {
      className: 'guide-ring w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 rounded-full border border-white/10'
    });
    
    const innerRing = this.createElement('div', {
      className: 'guide-ring-inner absolute w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-full border border-white/5'
    });
    
    guideRings.appendChild(outerRing);
    guideRings.appendChild(innerRing);
    canvasContainer.appendChild(this.canvas);
    canvasContainer.appendChild(guideRings);
    
    
    
    visualization.appendChild(phaseIndicator);
    visualization.appendChild(canvasContainer);
    
    return visualization;
  }

  /**
   * Create session controls with progress info and technique details
   */
  createSessionControls() {
    const controlsContainer = this.createElement('div', {
      className: 'session-controls rounded-3xl bg-black/20 backdrop-blur-sm p-4 fixed bottom-6 left-1/2 transform -translate-x-1/2 z-10'
    });
    
    // Technique info (moved from visualization area)
    const techniqueInfo = this.createElement('div', {
      className: 'technique-info text-center mb-3'
    });
 
    this.techniqueName = this.createElement('div', {
      className: 'technique-name text-white text-sm font-medium mb-1',
      textContent: '4-8 Breathing'
    });
    
    const techniqueDetails = this.createElement('div', {
      className: 'technique-details text-white/50 text-xs'
    });
    
    this.inhaleCount = this.createElement('span', {
      className: 'inhale-count',
      textContent: '4s'
    });
    
    this.exhaleCount = this.createElement('span', {
      className: 'exhale-count',
      textContent: '8s'
    });
    
    techniqueDetails.appendChild(this.inhaleCount);
    techniqueDetails.appendChild(document.createTextNode(' inhale • '));
    techniqueDetails.appendChild(this.exhaleCount);
    techniqueDetails.appendChild(document.createTextNode(' exhale'));
    
    techniqueInfo.appendChild(this.techniqueName);
    techniqueInfo.appendChild(techniqueDetails);
    
    // Session progress info
    const progressContainer = this.createElement('div', {
      className: 'progress-container rounded-xl p-3 mb-3 text-center'
    });
    
    // Progress bar
    const progressBar = this.createElement('div', {
      className: 'progress-bar w-48 h-2 bg-white/20 rounded-full overflow-hidden mb-2 mx-auto'
    });
    
    this.progressFill = this.createElement('div', {
      className: 'progress-fill h-full bg-gradient-to-r from-blue-400 to-green-400 rounded-full transition-all duration-500',
      style: 'width: 0%'
    });
    
    // Set counter
    this.setCounter = this.createElement('div', {
      className: 'set-counter text-white/80 text-sm',
      textContent: 'Set 1 of 1'
    });
    
    progressBar.appendChild(this.progressFill);
    progressContainer.appendChild(progressBar);
    progressContainer.appendChild(this.setCounter);
    
    // Control buttons
    const controls = this.createElement('div', {
      className: 'flex items-center justify-center space-x-4'
    });
    
    // Pause button
    this.pauseBtn = this.createElement('button', {
      className: 'control-btn pause-btn bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300',
      title: 'Pause'
    });
    this.pauseBtn.innerHTML = this.getPauseIconSVG();
    
    // Stop button
    this.stopBtn = this.createElement('button', {
      className: 'control-btn stop-btn bg-red-500/30 hover:bg-red-500/50 text-white p-3 rounded-full transition-all duration-300',
      title: 'Stop'
    });
    this.stopBtn.innerHTML = this.getStopIconSVG();
    
    controls.appendChild(this.pauseBtn);
    controls.appendChild(this.stopBtn);
    
    controlsContainer.appendChild(techniqueInfo);
    controlsContainer.appendChild(progressContainer);
    controlsContainer.appendChild(controls);
    
    return controlsContainer;
  }

  /**
   * Helper method to create DOM elements
   */
  createElement(tag, properties = {}) {
    const element = document.createElement(tag);
    
    Object.entries(properties).forEach(([key, value]) => {
      if (key === 'textContent') {
        element.textContent = value;
      } else if (key === 'innerHTML') {
        element.innerHTML = value;
      } else if (key === 'style') {
        element.setAttribute('style', value);
      } else {
        element[key] = value;
      }
    });
    
    return element;
  }

  /**
   * Get pause icon SVG
   */
  getPauseIconSVG() {
    return `<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path>
    </svg>`;
  }

  /**
   * Get play icon SVG
   */
  getPlayIconSVG() {
    return `<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8.065v3.87a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"></path>
    </svg>`;
  }

  /**
   * Get stop icon SVG
   */
  getStopIconSVG() {
    return `<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clip-rule="evenodd"></path>
    </svg>`;
  }

  /**
   * Initialize the session with technique and settings
   * @param {Object} technique - Breathing technique
   * @param {number} totalSets - Total number of sets
   */
  initialize(technique, totalSets) {
    this.technique = technique;
    this.totalSets = totalSets;
    this.currentSet = 1;
    this.currentPhase = BREATHING_PHASES.INHALE;
    
    this.updateTechniqueInfo();
    this.updateSessionProgress();
    this.updatePhaseDisplay();
  }

  /**
   * Update the breathing visualization
   * @param {Object} data - Progress data from breathing engine
   */
  updateVisualization(data) {
    const { phase, progress, set, totalSets } = data;
    
    this.currentPhase = phase;
    this.currentSet = set;
    this.totalSets = totalSets;
    
    // Update canvas visualization (will be integrated with visualizer module)
    this.drawBreathingCircle(progress);
    
    // Update UI elements
    this.updatePhaseDisplay();
    this.updateSessionProgress();
    this.updateCountdown(progress);
  }

  /**
   * Draw the breathing circle on canvas
   * @param {number} progress - Current phase progress (0-1)
   */
  drawBreathingCircle(progress) {
    const ctx = this.canvas.getContext('2d');
    
    // Handle high DPI displays
    const devicePixelRatio = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    
    // Set canvas size for crisp rendering
    this.canvas.width = rect.width * devicePixelRatio;
    this.canvas.height = rect.height * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);
    
    // Calculate responsive center and radius
    const scaledCenterX = rect.width / 2;
    const scaledCenterY = rect.height / 2;
    
    // Dynamic radius based on canvas size, with margin for safety
    const maxRadius = Math.min(rect.width, rect.height) / 2 - 40; // 40px margin
    const radius = Math.min(120, maxRadius); // Cap at 120px but scale down if needed
    
    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height);
    
    // Background circle
    ctx.beginPath();
    ctx.arc(scaledCenterX, scaledCenterY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Progress arc
    const startAngle = -Math.PI / 2;
    const endAngle = startAngle + (2 * Math.PI * progress);
    
    ctx.beginPath();
    ctx.arc(scaledCenterX, scaledCenterY, radius, startAngle, endAngle);
    
    // Create gradient for more dynamic colors
    const gradient = ctx.createLinearGradient(
      scaledCenterX - radius, scaledCenterY - radius,
      scaledCenterX + radius, scaledCenterY + radius
    );
    
    if (this.currentPhase === BREATHING_PHASES.INHALE) {
      // Inhale: Blue to lighter blue gradient
      gradient.addColorStop(0, '#3B82F6');
      gradient.addColorStop(0.5, '#60A5FA');
      gradient.addColorStop(1, '#1E40AF');
      ctx.shadowColor = '#3B82F6';
    } else {
      // Exhale: Green to lighter green gradient
      gradient.addColorStop(0, '#10B981');
      gradient.addColorStop(0.5, '#34D399');
      gradient.addColorStop(1, '#047857');
      ctx.shadowColor = '#10B981';
    }
    
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.stroke();
    
    // Add subtle glow effect
    ctx.shadowBlur = 10;
    ctx.stroke();
    ctx.shadowBlur = 0;
    
    // Center dot with breathing animation
    const scale = this.currentPhase === BREATHING_PHASES.INHALE 
      ? 1 + (progress * 0.4) 
      : 1.4 - (progress * 0.4);
    
    const dotRadius = 12 * scale;
    
    ctx.beginPath();
    ctx.arc(scaledCenterX, scaledCenterY, dotRadius, 0, 2 * Math.PI);
    ctx.fillStyle = this.currentPhase === BREATHING_PHASES.INHALE 
      ? 'rgba(59, 130, 246, 0.8)' 
      : 'rgba(16, 185, 129, 0.8)';
    ctx.fill();
    
    // Add subtle outer ring for breathing effect
    ctx.beginPath();
    ctx.arc(scaledCenterX, scaledCenterY, dotRadius + 6, 0, 2 * Math.PI);
    ctx.strokeStyle = this.currentPhase === BREATHING_PHASES.INHALE 
      ? 'rgba(59, 130, 246, 0.3)' 
      : 'rgba(16, 185, 129, 0.3)';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  /**
   * Update phase display text
   */
  updatePhaseDisplay() {
    const phaseText = this.currentPhase === BREATHING_PHASES.INHALE ? 'Breathe In' : 'Breathe Out';
    
    if (this.breathingInstruction) {
      this.breathingInstruction.textContent = phaseText;
      
      // Add phase-specific styling
      this.breathingInstruction.className = `breathing-instruction text-3xl md:text-5xl lg:text-6xl font-light text-white text-center mb-4 ${
        this.currentPhase === BREATHING_PHASES.INHALE ? 'text-blue-100' : 'text-green-100'
      }`;
    }
  }

  /**
   * Update session progress indicators
   */
  updateSessionProgress() {
    if (this.setCounter) {
      this.setCounter.textContent = `Set ${this.currentSet} of ${this.totalSets}`;
    }
    
    if (this.progressFill) {
      const progressPercentage = ((this.currentSet - 1) / this.totalSets) * 100;
      this.progressFill.style.width = `${progressPercentage}%`;
    }
  }

  /**
   * Update countdown timer
   * @param {number} progress - Current phase progress (0-1)
   */
  updateCountdown(progress) {
    if (!this.countdown || !this.technique) return;
    
    const totalDuration = this.currentPhase === BREATHING_PHASES.INHALE 
      ? this.technique.inhaleCount 
      : this.technique.exhaleCount;
    
    const remaining = Math.ceil(totalDuration * (1 - progress));
    this.countdown.textContent = Math.max(0, remaining);
  }

  /**
   * Update technique information display
   */
  updateTechniqueInfo() {
    if (!this.technique) return;
    
    if (this.techniqueName) this.techniqueName.textContent = this.technique.name;
    if (this.inhaleCount) this.inhaleCount.textContent = `${this.technique.inhaleCount}s`;
    if (this.exhaleCount) this.exhaleCount.textContent = `${this.technique.exhaleCount}s`;
  }

  /**
   * Show session completed state
   * @param {Object} sessionData - Completed session data
   */
  showCompleted(sessionData) {
    // Clear container and create completion screen
    this.container.innerHTML = '';
    
    const completionContainer = this.createElement('div', {
      className: 'session-complete flex flex-col items-center justify-center min-h-screen p-8 text-center'
    });
    
    // Completion animation
    const animationContainer = this.createElement('div', {
      className: 'completion-animation mb-8'
    });
    
    const completionIcon = this.createElement('div', {
      className: 'w-24 h-24 bg-green-400 rounded-full flex items-center justify-center mx-auto mb-4'
    });
    completionIcon.innerHTML = `<svg class="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
    </svg>`;
    
    animationContainer.appendChild(completionIcon);
    
    // Completion text
    const completionTitle = this.createElement('h2', {
      className: 'text-3xl font-light text-white mb-4',
      textContent: 'Session Complete!'
    });
    
    const completionMessage = this.createElement('p', {
      className: 'text-white/70 text-lg mb-8',
      textContent: `You completed ${sessionData.totalSets} sets of ${sessionData.technique.name}`
    });
    
    // Action buttons
    const buttonContainer = this.createElement('div', {
      className: 'action-buttons flex flex-col sm:flex-row gap-4'
    });
    
    this.repeatBtn = this.createElement('button', {
      className: 'repeat-btn bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg transition-colors',
      textContent: 'Repeat Session'
    });
    
    this.newSessionBtn = this.createElement('button', {
      className: 'new-session-btn bg-white/20 hover:bg-white/30 text-white px-8 py-3 rounded-lg transition-colors',
      textContent: 'New Session'
    });
    
    buttonContainer.appendChild(this.repeatBtn);
    buttonContainer.appendChild(this.newSessionBtn);
    
    completionContainer.appendChild(animationContainer);
    completionContainer.appendChild(completionTitle);
    completionContainer.appendChild(completionMessage);
    completionContainer.appendChild(buttonContainer);
    
    this.container.appendChild(completionContainer);
    this.attachCompletionEventListeners();
  }

  /**
   * Show paused state
   */
  showPaused() {
    if (this.pauseBtn) {
      this.pauseBtn.innerHTML = this.getPlayIconSVG();
      this.pauseBtn.title = 'Resume';
    }
    
    // Add paused overlay with click to resume
    this.pausedOverlay = this.createElement('div', {
      className: 'paused-overlay absolute inset-0 bg-black/50 flex items-center justify-center z-20 cursor-pointer'
    });
    
    const overlayContent = this.createElement('div', {
      className: 'text-center pointer-events-none'
    });
    
    const pausedTitle = this.createElement('div', {
      className: 'text-white text-2xl mb-4',
      textContent: 'Session Paused'
    });
    
    const pausedMessage = this.createElement('div', {
      className: 'text-white/70 mb-4',
      textContent: 'Click anywhere to resume'
    });
    
    // Add visual resume indicator
    const resumeIcon = this.createElement('div', {
      className: 'w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto animate-pulse'
    });
    resumeIcon.innerHTML = this.getPlayIconSVG();
    
    overlayContent.appendChild(pausedTitle);
    overlayContent.appendChild(pausedMessage);
    overlayContent.appendChild(resumeIcon);
    this.pausedOverlay.appendChild(overlayContent);
    
    // Add click handler to resume
    this.pausedOverlay.addEventListener('click', () => {
      this.onPauseToggle && this.onPauseToggle();
    });
    
    // Add keyboard handler for spacebar
    this.pausedOverlayKeyHandler = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        this.onPauseToggle && this.onPauseToggle();
      }
    };
    document.addEventListener('keydown', this.pausedOverlayKeyHandler);
    
    this.container.appendChild(this.pausedOverlay);
  }

  /**
   * Hide paused state
   */
  hidePaused() {
    if (this.pauseBtn) {
      this.pauseBtn.innerHTML = this.getPauseIconSVG();
      this.pauseBtn.title = 'Pause';
    }
    
    if (this.pausedOverlay) {
      this.pausedOverlay.remove();
      this.pausedOverlay = null;
    }
    
    // Remove keyboard event listener
    if (this.pausedOverlayKeyHandler) {
      document.removeEventListener('keydown', this.pausedOverlayKeyHandler);
      this.pausedOverlayKeyHandler = null;
    }
  }

  /**
   * Attach event listeners for main controls
   */
  attachEventListeners() {
    if (this.pauseBtn) {
      this.pauseBtn.addEventListener('click', () => {
        this.onPauseToggle && this.onPauseToggle();
      });
    }
    
    if (this.stopBtn) {
      this.stopBtn.addEventListener('click', () => {
        this.onStop && this.onStop();
      });
    }
    
    if (this.backButton) {
      this.backButton.addEventListener('click', () => {
        this.onBack && this.onBack();
      });
    }
  }

  /**
   * Attach event listeners for completion screen
   */
  attachCompletionEventListeners() {
    if (this.repeatBtn) {
      this.repeatBtn.addEventListener('click', () => {
        this.onRepeatSession && this.onRepeatSession();
      });
    }
    
    if (this.newSessionBtn) {
      this.newSessionBtn.addEventListener('click', () => {
        this.onNewSession && this.onNewSession();
      });
    }
  }

  /**
   * Set event callbacks
   */
  setEventCallbacks(callbacks) {
    this.onPauseToggle = callbacks.onPauseToggle;
    this.onStop = callbacks.onStop;
    this.onBack = callbacks.onBack;
    this.onRepeatSession = callbacks.onRepeatSession;
    this.onNewSession = callbacks.onNewSession;
  }
}
