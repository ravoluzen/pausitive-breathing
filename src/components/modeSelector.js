import { SESSION_MODES } from '../utils/constants.js';
import { calculateSessionDuration, formatDuration } from '../utils/helpers.js';

/**
 * Session mode selection component
 */
export class ModeSelector {
  constructor(containerElement) {
    this.container = containerElement;
    this.selectedMode = null;
    this.selectedTechnique = null;
    this.customSets = 10;
    this.onModeSelected = null;
    
    this.render();
  }

  /**
   * Set the selected technique (needed for duration calculations)
   * @param {Object} technique - Selected breathing technique
   */
  setTechnique(technique) {
    this.selectedTechnique = technique;
    this.updateDurations();
  }

  /**
   * Render the mode selector
   */
  render() {
    this.container.innerHTML = `
      <div class="mode-selector">
        <h2 class="text-2xl font-light text-white mb-8 text-center">Choose Your Session Length</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
          ${Object.values(SESSION_MODES).map(mode => this.renderModeCard(mode)).join('')}
        </div>
        
        <div class="custom-sets-container mt-8 max-w-md mx-auto" style="display: none;">
          <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h3 class="text-lg font-medium text-white mb-4 text-center">Custom Session</h3>
            <div class="flex items-center space-x-4 mb-4">
              <label class="text-white/80 text-sm">Sets:</label>
              <input type="range" 
                     class="custom-sets-slider flex-1" 
                     min="1" 
                     max="50" 
                     value="${this.customSets}"
                     id="customSetsSlider">
              <span class="custom-sets-value text-white font-medium w-8 text-center">${this.customSets}</span>
            </div>
            <div class="mb-4 text-center">
              <span class="custom-duration text-white/70 text-sm">
                ${this.selectedTechnique ? formatDuration(calculateSessionDuration(this.selectedTechnique, this.customSets)) : '--:--'}
              </span>
            </div>
            <div class="text-center">
              <button id="start-custom-session" 
                      class="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105">
                Start Custom Session
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    this.attachEventListeners();
  }

  /**
   * Render a single mode card
   * @param {Object} mode - Mode configuration
   * @returns {string} HTML string
   */
  renderModeCard(mode) {
    const isCustom = mode.id === 'custom';
    const duration = this.selectedTechnique && !isCustom 
      ? formatDuration(calculateSessionDuration(this.selectedTechnique, mode.sets))
      : mode.description;

    return `
      <div class="mode-card group cursor-pointer" data-mode-id="${mode.id}">
        <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 
                    transition-all duration-300 hover:bg-white/20 hover:scale-105 hover:shadow-xl
                    group-hover:border-white/40 h-full flex flex-col">
          
          <div class="text-center mb-4">
            <div class="text-3xl mb-2">${mode.icon}</div>
            <h3 class="text-lg font-medium text-white">${mode.name}</h3>
          </div>
          
          <div class="flex-1 flex flex-col justify-center">
            <div class="text-center mb-3">
              <span class="text-2xl font-light text-white">${isCustom ? 'Custom' : mode.sets}</span>
              ${!isCustom ? '<span class="text-white/70 text-sm ml-1">sets</span>' : ''}
            </div>
            
            <div class="text-center">
              <span class="duration-display text-white/70 text-sm">${duration}</span>
            </div>
          </div>
          
          <div class="mt-4 pt-4 border-t border-white/20">
            <div class="breathing-preview-mini flex justify-center space-x-1">
              ${Array.from({length: Math.min(mode.sets || 3, 5)}, (_, i) => 
                `<div class="w-2 h-2 bg-white/40 rounded-full animate-pulse" style="animation-delay: ${i * 200}ms"></div>`
              ).join('')}
             
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    const cards = this.container.querySelectorAll('.mode-card');
    const customContainer = this.container.querySelector('.custom-sets-container');
    const slider = this.container.querySelector('#customSetsSlider');
    const valueDisplay = this.container.querySelector('.custom-sets-value');
    const durationDisplay = this.container.querySelector('.custom-duration');
    
    // Mode card selection
    cards.forEach(card => {
      card.addEventListener('click', () => {
        const modeId = card.dataset.modeId;
        this.selectMode(modeId);
      });
      
      // Keyboard support
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const modeId = card.dataset.modeId;
          this.selectMode(modeId);
        }
      });
      
      card.setAttribute('tabindex', '0');
    });
    
    // Custom sets slider
    if (slider) {
      slider.addEventListener('input', (e) => {
        this.customSets = parseInt(e.target.value);
        valueDisplay.textContent = this.customSets;
        
        if (this.selectedTechnique) {
          const duration = formatDuration(calculateSessionDuration(this.selectedTechnique, this.customSets));
          durationDisplay.textContent = duration;
        }
      });
    }
    
    // Custom session start button
    const customStartBtn = this.container.querySelector('#start-custom-session');
    if (customStartBtn) {
      customStartBtn.addEventListener('click', () => {
        if (this.selectedMode && this.selectedMode.id === 'custom') {
          this.triggerModeSelected();
        }
      });
    }
  }

  /**
   * Select a session mode
   * @param {string} modeId - ID of the selected mode
   */
  selectMode(modeId) {
    const mode = SESSION_MODES[modeId];
    if (!mode) return;
    
    // Update visual selection
    this.updateSelection(modeId);
    
    // Show/hide custom sets container
    const customContainer = this.container.querySelector('.custom-sets-container');
    if (modeId === 'custom') {
      customContainer.style.display = 'block';
      // Don't auto-advance for custom mode, wait for user to set value
      this.selectedMode = mode;
      // Haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
      return;
    } else {
      customContainer.style.display = 'none';
    }
    
    // Store selection
    this.selectedMode = mode;
    
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    
    // Auto-advance to session start after a brief delay for visual feedback
    setTimeout(() => {
      this.triggerModeSelected();
    }, 300);
  }

  /**
   * Trigger mode selected callback
   */
  triggerModeSelected() {
    if (this.onModeSelected && this.selectedMode) {
      const sessionConfig = {
        mode: this.selectedMode,
        sets: this.selectedMode.id === 'custom' ? this.customSets : this.selectedMode.sets
      };
      this.onModeSelected(sessionConfig);
    }
  }

  /**
   * Update visual selection state
   * @param {string} selectedId - ID of the selected mode
   */
  updateSelection(selectedId) {
    const cards = this.container.querySelectorAll('.mode-card');
    
    cards.forEach(card => {
      const isSelected = card.dataset.modeId === selectedId;
      const cardInner = card.querySelector('div');
      
      if (isSelected) {
        card.classList.add('selected');
        
        // Add selected indicator
        if (!card.querySelector('.selected-indicator')) {
          const indicator = document.createElement('div');
          indicator.className = 'selected-indicator absolute top-3 right-3 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center';
          indicator.innerHTML = '<svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>';
          cardInner.style.position = 'relative';
          cardInner.appendChild(indicator);
        }
      } else {
        card.classList.remove('selected');
        
        const indicator = card.querySelector('.selected-indicator');
        if (indicator) {
          indicator.remove();
        }
      }
    });
  }

  /**
   * Update duration displays when technique changes
   */
  updateDurations() {
    if (!this.selectedTechnique) return;
    
    const cards = this.container.querySelectorAll('.mode-card');
    cards.forEach(card => {
      const modeId = card.dataset.modeId;
      const mode = SESSION_MODES[modeId];
      const durationElement = card.querySelector('.duration-display');
      
      if (mode && durationElement && mode.id !== 'custom') {
        const duration = formatDuration(calculateSessionDuration(this.selectedTechnique, mode.sets));
        durationElement.textContent = duration;
      }
    });
    
    // Update custom duration
    const customDuration = this.container.querySelector('.custom-duration');
    if (customDuration) {
      const duration = formatDuration(calculateSessionDuration(this.selectedTechnique, this.customSets));
      customDuration.textContent = duration;
    }
  }

  /**
   * Get the currently selected mode configuration
   * @returns {Object|null} Selected mode configuration
   */
  getSelection() {
    if (!this.selectedMode) return null;
    
    return {
      mode: this.selectedMode,
      sets: this.selectedMode.id === 'custom' ? this.customSets : this.selectedMode.sets
    };
  }

  /**
   * Set mode selection callback
   * @param {Function} callback - Callback function
   */
  onSelect(callback) {
    this.onModeSelected = callback;
  }

  /**
   * Reset selection
   */
  reset() {
    this.selectedMode = null;
    this.customSets = 10;
    this.updateSelection(null);
    
    const customContainer = this.container.querySelector('.custom-sets-container');
    if (customContainer) {
      customContainer.style.display = 'none';
    }
  }
}
