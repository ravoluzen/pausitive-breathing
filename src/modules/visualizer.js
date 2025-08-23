import { ANIMATION, BREATHING_PHASES } from '../utils/constants.js';

/**
 * Manages the circular breathing visualization
 */
export class Visualizer {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    this.centerX = 0;
    this.centerY = 0;
    this.radius = ANIMATION.CIRCLE_RADIUS;
    this.strokeWidth = ANIMATION.STROKE_WIDTH;
    this.currentPhase = BREATHING_PHASES.INHALE;
    this.progress = 0;
    this.animationId = null;
    
    this.setupCanvas();
  }

  /**
   * Setup canvas dimensions and properties
   */
  setupCanvas() {
    this.resizeCanvas();
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    
    // Handle window resize
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  /**
   * Resize canvas to fit container
   */
  resizeCanvas() {
    const rect = this.canvas.getBoundingClientRect();
    const devicePixelRatio = window.devicePixelRatio || 1;
    
    this.canvas.width = rect.width * devicePixelRatio;
    this.canvas.height = rect.height * devicePixelRatio;
    
    this.centerX = this.canvas.width / 2;
    this.centerY = this.canvas.height / 2;
    
    this.ctx.scale(devicePixelRatio, devicePixelRatio);
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
  }

  /**
   * Update the visualization
   * @param {string} phase - Current breathing phase
   * @param {number} progress - Progress within current phase (0-1)
   */
  update(phase, progress) {
    this.currentPhase = phase;
    this.progress = progress;
    this.draw();
  }

  /**
   * Draw the breathing circle
   */
  draw() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    const centerX = this.centerX / (window.devicePixelRatio || 1);
    const centerY = this.centerY / (window.devicePixelRatio || 1);
    
    // Draw background circle (subtle guide)
    this.drawBackgroundCircle(centerX, centerY);
    
    // Draw progress arc
    this.drawProgressArc(centerX, centerY);
    
    // Draw center dot
    this.drawCenterDot(centerX, centerY);
  }

  /**
   * Draw the background guide circle
   * @param {number} centerX - Center X coordinate
   * @param {number} centerY - Center Y coordinate
   */
  drawBackgroundCircle(centerX, centerY) {
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, this.radius, 0, 2 * Math.PI);
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
  }

  /**
   * Draw the progress arc
   * @param {number} centerX - Center X coordinate
   * @param {number} centerY - Center Y coordinate
   */
  drawProgressArc(centerX, centerY) {
    const startAngle = -Math.PI / 2; // Start from top
    const endAngle = startAngle + (2 * Math.PI * this.progress);
    
    // Create gradient for the arc
    const gradient = this.ctx.createLinearGradient(
      centerX - this.radius, centerY - this.radius,
      centerX + this.radius, centerY + this.radius
    );
    
    if (this.currentPhase === BREATHING_PHASES.INHALE) {
      gradient.addColorStop(0, '#3B82F6'); // Blue
      gradient.addColorStop(1, '#1E40AF'); // Darker blue
    } else {
      gradient.addColorStop(0, '#10B981'); // Green
      gradient.addColorStop(1, '#047857'); // Darker green
    }
    
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, this.radius, startAngle, endAngle);
    this.ctx.strokeStyle = gradient;
    this.ctx.lineWidth = this.strokeWidth;
    this.ctx.stroke();
    
    // Add a subtle glow effect
    this.ctx.shadowColor = this.currentPhase === BREATHING_PHASES.INHALE ? '#3B82F6' : '#10B981';
    this.ctx.shadowBlur = 10;
    this.ctx.stroke();
    this.ctx.shadowBlur = 0;
  }

  /**
   * Draw the center indicator dot
   * @param {number} centerX - Center X coordinate
   * @param {number} centerY - Center Y coordinate
   */
  drawCenterDot(centerX, centerY) {
    const scale = this.currentPhase === BREATHING_PHASES.INHALE 
      ? 1 + (this.progress * 0.3) 
      : 1.3 - (this.progress * 0.3);
    
    const dotRadius = 8 * scale;
    
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, dotRadius, 0, 2 * Math.PI);
    this.ctx.fillStyle = this.currentPhase === BREATHING_PHASES.INHALE 
      ? 'rgba(59, 130, 246, 0.8)' 
      : 'rgba(16, 185, 129, 0.8)';
    this.ctx.fill();
    
    // Add subtle outer ring
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, dotRadius + 4, 0, 2 * Math.PI);
    this.ctx.strokeStyle = this.currentPhase === BREATHING_PHASES.INHALE 
      ? 'rgba(59, 130, 246, 0.3)' 
      : 'rgba(16, 185, 129, 0.3)';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
  }

  /**
   * Start a smooth transition animation
   * @param {string} fromPhase - Starting phase
   * @param {string} toPhase - Target phase
   * @param {Function} onComplete - Callback when transition completes
   */
  transitionPhase(fromPhase, toPhase, onComplete) {
    const duration = ANIMATION.TRANSITION_DURATION;
    const startTime = performance.now();
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Smooth easing function
      const easeProgress = 1 - Math.cos((progress * Math.PI) / 2);
      
      this.draw();
      
      if (progress >= 1) {
        this.currentPhase = toPhase;
        if (onComplete) onComplete();
      } else {
        this.animationId = requestAnimationFrame(animate);
      }
    };
    
    this.animationId = requestAnimationFrame(animate);
  }

  /**
   * Reset the visualization
   */
  reset() {
    this.currentPhase = BREATHING_PHASES.INHALE;
    this.progress = 0;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    this.draw();
  }

  /**
   * Cleanup resources
   */
  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    window.removeEventListener('resize', this.resizeCanvas);
  }
}
