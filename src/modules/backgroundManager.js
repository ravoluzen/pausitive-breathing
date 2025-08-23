import { COLOR_PALETTES, BREATHING_PHASES } from '../utils/constants.js';
import { interpolateColor } from '../utils/helpers.js';

/**
 * Manages dynamic background gradients synchronized with breathing
 */
export class BackgroundManager {
  constructor(element) {
    this.element = element || document.body;
    this.currentPaletteIndex = 0;
    this.currentPhase = BREATHING_PHASES.INHALE;
    this.animationId = null;
    this.transitionStartTime = 0;
    this.isTransitioning = false;
    
    this.initializeBackground();
  }

  /**
   * Initialize the background with the first palette
   */
  initializeBackground() {
    this.applyGradient(COLOR_PALETTES[0], 0);
  }

  /**
   * Update background based on breathing progress
   * @param {string} phase - Current breathing phase
   * @param {number} progress - Progress within phase (0-1)
   * @param {number} setNumber - Current set number
   * @param {number} totalSets - Total number of sets
   */
  update(phase, progress, setNumber, totalSets) {
    this.currentPhase = phase;
    
    // Enhanced palette selection for better distribution
    const sessionProgress = (setNumber - 1) / totalSets;
    
    // Use different strategies based on session length
    let paletteIndex;
    if (totalSets <= 5) {
      // Short sessions: slower progression through palettes
      paletteIndex = Math.floor(sessionProgress * Math.min(6, COLOR_PALETTES.length));
    } else if (totalSets <= 15) {
      // Medium sessions: moderate progression
      paletteIndex = Math.floor(sessionProgress * Math.min(12, COLOR_PALETTES.length));
    } else {
      // Long sessions: use more palettes with slight randomization
      const baseIndex = Math.floor(sessionProgress * COLOR_PALETTES.length);
      // Add subtle variation every few sets to avoid predictability
      const variation = Math.floor((setNumber - 1) / 3) % 3 - 1;
      paletteIndex = Math.max(0, Math.min(COLOR_PALETTES.length - 1, baseIndex + variation));
    }
    
    // Switch palette if needed
    if (paletteIndex !== this.currentPaletteIndex) {
      this.transitionToPalette(paletteIndex);
    }
    
    // Apply breathing animation to current palette
    this.animateBreathing(progress);
  }

  /**
   * Transition to a new color palette
   * @param {number} paletteIndex - Index of the new palette
   */
  transitionToPalette(paletteIndex) {
    if (this.isTransitioning) return;
    
    this.isTransitioning = true;
    this.transitionStartTime = performance.now();
    const duration = 2000; // 2 seconds transition
    
    const oldPalette = COLOR_PALETTES[this.currentPaletteIndex];
    const newPalette = COLOR_PALETTES[paletteIndex];
    
    const animate = (currentTime) => {
      const elapsed = currentTime - this.transitionStartTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Smooth easing
      const easeProgress = 1 - Math.cos((progress * Math.PI) / 2);
      
      // Interpolate between palettes
      const color1 = interpolateColor(oldPalette[0], newPalette[0], easeProgress);
      const color2 = interpolateColor(oldPalette[1], newPalette[1], easeProgress);
      
      this.applyGradient([color1, color2], 0);
      
      if (progress >= 1) {
        this.currentPaletteIndex = paletteIndex;
        this.isTransitioning = false;
      } else {
        this.animationId = requestAnimationFrame(animate);
      }
    };
    
    this.animationId = requestAnimationFrame(animate);
  }

  /**
   * Animate the breathing effect within the current palette
   * @param {number} progress - Breathing progress (0-1)
   */
  animateBreathing(progress) {
    if (this.isTransitioning) return;
    
    const palette = COLOR_PALETTES[this.currentPaletteIndex];
    let intensity = 0;
    
    if (this.currentPhase === BREATHING_PHASES.INHALE) {
      // Gradually intensify during inhale
      intensity = progress * 0.3;
    } else {
      // Gradually fade during exhale
      intensity = (1 - progress) * 0.3;
    }
    
    this.applyGradient(palette, intensity);
  }

  /**
   * Apply gradient to the background element
   * @param {Array} colors - Array of color strings
   * @param {number} intensity - Intensity modifier (0-1)
   */
  applyGradient(colors, intensity) {
    const [color1, color2] = colors;
    
    // Adjust colors based on intensity
    const adjustedColor1 = this.adjustColorIntensity(color1, intensity);
    const adjustedColor2 = this.adjustColorIntensity(color2, intensity);
    
    // Create gradient with smooth transitions
    const gradient = `linear-gradient(135deg, ${adjustedColor1} 0%, ${adjustedColor2} 100%)`;
    
    this.element.style.background = gradient;
    this.element.style.backgroundSize = '200% 200%';
    this.element.style.backgroundPosition = `${50 + intensity * 25}% ${50 + intensity * 25}%`;
    
    // Add subtle animation
    this.element.style.transition = 'background-position 0.3s ease-out';
  }

  /**
   * Adjust color intensity for breathing effect
   * @param {string} color - Hex color string
   * @param {number} intensity - Intensity modifier (0-1)
   * @returns {string} Adjusted color
   */
  adjustColorIntensity(color, intensity) {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Brighten or darken based on intensity
    const factor = 1 + (intensity * 0.2);
    
    const newR = Math.min(255, Math.floor(r * factor));
    const newG = Math.min(255, Math.floor(g * factor));
    const newB = Math.min(255, Math.floor(b * factor));
    
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
  }

  /**
   * Set a specific palette manually
   * @param {number} paletteIndex - Index of the palette to use
   */
  setPalette(paletteIndex) {
    if (paletteIndex >= 0 && paletteIndex < COLOR_PALETTES.length) {
      this.currentPaletteIndex = paletteIndex;
      this.applyGradient(COLOR_PALETTES[paletteIndex], 0);
    }
  }

  /**
   * Reset to initial state
   */
  reset() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    this.currentPaletteIndex = 0;
    this.isTransitioning = false;
    this.initializeBackground();
  }

  /**
   * Create a pulse effect for session transitions
   */
  pulseEffect() {
    const duration = 1000;
    const startTime = performance.now();
    const originalPalette = COLOR_PALETTES[this.currentPaletteIndex];
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = elapsed / duration;
      
      if (progress >= 1) return;
      
      // Create pulse intensity
      const pulse = Math.sin(progress * Math.PI * 4) * 0.3;
      this.applyGradient(originalPalette, Math.abs(pulse));
      
      requestAnimationFrame(animate);
    };
    
    requestAnimationFrame(animate);
  }

  /**
   * Cleanup resources
   */
  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}
