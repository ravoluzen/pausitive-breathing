import { BREATHING_TECHNIQUES } from '../utils/constants.js';

/**
 * Breathing technique selection component
 */
export class TechniqueSelector {
  constructor(containerElement) {
    this.container = containerElement;
    this.selectedTechnique = null;
    this.onTechniqueSelected = null;
    
    this.render();
  }

  /**
   * Render the technique selector
   */
  render() {
    this.container.innerHTML = '';
    
    const selectorContainer = this.createElement('div', {
      className: 'technique-selector'
    });
    
    const title = this.createElement('h2', {
      className: 'text-2xl font-light text-white mb-8 text-center',
      textContent: 'Choose Your Breathing Technique'
    });
    
    const gridContainer = this.createElement('div', {
      className: 'grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto'
    });
    
    // Create technique cards
    Object.values(BREATHING_TECHNIQUES).forEach(technique => {
      const card = this.createTechniqueCard(technique);
      gridContainer.appendChild(card);
    });
    
    selectorContainer.appendChild(title);
    selectorContainer.appendChild(gridContainer);
    this.container.appendChild(selectorContainer);
    
    this.attachEventListeners();
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
      } else if (key === 'dataset') {
        Object.entries(value).forEach(([dataKey, dataValue]) => {
          element.dataset[dataKey] = dataValue;
        });
      } else {
        element[key] = value;
      }
    });
    
    return element;
  }

  /**
   * Create a single technique card
   * @param {Object} technique - Technique configuration
   * @returns {HTMLElement} Card element
   */
  createTechniqueCard(technique) {
    const card = this.createElement('div', {
      className: 'technique-card group cursor-pointer',
      dataset: { techniqueId: technique.id },
      tabIndex: 0
    });
    
    const cardInner = this.createElement('div', {
      className: 'bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 transition-all duration-300 hover:bg-white/20 hover:scale-105 hover:shadow-xl group-hover:border-white/40'
    });
    
    // Header with name and level
    const header = this.createElement('div', {
      className: 'flex items-center justify-between mb-4'
    });
    
    const name = this.createElement('h3', {
      className: 'text-xl font-medium text-white',
      textContent: technique.name
    });
    
    const level = this.createElement('span', {
      className: 'text-sm px-3 py-1 bg-white/20 rounded-full text-white/80',
      textContent: technique.level
    });
    
    header.appendChild(name);
    header.appendChild(level);
    
    // Timing indicators
    const timingContainer = this.createElement('div', {
      className: 'flex items-center space-x-4 mb-4'
    });
    
    // Inhale indicator
    const inhaleContainer = this.createElement('div', {
      className: 'flex items-center space-x-2'
    });
    
    const inhaleDot = this.createElement('div', {
      className: 'w-3 h-3 bg-blue-400 rounded-full animate-pulse'
    });
    
    const inhaleText = this.createElement('span', {
      className: 'text-white/80 text-sm',
      textContent: `Inhale ${technique.inhaleCount}s`
    });
    
    inhaleContainer.appendChild(inhaleDot);
    inhaleContainer.appendChild(inhaleText);
    
    // Exhale indicator
    const exhaleContainer = this.createElement('div', {
      className: 'flex items-center space-x-2'
    });
    
    const exhaleDot = this.createElement('div', {
      className: 'w-3 h-3 bg-green-400 rounded-full animate-pulse'
    });
    
    const exhaleText = this.createElement('span', {
      className: 'text-white/80 text-sm',
      textContent: `Exhale ${technique.exhaleCount}s`
    });
    
    exhaleContainer.appendChild(exhaleDot);
    exhaleContainer.appendChild(exhaleText);
    
    timingContainer.appendChild(inhaleContainer);
    timingContainer.appendChild(exhaleContainer);
    
    // Description
    const description = this.createElement('p', {
      className: 'text-white/70 text-sm mb-4',
      textContent: technique.description
    });
    
    // Breathing preview animation
    const previewContainer = this.createElement('div', {
      className: 'flex items-center justify-center'
    });
    
    const breathingPreview = this.createElement('div', {
      className: 'breathing-preview relative w-16 h-16'
    });
    
    const outerRing = this.createElement('div', {
      className: 'absolute inset-0 rounded-full border-2 border-white/30'
    });
    
    const animatedRing = this.createElement('div', {
      className: 'absolute inset-0 rounded-full border-2 border-white/60 animate-ping'
    });
    
    const innerDot = this.createElement('div', {
      className: 'absolute inset-2 rounded-full bg-white/20'
    });
    
    breathingPreview.appendChild(outerRing);
    breathingPreview.appendChild(animatedRing);
    breathingPreview.appendChild(innerDot);
    previewContainer.appendChild(breathingPreview);
    
    // Assemble card
    cardInner.appendChild(header);
    cardInner.appendChild(timingContainer);
    cardInner.appendChild(description);
    cardInner.appendChild(previewContainer);
    card.appendChild(cardInner);
    
    return card;
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    const cards = this.container.querySelectorAll('.technique-card');
    
    cards.forEach(card => {
      card.addEventListener('click', () => {
        const techniqueId = card.dataset.techniqueId;
        this.selectTechnique(techniqueId);
      });
      
      // Add keyboard support
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const techniqueId = card.dataset.techniqueId;
          this.selectTechnique(techniqueId);
        }
      });
      
      // Make focusable
      card.setAttribute('tabindex', '0');
    });
  }

  /**
   * Select a breathing technique
   * @param {string} techniqueId - ID of the selected technique
   */
  selectTechnique(techniqueId) {
    const technique = BREATHING_TECHNIQUES[techniqueId];
    if (!technique) return;
    
    // Update visual selection
    this.updateSelection(techniqueId);
    
    // Store selection
    this.selectedTechnique = technique;
    
    // Add haptic feedback for mobile
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    
    // Auto-advance to mode selection after a brief delay for visual feedback
    setTimeout(() => {
      if (this.onTechniqueSelected) {
        this.onTechniqueSelected(technique);
      }
    }, 300);
  }

  /**
   * Update visual selection state
   * @param {string} selectedId - ID of the selected technique
   */
  updateSelection(selectedId) {
    const cards = this.container.querySelectorAll('.technique-card');
    
    cards.forEach(card => {
      const isSelected = card.dataset.techniqueId === selectedId;
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
        
        // Remove selected indicator
        const indicator = card.querySelector('.selected-indicator');
        if (indicator) {
          indicator.remove();
        }
      }
    });
  }

  /**
   * Get the currently selected technique
   * @returns {Object|null} Selected technique
   */
  getSelectedTechnique() {
    return this.selectedTechnique;
  }

  /**
   * Set technique selection callback
   * @param {Function} callback - Callback function
   */
  onSelect(callback) {
    this.onTechniqueSelected = callback;
  }

  /**
   * Reset selection
   */
  reset() {
    this.selectedTechnique = null;
    this.updateSelection(null);
  }

  /**
   * Show loading state
   */
  showLoading() {
    this.container.innerHTML = `
      <div class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    `;
  }

  /**
   * Show error state
   * @param {string} message - Error message
   */
  showError(message) {
    this.container.innerHTML = `
      <div class="text-center py-12">
        <div class="text-red-400 mb-4">
          <svg class="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
          </svg>
        </div>
        <p class="text-white/80">${message}</p>
        <button class="mt-4 px-6 py-2 bg-white/20 rounded-lg text-white hover:bg-white/30 transition-colors"
                onclick="location.reload()">
          Try Again
        </button>
      </div>
    `;
  }
}
